"use client";

import { getSession, signOut } from "next-auth/react";
import { ApiClientError } from "@/types/api";
import type { ApiEnvelope } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.accessToken ?? null;
}

class ClientApiClient {
  private async doFetch(
    path: string,
    token: string | null,
    opts?: RequestInit
  ): Promise<Response> {
    return fetch(`${BASE_URL}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...opts?.headers,
      },
    });
  }

  async fetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    let res = await this.doFetch(path, token, opts);

    if (res.status === 401) {
      const refreshed = await getSession();
      const newToken = refreshed?.user?.accessToken ?? null;
      if (newToken && newToken !== token) {
        res = await this.doFetch(path, newToken, opts);
      } else {
        signOut({ callbackUrl: "/login" });
      }
    }

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
