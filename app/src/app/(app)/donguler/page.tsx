import { desc, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { assessmentStatusLabel, cycleStatusLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { CycleControls, CycleForm } from "../degerlendirme/controls";

export default async function DongulerPage() {
  const s = await requireUser();
  const isAdmin = hasRole(s, "IK_ADMIN");
  const rows = await db.select().from(schema.cycles).orderBy(desc(schema.cycles.id));
  const counts = await db.select({ cycleId: schema.assessments.cycleId, status: schema.assessments.status, c: sql<number>`count(*)::int` }).from(schema.assessments).groupBy(schema.assessments.cycleId, schema.assessments.status);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Değerlendirme döngüleri</h1>
        <p className="text-sm text-slate-600">Akış: Hazırlık → Öz-beyan → Yönetici doğrulaması → Mutabakat → Kalibrasyon → Kilit. Aşamalar sırayla ve İK tarafından ilerletilir; kilitlenen döngü değiştirilemez (düzeltme yeni kayıtla).</p></div>
      {isAdmin && <div className="card"><h2 className="mb-2 font-semibold">Yeni döngü</h2><CycleForm /></div>}
      {rows.map((c) => {
        const cc = counts.filter((x) => x.cycleId === c.id); const total = cc.reduce((a, x) => a + x.c, 0);
        const m = c.metrics as { agreedRatio?: number; selfMinusProven?: number; appealRatio?: number } | null;
        return (
          <section key={c.id} className="card space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-semibold">{c.name} <span className="badge bg-slate-200 text-slate-700">{cycleStatusLabel[c.status]}</span></h2><span className="text-xs text-slate-500">Öz-beyan son: {c.selfDeadline ?? "—"} · Doğrulama son: {c.managerDeadline ?? "—"} · Mutabakat son: {c.agreementDeadline ?? "—"}</span></div>
            <div className="flex flex-wrap gap-2 text-xs">{total === 0 ? <span className="text-slate-500">Henüz değerlendirme üretilmedi.</span> : cc.map((x) => <span key={x.status} className="badge bg-slate-100 text-slate-700">{assessmentStatusLabel[x.status]}: {x.c}</span>)}<span className="badge bg-sky-100 text-sky-800">toplam {total}</span></div>
            {m && <div className="text-xs text-slate-600">Kilit anlık görüntüsü: mutabık satır %{Math.round((m.agreedRatio ?? 0) * 100)} · öz-beyan − kanıtlanmış {Number(m.selfMinusProven ?? 0).toFixed(2)} · itiraz %{Math.round((m.appealRatio ?? 0) * 100)}</div>}
            {isAdmin && <CycleControls cycleId={c.id} status={c.status} />}
          </section>
        );
      })}
      {rows.length === 0 && <p className="text-sm text-slate-500">Döngü yok.</p>}
    </div>
  );
}
