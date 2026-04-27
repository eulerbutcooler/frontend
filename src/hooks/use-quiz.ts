import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { Quiz, Attempt, Answer } from "@/types/quiz";
import type { SubmitAnswerInput } from "@/lib/validations/quiz";

interface AttemptResults {
  attempt: Attempt;
  answers: Answer[];
}

export const quizListOptions = (courseId: string) =>
  queryOptions({
    queryKey: ["quizzes", courseId],
    queryFn: () => clientApi.get<Quiz[]>(`/api/v1/courses/${courseId}/quizzes`),
    enabled: !!courseId,
  });

export const quizDetailOptions = (quizId: string) =>
  queryOptions({
    queryKey: ["quizzes", "detail", quizId],
    queryFn: () => clientApi.get<Quiz>(`/api/v1/quizzes/${quizId}`),
    enabled: !!quizId,
  });

export const attemptResultsOptions = (attemptId: string) =>
  queryOptions({
    queryKey: ["attempts", attemptId],
    queryFn: () =>
      clientApi.get<AttemptResults>(`/api/v1/attempts/${attemptId}/results`),
    enabled: !!attemptId,
  });

export function useQuizzes(courseId: string) {
  return useSuspenseQuery(quizListOptions(courseId));
}

export function useQuizDetail(quizId: string) {
  return useSuspenseQuery(quizDetailOptions(quizId));
}

export function useAttemptResults(attemptId: string) {
  return useSuspenseQuery(attemptResultsOptions(attemptId));
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: (quizId: string) =>
      clientApi.post<Attempt>(`/api/v1/quizzes/${quizId}/attempt`),
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      attemptId,
      data,
    }: {
      attemptId: string;
      data: SubmitAnswerInput;
    }) => clientApi.post<Answer>(`/api/v1/attempts/${attemptId}/answer`, data),
  });
}

export function useFinishAttempt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) =>
      clientApi.post<Attempt>(`/api/v1/attempts/${attemptId}/finish`),
    onSuccess: (_, attemptId) =>
      qc.invalidateQueries({ queryKey: ["attempts", attemptId] }),
  });
}

export function useResetQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (quizId: string) =>
      clientApi.post<{ status: string }>(`/api/v1/quizzes/${quizId}/reset`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quizzes"] }),
  });
}
