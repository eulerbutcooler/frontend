"use client";

import { getSession } from "next-auth/react";
import { ApiClientError } from "@/types/api";
import type { ApiEnvelope } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.accessToken ?? null;
}

class ClientApiClient {
  async fetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...opts?.headers,
      },
    });

    if (res.status === 204) return undefined as T;

    const envelope: ApiEnvelope<T> = await res.json();
    if (envelope.error) {
      throw new ApiClientError(
        envelope.error.code,
        envelope.error.message,
        res.status
      );
    }
    return envelope.data as T;
  }

  async get<T>(path: string): Promise<T> {
    return this.fetch<T>(path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async del(path: string): Promise<void> {
    await this.fetch<void>(path, { method: "DELETE" });
  }
}

export const clientApi = new ClientApiClient();
