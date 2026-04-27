import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";

interface FileViewUrlResponse {
  url: string;
}

export function useFileViewUrl(fileId: string | null) {
  return useQuery({
    queryKey: ["file-url", fileId],
    queryFn: () =>
      clientApi.get<FileViewUrlResponse>(`/api/v1/files/${fileId}/view`),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000,
  });
}
