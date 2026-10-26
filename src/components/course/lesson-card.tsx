"use client";

import { useState, useRef, useEffect } from "react";
import { Upload } from "tus-js-client";
import { Move, FileText, CheckCircle2, Loader2, Plus, Edit2 } from "lucide-react";
import { useUpdateLesson } from "@/hooks/use-courses";
import type { Lesson, FileAsset } from "@/types/course";
import { clientApi } from "@/lib/api-client.client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSession } from "next-auth/react";

interface LessonCardProps {
  lesson: Lesson;
  courseId: string;
  instructorId: string;
}

export function LessonCard({ lesson, courseId, instructorId }: LessonCardProps) {
  const { data: session } = useSession();
  const { mutate: updateLesson } = useUpdateLesson();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: files = [] } = useQuery({
    queryKey: ["files", lesson.id],
    queryFn: () => clientApi.get<FileAsset[]>(`/api/v1/lessons/${lesson.id}/files`),
    refetchInterval: 3000,
  });

  const [uploads, setUploads] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    if (title.trim() && title !== lesson.title) {
      updateLesson({ id: lesson.id, data: { title: title.trim(), order_idx: lesson.order_idx } });
    } else {
      setTitle(lesson.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveTitle();
    if (e.key === "Escape") {
      setTitle(lesson.title);
      setIsEditing(false);
    }
  };

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file) => {
      const uploadId = Math.random().toString(36).substring(7);
      
      setUploads(prev => ({ ...prev, [file.name]: 0 }));

      const ext = file.name.split('.').pop()?.toLowerCase();
      let fileType = "pdf";
      if (ext === "docx" || ext === "doc") fileType = "docx";
      else if (ext === "pptx" || ext === "ppt" || ext === "ppsx") fileType = "ppt";

      const upload = new Upload(file, {
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/tus/`,
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          file_name: file.name,
          file_type: fileType,
          lesson_id: lesson.id,
          instructor_id: instructorId,
        },
        onError: function (error) {
          console.log("Failed because: " + error);
          toast.error(`Upload failed: ${error.message}`);
          setUploads(prev => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploads(prev => ({ ...prev, [file.name]: parseFloat(percentage) }));
        },
        onSuccess: function () {
          setUploads(prev => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
        },
      });
      upload.start();
    });
    
    // Clear input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden group">
      {/* Header */}
      <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[13px] font-semibold text-gray-900 w-full">
          <Move className="w-4 h-4 text-gray-400 cursor-grab shrink-0" />
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 text-[13px] border border-blue-500 rounded outline-none font-normal"
              />
            </div>
          ) : (
            <span className="flex-1 truncate">{lesson.title}</span>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">
        {files.length > 0 && (
          <div className="flex flex-col gap-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-gray-900 truncate pr-4">
                    {file.file_name}
                  </span>
                  {file.ingest_status === "ready" ? (
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready
                    </span>
                  ) : file.ingest_status === "failed" ? (
                    <span className="text-[12px] font-medium text-red-600 shrink-0">Failed</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 shrink-0">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.entries(uploads).map(([name, progress]) => (
          <div key={name} className="flex flex-col gap-2 p-3 border border-blue-200 bg-blue-50/50 rounded-lg">
            <div className="flex justify-between text-[12px] font-medium text-gray-700">
              <span className="truncate">{name}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ))}

        {/* Add Material Dropzone */}
        <label className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer group/lesson text-gray-500 hover:text-gray-900">
          <Plus className="w-4 h-4" />
          <span className="text-[13px] font-medium">Add Material</span>
          <input type="file" multiple className="hidden" onChange={onFileDrop} accept=".pdf,.pptx,.ppsx,.docx" />
        </label>
      </div>
    </div>
  );
}
