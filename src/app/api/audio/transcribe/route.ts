import { NextResponse } from "next/server";

const RAG_URL = (
  process.env.RAG_URL ||
  process.env.RAG_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const upstream = await fetch(`${RAG_URL}/api/v1/audio/transcribe`, {
      method: "POST",
      headers: {
        "X-Internal-Token": process.env.INTERNAL_TOKEN || "changeme-internal-token",
      },
      body: formData,
    });
    
    if (!upstream.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: upstream.status });
    }
    
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
