import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

/**
 * Next.js derives `request.url` from its internal listen address, so behind a
 * reverse proxy Auth.js would think the app lives on localhost and reject the
 * public callback URL. Rebuild the URL from the forwarded headers instead.
 */
function withForwardedOrigin(req: NextRequest): NextRequest {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))
    ?.split(",")[0]
    ?.trim();
  if (!host) return req;

  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    new URL(req.url).protocol.replace(":", "");

  const current = new URL(req.url);
  if (current.host === host && current.protocol === `${proto}:`) return req;

  const forwarded = new URL(`http://${host}`);
  const url = new URL(req.url);
  url.protocol = `${proto}:`;
  url.hostname = forwarded.hostname;
  url.port = forwarded.port;

  return new NextRequest(url, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    redirect: req.redirect,
    duplex: "half",
  } as any);
}

export function GET(req: NextRequest) {
  return handlers.GET(withForwardedOrigin(req));
}

export function POST(req: NextRequest) {
  return handlers.POST(withForwardedOrigin(req));
}
