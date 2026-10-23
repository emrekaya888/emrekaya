import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession, hasRole } from "@/lib/session";
import { loadOrgContext, managerOf } from "@/lib/org";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s.userId) return new Response("Yetkisiz", { status: 401 });
  const { id } = await params;
  const e = await db.query.evidence.findFirst({ where: eq(schema.evidence.id, Number(id)) });
  if (!e || !e.filePath) return new Response("Bulunamadı", { status: 404 });
  let allowed = hasRole(s, "IK_ADMIN") || e.personId === s.personId;
  if (!allowed && s.personId) { const ctx = await loadOrgContext(); allowed = managerOf(ctx, e.personId) === s.personId; }
  if (!allowed) return new Response("Yetkisiz", { status: 403 });
  const buf = await readFile(path.join(process.cwd(), "uploads", e.filePath));
  return new Response(buf, { headers: { "Content-Type": e.fileMime ?? "application/octet-stream", "Content-Disposition": `inline; filename="${encodeURIComponent(e.fileName ?? "kanit")}"` } });
}
