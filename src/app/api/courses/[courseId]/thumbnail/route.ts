import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

/**
 * Stable, same-origin course thumbnail URL. The app server resolves it to a
 * fresh presigned SeaweedFS URL, so the browser never sees the storage host
 * or signature.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { courseId } = await params;

  const metaRes = await fetch(`${API_URL}/api/v1/courses/${courseId}/thumbnail`, {
    headers: { Authorization: `Bearer ${session.user.accessToken}` },
    cache: "no-store",
  });
  if (!metaRes.ok) {
    return new NextResponse("Thumbnail unavailable", {
      status: metaRes.status,
    });
  }

  const envelope = await metaRes.json();
  const url: string | undefined = envelope?.data?.url;
  if (!url) {
    return new NextResponse("Thumbnail unavailable", { status: 404 });
  }

  const fileRes = await fetch(url, { cache: "no-store" });
  if (!fileRes.ok) {
    return new NextResponse("Could not fetch thumbnail", {
      status: fileRes.status,
    });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    fileRes.headers.get("content-type") ?? "application/octet-stream"
  );
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "private, max-age=300");
  headers.set("X-Content-Type-Options", "nosniff");
  const contentLength = fileRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(fileRes.body, {
    status: fileRes.status,
    headers,
  });
}
