// Signed admin session tokens. Uses Web Crypto (crypto.subtle) exclusively so the
// exact same code runs in Edge middleware AND Node server actions. No dependencies.

export const ADMIN_COOKIE = "balzac_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = {
  sub: number; // AdminUser.id
  email: string;
  exp: number; // unix seconds
};

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecodeToString(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET missing or too short (min 32 chars). Set it in .env");
  }
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(user: { id: number; email: string }): Promise<string> {
  const payload: AdminSession = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body));
  return `${body}.${b64urlEncode(new Uint8Array(sig))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<AdminSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sigPart = token.slice(dot + 1);
  try {
    const sigStr = b64urlDecodeToString(sigPart);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) sigBytes[i] = sigStr.charCodeAt(i);
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(), sigBytes, enc.encode(body));
    if (!valid) return null;
    const payload = JSON.parse(b64urlDecodeToString(body)) as AdminSession;
    if (typeof payload.sub !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
