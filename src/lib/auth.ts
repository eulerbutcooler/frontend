import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isTokenExpired } from "./auth-utils";
import type { ApiEnvelope } from "@/types/api";
import type { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

async function loginUser(
  enrollmentId: string,
  password: string
): Promise<{ tokens: TokenPair; user: User } | null> {
  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      enrollment_id: enrollmentId,
      password,
    }),
  });

  if (!loginRes.ok) return null;

  const loginEnvelope: ApiEnvelope<TokenPair> = await loginRes.json();
  if (loginEnvelope.error || !loginEnvelope.data) return null;

  const tokens = loginEnvelope.data;

  const meRes = await fetch(`${API_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!meRes.ok) return null;

  const meEnvelope: ApiEnvelope<User> = await meRes.json();
  if (meEnvelope.error || !meEnvelope.data) return null;

  return { tokens, user: meEnvelope.data };
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return null;

  const envelope: ApiEnvelope<{ access_token: string }> = await res.json();
  if (envelope.error || !envelope.data) return null;

  return envelope.data.access_token;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        enrollment_id: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const enrollmentId = credentials.enrollment_id as string;
        const password = credentials.password as string;

        if (!enrollmentId || !password) return null;

        const result = await loginUser(enrollmentId, password);
        if (!result) return null;

        return {
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          rank: result.user.rank,
          accessToken: result.tokens.access_token,
          refreshToken: result.tokens.refresh_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as Record<string, unknown>).role as string;
        token.rank = (user as Record<string, unknown>).rank as string;
        token.accessToken = (user as Record<string, unknown>).accessToken as string;
        token.refreshToken = (user as Record<string, unknown>).refreshToken as string;
      }

      if (token.accessToken && isTokenExpired(token.accessToken as string)) {
        const newAccessToken = await refreshAccessToken(token.refreshToken as string);
        if (newAccessToken) {
          token.accessToken = newAccessToken;
        } else {
          token.error = "RefreshTokenExpired";
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as string) ?? "student";
      session.user.rank = (token.rank as string) ?? "";
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
});
