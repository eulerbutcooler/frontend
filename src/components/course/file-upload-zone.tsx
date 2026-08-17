"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, CloudUpload } from "lucide-react";
import { UploadProgress } from "./upload-progress";
import {
  createUpload,
  getFileExtension,
  mapExtensionToFileType,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
} from "@/lib/upload";
import { clientApi } from "@/lib/api-client.client";
import type { FileAsset } from "@/types/course";
import type { Upload as TusUpload } from "tus-js-client";

interface FileUploadZoneProps {
  lessonId: string;
  instructorId: string;
  allowedFileType?: "pdf" | "ppt" | "docx";
}

export function FileUploadZone({
  lessonId,
  instructorId,
  allowedFileType,
}: FileUploadZoneProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<TusUpload | null>(null);
  const existingFileIdsRef = useRef<Set<string>>(new Set());

  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "complete" | "error"
  >("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = session?.user?.accessToken ?? "";

  const { data: lessonFiles = [] } = useQuery({
    queryKey: ["files", lessonId],
    queryFn: () =>
      clientApi.get<FileAsset[]>(`/api/v1/lessons/${lessonId}/files`),
    enabled: status === "processing",
    refetchInterval: status === "processing" ? 2000 : false,
  });

  useEffect(() => {
    if (status !== "processing") return;

    const uploadedFile = lessonFiles.find(
      (file) =>
        file.file_name === fileName && !existingFileIdsRef.current.has(file.id)
    );
    if (!uploadedFile) return;

    if (uploadedFile.ingest_status === "ready") {
      setProgress(100);
      setStatus("complete");
      queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
    } else if (uploadedFile.ingest_status === "failed") {
      setStatus("error");
      setErrorMsg("Upload succeeded, but processing and embedding failed.");
    }
  }, [fileName, lessonFiles, lessonId, queryClient, status]);

  useEffect(() => {
    if (status !== "complete") return;

    const timeout = window.setTimeout(() => {
      setStatus("idle");
      setProgress(0);
      setFileName("");
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [status]);

  const startUpload = useCallback(
    (file: File) => {
      let allowedExts = ACCEPTED_EXTENSIONS;
      if (allowedFileType === "pdf") {
        allowedExts = [".pdf"];
      } else if (allowedFileType === "ppt") {
        allowedExts = [".ppt", ".pptx"];
      } else if (allowedFileType === "docx") {
        allowedExts = [".docx"];
      }

      const ext = getFileExtension(file.name);
      if (!allowedExts.includes(`.${ext}`)) {
        setErrorMsg(`Unsupported file type: .${ext}`);
        setStatus("error");
        setFileName(file.name);
        return;
      }

      const existingFiles =
        queryClient.getQueryData<FileAsset[]>(["files", lessonId]) ?? [];
      existingFileIdsRef.current = new Set(existingFiles.map(({ id }) => id));

      setFileName(file.name);
      setProgress(0);
      setStatus("uploading");
      setErrorMsg("");

      const upload = createUpload(
        file,
        {
          lessonId,
          fileType: mapExtensionToFileType(ext),
          instructorId,
        },
        {
          onProgress: (pct) => setProgress(pct),
          onSuccess: () => {
            setStatus("processing");
            setProgress(100);
            // Force all consumers (FileList, useCourseFiles, publish bar)
            // to refetch immediately — not just on next poll tick.
            queryClient.invalidateQueries({
              queryKey: ["files", lessonId],
              refetchType: "all",
            });
            queryClient.invalidateQueries({
              queryKey: ["ingest-status"],
              refetchType: "all",
            });
          },
          onError: (err) => {
            setStatus("error");
            setErrorMsg(err.message);
          },
        },
        token
      );

      uploadRef.current = upload;
      upload.start();
    },
    [allowedFileType, lessonId, instructorId, token, queryClient]
  );

  const handleCancel = () => {
    uploadRef.current?.abort();
    setStatus("idle");
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) startUpload(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startUpload(file);
    e.target.value = "";
  };

  if (status !== "idle") {
    return (
      <UploadProgress
        fileName={fileName}
        progress={progress}
        status={status}
        onCancel={status === "uploading" ? handleCancel : undefined}
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Upload ${allowedFileType ?? "file"}`}
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
        accept={
          allowedFileType === "pdf" ? "application/pdf" : 
          allowedFileType === "ppt" ? "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" : 
          allowedFileType === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : 
          ACCEPTED_MIME_TYPES
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
          {allowedFileType === "pdf" ? "PDF" : allowedFileType === "ppt" ? "PPT, PPTX" : allowedFileType === "docx" ? "DOCX" : "PDF, PPT, PPTX, DOCX"}
        </p>
      </div>
    </button>
  );
}
