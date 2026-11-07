import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const RAG_URL = (
  process.env.RAG_URL ||
  process.env.RAG_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const internalToken = process.env.INTERNAL_TOKEN;
  if (!internalToken) {
    return NextResponse.json(
      { error: "Audio service is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const upstream = await fetch(`${RAG_URL}/api/v1/audio/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": internalToken,
      },
      body: JSON.stringify(body),
    });
    
    if (!upstream.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: upstream.status });
    }
    
    const contentType = upstream.headers.get("content-type") || "application/x-ndjson";
    
    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
