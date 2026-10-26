import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const targetUrl = new URL(urlParam, request.url);
    const originalHost = targetUrl.host;
    const minioHost = process.env.NEXT_PUBLIC_MINIO_HOST || "localhost";
    const minioPort = process.env.NEXT_PUBLIC_MINIO_PORT || "9000";

    // In server environment, ensure we reach local SeaweedFS / MinIO
    if (
      targetUrl.hostname === "localhost" ||
      targetUrl.hostname === "127.0.0.1" ||
      targetUrl.hostname === minioHost
    ) {
      targetUrl.hostname = minioHost === "localhost" ? "127.0.0.1" : minioHost;
      targetUrl.port = minioPort;
    }

    const rangeHeader = request.headers.get("range");
    const headers: Record<string, string> = {};
    if (rangeHeader) {
      headers["Range"] = rangeHeader;
    }
    if (originalHost) {
      headers["Host"] = originalHost;
    }

    const res = await fetch(targetUrl.toString(), {
      headers,
    });

    if (!res.ok) {
      return new NextResponse(`Storage error ${res.status}: ${res.statusText}`, {
        status: res.status,
      });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition") || "inline";
    const contentLength = res.headers.get("content-length");
    const acceptRanges = res.headers.get("accept-ranges") || "bytes";
    const contentRange = res.headers.get("content-range");

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set("Content-Disposition", contentDisposition);
    responseHeaders.set("Accept-Ranges", acceptRanges);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("File proxy error:", err);
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
  }
}
