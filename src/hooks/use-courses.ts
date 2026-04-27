import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { Course, Lesson, FileAsset } from "@/types/course";
import type { CreateCourseInput, UpdateCourseInput, CreateLessonInput, UpdateLessonInput } from "@/lib/validations/course";

export const courseListOptions = () =>
  queryOptions({
    queryKey: ["courses"],
    queryFn: () => clientApi.get<Course[]>("/api/v1/courses"),
  });

export const courseDetailOptions = (courseId: string) =>
  queryOptions({
    queryKey: ["courses", courseId],
    queryFn: () => clientApi.get<Course>(`/api/v1/courses/${courseId}`),
    enabled: !!courseId,
  });

export const lessonListOptions = (courseId: string) =>
  queryOptions({
    queryKey: ["lessons", courseId],
    queryFn: () => clientApi.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
    enabled: !!courseId,
  });

export const fileListOptions = (lessonId: string) =>
  queryOptions({
    queryKey: ["files", lessonId],
    queryFn: () => clientApi.get<FileAsset[]>(`/api/v1/lessons/${lessonId}/files`),
    enabled: !!lessonId,
  });

export function useCourses() {
  return useSuspenseQuery(courseListOptions());
}

export function useCourseDetail(courseId: string) {
  return useSuspenseQuery(courseDetailOptions(courseId));
}

export function useLessons(courseId: string) {
  return useSuspenseQuery(lessonListOptions(courseId));
}

export function useFiles(lessonId: string) {
  return useSuspenseQuery(fileListOptions(lessonId));
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInput) =>
      clientApi.post<Course>("/api/v1/courses", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      clientApi.put<Course>(`/api/v1/courses/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["courses", id] });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.del(`/api/v1/courses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CreateLessonInput;
    }) => clientApi.post<Lesson>(`/api/v1/courses/${courseId}/lessons`, data),
    onSuccess: (_, { courseId }) =>
      qc.invalidateQueries({ queryKey: ["lessons", courseId] }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonInput }) =>
      clientApi.put<Lesson>(`/api/v1/lessons/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; courseId: string }) =>
      clientApi.del(`/api/v1/lessons/${id}`),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["lessons", vars.courseId] }),
  });
}
