import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

/**
 * Stable, same-origin file URL. Replaces the old
 * /api/files/proxy?url=<presigned-url> form so the browser never sees the
 * storage host or signature.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { fileId } = await params;

  const metaRes = await fetch(`${API_URL}/api/v1/files/${fileId}/view`, {
    headers: { Authorization: `Bearer ${session.user.accessToken}` },
    cache: "no-store",
  });
  if (!metaRes.ok) {
    return new NextResponse("File unavailable", { status: metaRes.status });
  }

  const envelope = await metaRes.json();
  const url: string | undefined = envelope?.data?.url;
  if (!url) {
    return new NextResponse("File unavailable", { status: 404 });
  }

  const range = req.headers.get("range");
  const fileRes = await fetch(url, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  if (!fileRes.ok && fileRes.status !== 206) {
    return new NextResponse("Could not fetch file", {
      status: fileRes.status,
    });
  }

  const headers = new Headers();
  const contentType =
    fileRes.headers.get("content-type") ?? "application/octet-stream";
  const inline = /^(application\/pdf|image\/|video\/|audio\/|text\/)/i.test(
    contentType
  );
  headers.set("Content-Type", contentType);
  headers.set(
    "Content-Disposition",
    fileRes.headers.get("content-disposition") ??
      (inline ? "inline" : "attachment")
  );
  headers.set("Accept-Ranges", fileRes.headers.get("accept-ranges") ?? "bytes");
  headers.set("Cache-Control", "private, max-age=60");
  headers.set("X-Content-Type-Options", "nosniff");
  const contentLength = fileRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentRange = fileRes.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new NextResponse(fileRes.body, {
    status: fileRes.status,
    headers,
  });
}
