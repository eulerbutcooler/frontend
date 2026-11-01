/**
 * Routes storage URLs through the same-origin Next proxy so previews and
 * downloads keep working when the app is accessed through a public tunnel.
 */
export function toFileProxyUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (
    url.startsWith("/") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `/api/files/proxy?url=${encodeURIComponent(url)}`;
}
