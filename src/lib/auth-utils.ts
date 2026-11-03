export function isTokenExpired(token: string): boolean {
  try {
    // JWTs use base64url (RFC 4648 §5), not plain base64. atob() rejects
    // "-" and "_" and requires padding, so normalize before decoding.
    const payloadSegment = token.split(".")[1] ?? "";
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
