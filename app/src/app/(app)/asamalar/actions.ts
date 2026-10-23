"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { computeStages } from "@/lib/stages";

export type ActionState = { error?: string; ok?: string } | undefined;

export async function confirmStageAction(key: string, note: string): Promise<ActionState> {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN")) return { error: "Aşama onayı İK admin yetkisi ister." };
  const { stages } = await computeStages();
  const idx = stages.findIndex((x) => x.key === key);
  if (idx < 0) return { error: "Aşama bulunamadı." };
  if (idx > 0 && !stages[idx - 1].confirmed) return { error: "Önce bir önceki aşamayı tamamlayın." };
  const st = stages[idx];
  if (!st.autoOk && note.trim().length < 10) return { error: "Zorunlu kontroller sağlanmadı. Bilinçli geçmek için en az 10 karakterlik gerekçe yazın." };
  const value = { at: new Date().toISOString(), byEmail: s.email ?? "", note: note.trim() || undefined };
  await db.insert(schema.settings).values({ key: `stage:${key}`, value, updatedBy: s.userId ?? null }).onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date(), updatedBy: s.userId ?? null } });
  await db.insert(schema.auditLog).values({ entity: "stages", entityId: key, action: "CONFIRM", after: value, userId: s.userId ?? null });
  revalidatePath("/asamalar"); revalidatePath("/");
  return { ok: `${st.title} aşaması tamamlandı olarak işaretlendi.` };
}

export async function reopenStageAction(key: string): Promise<ActionState> {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN")) return { error: "Yetki yok." };
  const { stages } = await computeStages();
  const idx = stages.findIndex((x) => x.key === key);
  for (const later of stages.slice(idx)) await db.delete(schema.settings).where(eq(schema.settings.key, `stage:${later.key}`));
  await db.insert(schema.auditLog).values({ entity: "stages", entityId: key, action: "REOPEN", userId: s.userId ?? null });
  revalidatePath("/asamalar"); revalidatePath("/");
  return { ok: "Aşama ve sonrakiler yeniden açıldı." };
}
