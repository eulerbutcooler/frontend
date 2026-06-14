import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Extend the route handler timeout so slow LLM streaming doesn't 504.
export const maxDuration = 300;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sessionId, query } = body as {
    sessionId: string;
    query: string;
  };

  if (!sessionId || !query) {
    return NextResponse.json(
      { error: "sessionId and query are required" },
      { status: 400 }
    );
  }

  const upstream = await fetch(
    `${API_URL}/api/v1/chat/sessions/${sessionId}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!upstream.ok) {
    const text = await upstream.text();
    return NextResponse.json(
      { error: text || "Upstream error" },
      { status: upstream.status }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
