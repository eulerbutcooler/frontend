import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { AnalyticsOverview, CourseMetric } from "@/types/analytics";

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
