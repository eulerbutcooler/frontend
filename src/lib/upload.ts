import * as tus from "tus-js-client";

const TUS_ENDPOINT =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080") +
  "/api/v1/files/tus/";

interface UploadMetadata {
  lessonId: string;
  fileType: string;
  instructorId: string;
}

export function createUpload(
  file: File,
  metadata: UploadMetadata,
  callbacks: {
    onProgress: (pct: number) => void;
    onSuccess: () => void;
    onError: (err: Error) => void;
  },
  token: string
): tus.Upload {
  return new tus.Upload(file, {
    endpoint: TUS_ENDPOINT,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      lesson_id: metadata.lessonId,
      file_name: file.name,
      file_type: metadata.fileType,
      instructor_id: metadata.instructorId,
    },
    headers: { Authorization: `Bearer ${token}` },
    onProgress: (bytesUploaded, bytesTotal) =>
      callbacks.onProgress((bytesUploaded / bytesTotal) * 100),
    onSuccess: callbacks.onSuccess,
    onError: (err) =>
      callbacks.onError(
        err instanceof Error ? err : new Error(String(err))
      ),
  });
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function mapExtensionToFileType(ext: string): string {
  const map: Record<string, string> = {
    pdf: "pdf",
    ppt: "ppt",
    pptx: "ppt",
    docx: "docx",
  };
  return map[ext] ?? ext;
}

export const ACCEPTED_EXTENSIONS = [".pdf", ".ppt", ".pptx", ".docx"];
export const ACCEPTED_MIME_TYPES =
  "application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
