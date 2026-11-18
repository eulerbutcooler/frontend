import { useQuery } from "@tanstack/react-query";

import { clientApi } from "@/lib/api-client.client";
import type { CourseFigure } from "@/types/course";

export function useCourseFigures(courseId?: string | null) {
  return useQuery({
    queryKey: ["course-figures", courseId],
    queryFn: () =>
      clientApi.get<CourseFigure[]>(`/api/v1/courses/${courseId}/figures`),
    enabled: Boolean(courseId),
    staleTime: 5 * 60 * 1000,
  });
}
