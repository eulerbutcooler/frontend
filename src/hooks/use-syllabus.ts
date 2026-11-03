import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { ApiClientError } from "@/types/api";
import type { CourseSyllabus } from "@/types/course";

export function useCourseSyllabus(courseId: string) {
  return useQuery({
    queryKey: ["syllabus", courseId],
    queryFn: async () => {
      try {
        return await clientApi.get<CourseSyllabus>(
          `/api/v1/courses/${courseId}/syllabus`
        );
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 404) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
  });
}

export function useUploadCourseSyllabus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      file,
      subjectCode,
    }: {
      courseId: string;
      file: File;
      subjectCode?: string;
    }) =>
      clientApi.upload<CourseSyllabus>(
        `/api/v1/courses/${courseId}/syllabus`,
        file,
        "syllabus",
        {
          generate: "true",
          ...(subjectCode ? { subject_code: subjectCode } : {}),
        }
      ),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["syllabus", courseId] });
      qc.invalidateQueries({ queryKey: ["lessons", courseId] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
