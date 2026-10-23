"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { getSession } from "./session";

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email), with: { roles: true, person: true } });
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return { error: "E-posta veya şifre hatalı." };
  const session = await getSession();
  session.userId = user.id; session.email = user.email; session.personId = user.personId;
  session.fullName = user.person?.fullName ?? user.email;
  session.roles = user.roles.map((r) => ({ role: r.role, scopeOrgUnitId: r.scopeOrgUnitId }));
  await session.save();
  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, user.id));
  redirect("/");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/giris");
}

export async function requireUser() {
  const session = await getSession();
  if (!session.userId) redirect("/giris");
  return session;
}
