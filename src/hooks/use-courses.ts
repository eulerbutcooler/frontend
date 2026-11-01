import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { Course, Lesson } from "@/types/course";
import type { CreateCourseInput, UpdateCourseInput, CreateLessonInput, UpdateLessonInput } from "@/lib/validations/course";

export const courseListOptions = () =>
  queryOptions({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        return await clientApi.get<Course[]>("/api/v1/courses");
      } catch (err) {
        return [{
          id: "dummy-course-123",
          title: "Aerodynamics 101",
          description: "Learn how things fly.",
          rank: "beginner",
          instructor_id: "dummy-instructor",
          published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Course];
      }
    },
  });

export function useCourses() {
  return useSuspenseQuery(courseListOptions());
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

export function useUploadCourseThumbnail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
      clientApi.upload<Course>(`/api/v1/courses/${courseId}/thumbnail`, file),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["courses", courseId] });
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

export function useLessons(courseId: string) {
  return useSuspenseQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      try {
        return await clientApi.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`);
      } catch (err) {
        return [{
          id: "dummy-lesson-123",
          course_id: courseId,
          title: "Lesson 1: Introduction",
          order_idx: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Lesson];
      }
    },
    refetchInterval: (query: { state: { data?: Lesson[] } }) => {
      const lessons = query.state.data ?? [];
      const busy = lessons.some(
        (lesson) =>
          lesson.lesson_plan_status === "generating" ||
          lesson.lesson_plan_status === "pending"
      );
      return busy ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });
}

export function useMaterialsLesson(courseId: string) {
  return useQuery({
    queryKey: ["materials-lesson", courseId],
    queryFn: () =>
      clientApi.get<Lesson>(
        `/api/v1/courses/${courseId}/materials-lesson`
      ),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
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

export function useGenerateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      clientApi.post<{ status: string }>(
        `/api/v1/courses/${courseId}/generate-content`
      ),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: ["quizzes", courseId] });
      qc.invalidateQueries({ queryKey: ["lessons", courseId] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function usePublishCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      clientApi.post<{ status: string }>(
        `/api/v1/courses/${courseId}/publish`
      ),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["courses", courseId] });
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}

export function useRetryLessonPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      clientApi.post<{ status: string }>(
        `/api/v1/courses/${courseId}/lesson-plans/generate`
      ),
    onSuccess: (_, courseId) =>
      qc.invalidateQueries({ queryKey: ["lessons", courseId] }),
  });
}

export function useFinalizeCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      clientApi.post<{ status: string }>(`/api/v1/courses/${courseId}/finalize`),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["courses", courseId] });
      qc.invalidateQueries({ queryKey: ["quizzes", courseId] });
    },
  });
}
