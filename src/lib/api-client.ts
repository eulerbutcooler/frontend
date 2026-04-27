import { auth } from "@/lib/auth";
import { ApiClientError } from "@/types/api";
import type { ApiEnvelope } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

class ApiClient {
  private async getHeaders(opts?: RequestInit): Promise<HeadersInit> {
    const session = await auth();
    return {
      "Content-Type": "application/json",
      ...(session?.user?.accessToken && {
        Authorization: `Bearer ${session.user.accessToken}`,
      }),
      ...opts?.headers,
    };
  }

  async fetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const headers = await this.getHeaders(opts);
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      headers,
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

export const api = new ApiClient();
