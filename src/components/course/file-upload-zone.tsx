"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, CloudUpload } from "lucide-react";
import { UploadProgress, type UploadProgressStatus } from "./upload-progress";
import {
  createUpload,
  getFileExtension,
  mapExtensionToFileType,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
} from "@/lib/upload";
import type { Upload as TusUpload } from "tus-js-client";

interface FileUploadZoneProps {
  lessonId: string;
  instructorId: string;
  allowedFileType?: "pdf" | "ppt" | "docx" | "video";
}

type UploadItemStatus = UploadProgressStatus;

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadItemStatus;
  error?: string;
}

/**
 * Upload a few files at a time. The old UI replaced the dropzone with a single
 * progress card and only restored it after the file finished ingesting, which
 * forced instructors to upload large courses one document at a time.
 */
const MAX_CONCURRENT_UPLOADS = 2;

function getAllowedExtensions(
  allowedFileType?: FileUploadZoneProps["allowedFileType"]
): string[] {
  if (allowedFileType === "pdf") return [".pdf"];
  if (allowedFileType === "ppt") return [".pptx", ".ppsx"];
  if (allowedFileType === "docx") return [".docx"];
  if (allowedFileType === "video") return [".mp4", ".mov", ".webm", ".mkv"];
  return ACCEPTED_EXTENSIONS;
}

export function FileUploadZone({
  lessonId,
  instructorId,
  allowedFileType,
}: FileUploadZoneProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeUploadsRef = useRef<Map<string, TusUpload>>(new Map());
  const startedIdsRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<number[]>([]);
  const nextIdRef = useRef(0);

  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const token = session?.user?.accessToken ?? "";

  const startUpload = useCallback(
    (item: UploadItem) => {
      if (!token) {
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === item.id
              ? { ...upload, status: "error", error: "You are not signed in." }
              : upload
          )
        );
        return;
      }

      const ext = getFileExtension(item.file.name);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === item.id
            ? { ...upload, status: "uploading", progress: 0, error: undefined }
            : upload
        )
      );

      let upload: TusUpload;
      try {
        upload = createUpload(
          item.file,
          {
            lessonId,
            fileType: mapExtensionToFileType(ext),
            instructorId,
          },
          {
            onProgress: (pct) =>
              setUploads((prev) =>
                prev.map((upload) =>
                  upload.id === item.id ? { ...upload, progress: pct } : upload
                )
              ),
            onSuccess: () => {
              activeUploadsRef.current.delete(item.id);
              setUploads((prev) =>
                prev.map((upload) =>
                  upload.id === item.id
                    ? { ...upload, status: "uploaded", progress: 100 }
                    : upload
                )
              );

              // The TUS completion hook creates the database row asynchronously.
              // Invalidate now and shortly after so the file list can pick up the
              // new row even if the first refetch raced the hook.
              const invalidate = () => {
                queryClient.invalidateQueries({
                  queryKey: ["files", lessonId],
                  refetchType: "all",
                });
              };
              invalidate();
              timersRef.current.push(window.setTimeout(invalidate, 1000));
              timersRef.current.push(window.setTimeout(invalidate, 3000));
              timersRef.current.push(window.setTimeout(invalidate, 6000));
              timersRef.current.push(
                window.setTimeout(() => {
                  setUploads((prev) =>
                    prev.filter((upload) => upload.id !== item.id)
                  );
                }, 5000)
              );
            },
            onError: (err) => {
              activeUploadsRef.current.delete(item.id);
              setUploads((prev) =>
                prev.map((upload) =>
                  upload.id === item.id
                    ? { ...upload, status: "error", error: err.message }
                    : upload
                )
              );
            },
          },
          token
        );
      } catch (err) {
        activeUploadsRef.current.delete(item.id);
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === item.id
              ? {
                  ...upload,
                  status: "error",
                  error: err instanceof Error ? err.message : String(err),
                }
              : upload
          )
        );
        return;
      }

      activeUploadsRef.current.set(item.id, upload);
      upload.start();
    },
    [instructorId, lessonId, queryClient, token]
  );

  // Keep at most MAX_CONCURRENT_UPLOADS in flight and start the next queued
  // item whenever a slot frees up.
  useEffect(() => {
    const active = uploads.filter((upload) => upload.status === "uploading").length;
    if (active >= MAX_CONCURRENT_UPLOADS) return;

    const next = uploads.find(
      (upload) =>
        upload.status === "queued" && !startedIdsRef.current.has(upload.id)
    );
    if (!next) return;

    // Guard against React Strict Mode running this effect twice and starting
    // the same TUS upload twice.
    startedIdsRef.current.add(next.id);
    startUpload(next);
  }, [uploads, startUpload]);

  useEffect(() => {
    const activeUploads = activeUploadsRef.current;
    const timers = timersRef.current;
    return () => {
      // Do not abort in-flight uploads when the lesson accordion closes or
      // the page unmounts: a bulk upload should keep going. The TUS upload
      // objects are kept alive by their XHR callbacks.
      activeUploads.clear();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.length = 0;
    };
  }, []);

  const enqueueFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const allowedExts = getAllowedExtensions(allowedFileType);

      const items: UploadItem[] = files.map((file): UploadItem => {
        const ext = getFileExtension(file.name);
        const unsupported = !allowedExts.includes(`.${ext}`);
        return {
          id: `upload-${nextIdRef.current++}`,
          file,
          progress: 0,
          status: unsupported ? "error" : "queued",
          error: unsupported ? `Unsupported file type: .${ext}` : undefined,
        };
      });

      setUploads((prev) => [...prev, ...items]);
    },
    [allowedFileType]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    enqueueFiles(Array.from(e.dataTransfer.files));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    enqueueFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const cancelUpload = (id: string) => {
    activeUploadsRef.current.get(id)?.abort();
    activeUploadsRef.current.delete(id);
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const dismissUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  return (
    <div className="space-y-2">
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((item) => (
            <UploadProgress
              key={item.id}
              fileName={item.file.name}
              progress={item.progress}
              status={item.status}
              errorMessage={item.error}
              onCancel={
                item.status === "uploading"
                  ? () => cancelUpload(item.id)
                  : undefined
              }
              onDismiss={
                item.status === "uploaded" || item.status === "error"
                  ? () => dismissUpload(item.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label={`Upload ${allowedFileType ?? "files"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`focus-ring grid w-full place-items-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-[border-color,background-color] duration-150 ease-snappy ${
          dragOver
            ? "border-brand-teal bg-brand-teal/5"
            : "border-hairline hover:border-outline-variant hover:bg-surface-soft"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={
            allowedFileType === "pdf"
              ? "application/pdf"
              : allowedFileType === "ppt"
                ? "application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.slideshow"
                : allowedFileType === "docx"
                  ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  : allowedFileType === "video"
                    ? "video/mp4,video/quicktime,video/webm,video/x-matroska"
                    : ACCEPTED_MIME_TYPES
          }
          className="sr-only"
          onChange={handleSelect}
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          {dragOver ? (
            <CloudUpload className="h-8 w-8 text-brand-teal" />
          ) : (
            <Upload className="h-8 w-8 text-surface-tint" />
          )}
          <p className="text-body-sm text-surface-tint">
            <span className="font-semibold text-ink">Click to upload</span> or
            drag and drop
          </p>
          <p className="text-caption text-outline">
            {allowedFileType === "pdf"
              ? "PDF"
              : allowedFileType === "ppt"
                ? "PPTX, PPSX"
                : allowedFileType === "docx"
                  ? "DOCX"
                  : allowedFileType === "video"
                    ? "MP4, MOV, WEBM, MKV"
                    : "PDF, PPTX, PPSX, DOCX, Video"}{" "}
            · Select multiple files at once
          </p>
        </div>
      </button>
    </div>
  );
}
