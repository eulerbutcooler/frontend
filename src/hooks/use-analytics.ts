import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type {
  AnalyticsOverview,
  CourseMetric,
  StudentAnalytics,
  InstructorAnalytics,
} from "@/types/analytics";

const analyticsOverviewOptions = () =>
  queryOptions({
    queryKey: ["analytics"],
    queryFn: () => clientApi.get<AnalyticsOverview>("/api/v1/analytics"),
  });

const courseMetricsOptions = (courseId: string) =>
  queryOptions({
    queryKey: ["analytics", courseId],
    queryFn: () =>
      clientApi.get<CourseMetric>(`/api/v1/analytics/${courseId}`),
    enabled: !!courseId,
  });

export function useAnalyticsOverview() {
  return useSuspenseQuery(analyticsOverviewOptions());
}

export function useCourseMetrics(courseId: string) {
  return useSuspenseQuery(courseMetricsOptions(courseId));
}

export function useStudentAnalytics() {
  return useQuery({
    queryKey: ["analytics", "student"],
    queryFn: () => clientApi.get<StudentAnalytics>("/api/v1/analytics/student"),
  });
}

export function useInstructorAnalytics() {
  return useQuery({
    queryKey: ["analytics", "instructor"],
    queryFn: () =>
      clientApi.get<InstructorAnalytics>("/api/v1/analytics/instructor"),
  });
}
