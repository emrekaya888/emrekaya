import { asc, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { CompetencyForm } from "../competency-form";
import { createCompetencyAction } from "../actions";

export default async function YeniYetkinlikPage() {
  const units = await db.select({ id: schema.orgUnits.id, name: schema.orgUnits.name }).from(schema.orgUnits)
    .where(inArray(schema.orgUnits.type, ["DIREKTORLUK", "DEPARTMAN", "SERVIS", "BOLGE", "SUBE"])).orderBy(asc(schema.orgUnits.name));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Yeni yetkinlik</h1>
      <div className="card"><CompetencyForm action={createCompetencyAction} units={units} submitLabel="Oluştur ve göstergelere geç" /></div>
      <div className="card text-sm text-slate-600">
        <p className="font-semibold">Ad kuralı</p>
        <p>İsim tamlaması, araç adı değil: <em>Mali Tablo Analizi</em> ✓ · <em>SAP</em> ✗ · <em>Müşteriyle iyi iletişim kurmak</em> ✗. Kişilik özellikleri (titizlik, dürüstlük) yetkinlik değildir.</p>
      </div>
    </div>
  );
}
