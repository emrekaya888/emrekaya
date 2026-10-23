import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData { userId?: number; email?: string; roles?: { role: string; scopeOrgUnitId: number | null }[]; personId?: number | null; fullName?: string }

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "gelistirme-ortami-gizli-anahtari-en-az-32-karakter",
  cookieName: "yys_session",
  cookieOptions: { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax" },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export function hasRole(s: SessionData, ...roles: string[]): boolean {
  return (s.roles ?? []).some((r) => roles.includes(r.role));
}
