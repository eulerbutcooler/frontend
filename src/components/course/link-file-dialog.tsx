"use client";

import { useEffect, useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { clientApi } from "@/lib/api-client.client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FileAsset, LinkableFile } from "@/types/course";

interface LinkFileDialogProps {
  courseId: string;
  lessonId: string;
  open: boolean;
  onClose: () => void;
}

export function LinkFileDialog({
  courseId,
  lessonId,
  open,
  onClose,
}: LinkFileDialogProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState("");

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["linkable-files", courseId],
    queryFn: () =>
      clientApi.get<LinkableFile[]>(
        `/api/v1/courses/${courseId}/linkable-files`
      ),
    enabled: open,
  });

  useEffect(() => {
    if (!open) setSelected("");
  }, [open]);

  const link = useMutation({
    mutationFn: (sourceFileId: string) =>
      clientApi.post<FileAsset>(`/api/v1/courses/${courseId}/materials/link`, {
        source_file_id: sourceFileId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["course-content", courseId] });
      queryClient.invalidateQueries({ queryKey: ["linkable-files", courseId] });
      toast.success("File linked to this subject.");
      onClose();
    },
  });

  if (!open) return null;

  const grouped = files.reduce<Record<string, LinkableFile[]>>((acc, file) => {
    (acc[file.course_title] ||= []).push(file);
    return acc;
  }, {});

  const submit = async () => {
    if (!selected) return;
    try {
      await link.mutateAsync(selected);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not link the file."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-600" />
            Link an existing file
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Reuse a reference file from another subject. Its vectors are copied
            without re-uploading or re-embedding.
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <p className="text-[13px] text-gray-500 py-6 text-center">
              No other ready reference files are available to link.
            </p>
          ) : (
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a file…</option>
              {Object.entries(grouped).map(([courseTitle, courseFiles]) => (
                <optgroup key={courseTitle} label={courseTitle}>
                  {courseFiles.map((file) => (
                    <option key={file.file_id} value={file.file_id}>
                      {file.file_name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!selected || link.isPending}
            className="h-9 px-4 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {link.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Link file
          </button>
        </div>
      </div>
    </div>
  );
}
