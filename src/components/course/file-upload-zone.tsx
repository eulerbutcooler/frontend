"use client";

import { useCallback, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, CloudUpload } from "lucide-react";
import { UploadProgress } from "./upload-progress";
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
}

export function FileUploadZone({
  lessonId,
  instructorId,
}: FileUploadZoneProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<TusUpload | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "complete" | "error"
  >("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = (session as { accessToken?: string } | null)?.accessToken ?? "";

  const startUpload = useCallback(
    (file: File) => {
      const ext = getFileExtension(file.name);
      if (!ACCEPTED_EXTENSIONS.includes(`.${ext}`)) {
        setErrorMsg(`Unsupported file type: .${ext}`);
        setStatus("error");
        setFileName(file.name);
        return;
      }

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
            setStatus("complete");
            setProgress(100);
            queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
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
    [lessonId, instructorId, token, queryClient]
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
        status={status === "uploading" ? "uploading" : status === "complete" ? "complete" : "error"}
        onCancel={status === "uploading" ? handleCancel : undefined}
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
        ${
          dragOver
            ? "border-brand-teal bg-brand-teal/5"
            : "border-hairline hover:border-outline-variant hover:bg-surface-soft"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES}
        className="hidden"
        onChange={handleSelect}
      />
      <div className="flex flex-col items-center gap-2">
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
          PDF, PPT, PPTX, DOCX
        </p>
      </div>
    </div>
  );
}
