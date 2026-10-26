import { NextResponse } from "next/server";

const RAG_URL = (
  process.env.RAG_URL ||
  process.env.RAG_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${RAG_URL}/api/v1/audio/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": process.env.INTERNAL_TOKEN || "changeme-internal-token",
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
