"use server";
import { db, schema } from "@/db";
import { parseCsv } from "@/import/parse";
import { validateOrg, validatePeople, validatePositions, validateRoles } from "@/import/validators";
import { applyOrg, applyPeople, applyPositions, applyRoles } from "@/import/apply";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type ImportKind = "ORG" | "ROLE" | "POSITION" | "PEOPLE";
export interface ImportResult {
  kind: ImportKind; fileName: string; total: number; validCount: number;
  errors: { rowNo: number; field?: string; message: string }[];
  applied?: { inserted: number; updated: number; batchId: number };
  fatal?: string;
}

async function codes(table: "org" | "role" | "position"): Promise<Set<string>> {
  if (table === "org") return new Set((await db.select({ c: schema.orgUnits.code }).from(schema.orgUnits)).map((r) => r.c));
  if (table === "role") return new Set((await db.select({ c: schema.roles.code }).from(schema.roles)).map((r) => r.c));
  return new Set((await db.select({ c: schema.positions.code }).from(schema.positions)).map((r) => r.c));
}

export async function importAction(_prev: ImportResult | undefined, formData: FormData): Promise<ImportResult> {
  const session = await requireUser();
  const kind = String(formData.get("kind")) as ImportKind;
  const mode = String(formData.get("mode")); // "validate" | "apply"
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { kind, fileName: "", total: 0, validCount: 0, errors: [], fatal: "Dosya seçilmedi." };
  if (!hasRole(session, "IK_ADMIN")) return { kind, fileName: file.name, total: 0, validCount: 0, errors: [], fatal: "İçe aktarma için İK admin yetkisi gerekir." };
  const text = Buffer.from(await file.arrayBuffer()).toString("utf-8");
  const csv = parseCsv(text);
  const userId = session.userId ?? null;
  try {
    if (kind === "ORG") {
      const v = validateOrg(csv, await codes("org"));
      const base = { kind, fileName: file.name, total: v.total, validCount: v.valid.length, errors: v.errors };
      if (mode !== "apply") return base;
      const a = await applyOrg(v.valid, v.total, v.errors, file.name, userId); revalidatePath("/organizasyon");
      return { ...base, applied: a };
    }
    if (kind === "ROLE") {
      const v = validateRoles(csv);
      const base = { kind, fileName: file.name, total: v.total, validCount: v.valid.length, errors: v.errors };
      if (mode !== "apply") return base;
      const a = await applyRoles(v.valid, v.total, v.errors, file.name, userId); revalidatePath("/roller");
      return { ...base, applied: a };
    }
    if (kind === "POSITION") {
      const v = validatePositions(csv, await codes("role"), await codes("org"));
      const base = { kind, fileName: file.name, total: v.total, validCount: v.valid.length, errors: v.errors };
      if (mode !== "apply") return base;
      const a = await applyPositions(v.valid, v.total, v.errors, file.name, userId); revalidatePath("/roller");
      return { ...base, applied: a };
    }
    const v = validatePeople(csv, await codes("position"));
    const base = { kind, fileName: file.name, total: v.total, validCount: v.valid.length, errors: v.errors };
    if (mode !== "apply") return base;
    const a = await applyPeople(v.valid, v.total, v.errors, file.name, userId); revalidatePath("/kisiler");
    return { ...base, applied: a };
  } catch (e) {
    return { kind, fileName: file.name, total: csv.rows.length, validCount: 0, errors: [], fatal: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}
