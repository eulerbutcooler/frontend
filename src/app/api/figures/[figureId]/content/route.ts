import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

/**
 * Stable, same-origin figure URL. The browser never sees the underlying
 * SeaweedFS URL or its expiring signature; the app server looks up a fresh
 * presigned URL and streams the image.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ figureId: string }> }
) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { figureId } = await params;

  const metaRes = await fetch(`${API_URL}/api/v1/figures/${figureId}`, {
    headers: { Authorization: `Bearer ${session.user.accessToken}` },
    cache: "no-store",
  });
  if (!metaRes.ok) {
    return new NextResponse("Figure unavailable", { status: metaRes.status });
  }

  const envelope = await metaRes.json();
  const url: string | undefined = envelope?.data?.url;
  if (!url) {
    return new NextResponse("Figure unavailable", { status: 404 });
  }

  const range = req.headers.get("range");
  const fileRes = await fetch(url, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  if (!fileRes.ok && fileRes.status !== 206) {
    return new NextResponse("Could not fetch figure", {
      status: fileRes.status,
    });
  }

  const headers = new Headers();
  const contentType =
    fileRes.headers.get("content-type") ?? "application/octet-stream";
  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", "inline");
  headers.set("Accept-Ranges", fileRes.headers.get("accept-ranges") ?? "bytes");
  headers.set("Cache-Control", "private, max-age=300");
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
