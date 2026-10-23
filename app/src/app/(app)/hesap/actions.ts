"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";

export type ActionState = { error?: string; ok?: string } | undefined;
export async function changePasswordAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const s = await requireUser();
  const d = z.object({ current: z.string(), next: z.string().min(8, "Yeni şifre en az 8 karakter"), again: z.string() }).safeParse({ current: fd.get("current"), next: fd.get("next"), again: fd.get("again") });
  if (!d.success) return { error: d.error.issues.map((i) => i.message).join("; ") };
  if (d.data.next !== d.data.again) return { error: "Yeni şifreler eşleşmiyor." };
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, s.userId!) });
  if (!u || !(await bcrypt.compare(d.data.current, u.passwordHash))) return { error: "Mevcut şifre hatalı." };
  await db.update(schema.users).set({ passwordHash: await bcrypt.hash(d.data.next, 10) }).where(eq(schema.users.id, u.id));
  await db.insert(schema.auditLog).values({ entity: "users", entityId: String(u.id), action: "PASSWORD_CHANGE", userId: u.id });
  return { ok: "Şifreniz değiştirildi." };
}
