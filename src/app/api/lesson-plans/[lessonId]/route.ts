import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

/**
 * Streams a generated lesson-plan PDF through the app so the browser never
 * needs to reach MinIO directly (which is usually only on localhost).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { lessonId } = await params;

  const metaRes = await fetch(
    `${API_URL}/api/v1/lessons/${lessonId}/lesson-plan`,
    {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
      cache: "no-store",
    }
  );
  if (!metaRes.ok) {
    return new NextResponse("Lesson plan unavailable", {
      status: metaRes.status,
    });
  }

  const envelope = await metaRes.json();
  const url: string | undefined = envelope?.data?.url;
  if (!url) {
    return new NextResponse("Lesson plan unavailable", { status: 404 });
  }

  const range = req.headers.get("range");
  const fileRes = await fetch(url, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });
  if (!fileRes.ok && fileRes.status !== 206) {
    return new NextResponse("Could not fetch lesson plan", {
      status: fileRes.status,
    });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    fileRes.headers.get("content-type") ?? "application/pdf"
  );
  headers.set(
    "Content-Disposition",
    fileRes.headers.get("content-disposition") ?? "inline"
  );
  headers.set("Accept-Ranges", fileRes.headers.get("accept-ranges") ?? "bytes");
  headers.set("Cache-Control", "private, max-age=60");
  const contentLength = fileRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentRange = fileRes.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new NextResponse(fileRes.body, {
    status: fileRes.status,
    headers,
  });
}
