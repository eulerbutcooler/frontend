"use client";

import { SessionProvider } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
import { ApiClientError } from "@/types/api";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Something went wrong";
        toast.error(message);
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <SessionProvider refetchInterval={14 * 60} refetchOnWindowFocus>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-card, #f5f0e0)",
              border: "1px solid var(--color-hairline, #e5e5e5)",
              color: "var(--color-ink, #0a0a0a)",
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}

