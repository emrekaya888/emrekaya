import { count, isNull, and, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export default async function OzetPage() {
  const [[units], [persons], [rolesCount], [positionsCount], [assigned], batches] = await Promise.all([
    db.select({ c: count() }).from(schema.orgUnits).where(eq(schema.orgUnits.active, true)),
    db.select({ c: count() }).from(schema.people).where(eq(schema.people.active, true)),
    db.select({ c: count() }).from(schema.roles),
    db.select({ c: count() }).from(schema.positions),
    db.select({ c: count() }).from(schema.assignments).where(and(isNull(schema.assignments.endDate), eq(schema.assignments.isPrimary, true))),
    db.select().from(schema.importBatches).orderBy(schema.importBatches.createdAt).limit(5),
  ]);
  const cards = [
    ["Aktif birim", units.c], ["Aktif kişi", persons.c], ["Rol", rolesCount.c], ["Pozisyon", positionsCount.c], ["Aktif atama", assigned.c],
  ] as const;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Özet</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="card"><div className="text-sm text-slate-500">{label}</div><div className="text-2xl font-bold">{value}</div></div>
        ))}
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">Son içe aktarmalar</h2>
        {batches.length === 0 ? <p className="text-sm text-slate-500">Henüz içe aktarma yapılmadı.</p> : (
          <table className="table"><thead><tr><th>Tür</th><th>Dosya</th><th>Durum</th><th>Satır</th><th>Geçerli</th><th>Hata</th></tr></thead>
            <tbody>{batches.map((b) => <tr key={b.id}><td>{b.type}</td><td>{b.fileName}</td><td>{b.status}</td><td>{b.totalRows}</td><td>{b.validRows}</td><td>{b.errorRows}</td></tr>)}</tbody></table>
        )}
      </div>
      <p className="text-sm text-slate-500">Sade sürüm (v0, İK Grup Müdürlüğü): sprint 1 organizasyon ve içe aktarma, sprint 2 yetkinlik kütüphanesi tamamlandı. Sırada rol profilleri.</p>
    </div>
  );
}
