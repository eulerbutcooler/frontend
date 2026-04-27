import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { IngestStatus } from "@/types/course";

interface IngestStatusResponse {
  status: IngestStatus;
}

export function useIngestStatus(fileId: string | null) {
  return useQuery({
    queryKey: ["ingest-status", fileId],
    queryFn: () =>
      clientApi.get<IngestStatusResponse>(`/api/v1/files/${fileId}/status`),
    enabled: !!fileId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "ready" || status === "failed") return false;
      return 3000;
    },
  });
}
