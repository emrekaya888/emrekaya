import { notFound } from "next/navigation";
import { asc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { competencyKindLabel, competencyStatusLabel, levelNames } from "@/db/labels";
import { lintIndicatorText, lintStructure } from "@/domain/indicatorLint";
import { CompetencyForm } from "../competency-form";
import { updateCompetencyAction } from "../actions";
import { AnchorEditor, IndicatorEditor, IndicatorRow, StatusBar } from "./editors";

export default async function YetkinlikDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params; const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();
  const comp = await db.query.competencies.findFirst({ where: eq(schema.competencies.id, id), with: { indicators: { orderBy: [asc(schema.indicators.level), asc(schema.indicators.sortOrder)] }, anchors: true } });
  if (!comp) notFound();
  const [units, evTypes, levelDefs] = await Promise.all([
    db.select({ id: schema.orgUnits.id, name: schema.orgUnits.name }).from(schema.orgUnits).where(inArray(schema.orgUnits.type, ["DIREKTORLUK", "DEPARTMAN", "SERVIS", "BOLGE", "SUBE"])).orderBy(asc(schema.orgUnits.name)),
    db.select().from(schema.evidenceTypes).where(eq(schema.evidenceTypes.active, true)),
    db.select().from(schema.levelDefinitions).where(eq(schema.levelDefinitions.scale, comp.kind)),
  ]);
  const names = levelNames[comp.kind];
  const levels = [1, 2, 3, 4, 5].map((l) => ({ level: l, count: comp.indicators.filter((i) => i.level === l && i.active).length, mandatory: comp.indicators.filter((i) => i.level === l && i.active && i.mandatory).length }));
  const structure = lintStructure(levels);
  const editable = comp.status !== "EMEKLI";
  const bound = updateCompetencyAction.bind(null, comp.id);
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-slate-500">{competencyKindLabel[comp.kind]} · v{comp.version} · {competencyStatusLabel[comp.status]}</div>
        <h1 className="text-2xl font-bold text-[var(--brand)]">{comp.code} · {comp.name}</h1>
      </div>
      <StatusBar id={comp.id} status={comp.status} structureIssues={structure} />
      <details className="card" open={comp.status === "TASLAK"}>
        <summary className="cursor-pointer font-semibold">Tanım ve üst bilgiler</summary>
        <div className="mt-3">
          {editable ? <CompetencyForm action={bound} initial={comp} units={units} submitLabel="Kaydet" /> : <p className="text-sm text-slate-500">Emekli sürüm; düzenlenemez.</p>}
        </div>
      </details>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((level) => {
          const def = levelDefs.find((d) => d.level === level);
          const anchor = comp.anchors.find((a) => a.level === level)?.anchorText ?? "";
          const inds = comp.indicators.filter((i) => i.level === level);
          const levelIssues = structure.filter((s) => s.code.startsWith(`SEVIYE_${level}_`));
          return (
            <section key={level} className="card space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">Seviye {level} · {names[level]}</h2>
                <span className="text-xs text-slate-500">{def?.generalDefinition}</span>
              </div>
              {levelIssues.map((i) => <p key={i.code} className={`text-xs ${i.severity === "HATA" ? "text-red-700" : "text-amber-700"}`}>{i.message}</p>)}
              <AnchorEditor competencyId={comp.id} level={level} initial={anchor} editable={editable} />
              <table className="table">
                <thead><tr><th className="w-10">#</th><th>Gösterge (geçmiş zaman, tek davranış, gözlenebilir)</th><th>Zorunlu</th><th>Kanıt türleri</th><th>Geçerlilik</th><th>Kalite</th><th></th></tr></thead>
                <tbody>
                  {inds.map((ind, idx) => <IndicatorRow key={ind.id} competencyId={comp.id} indicator={ind} index={idx + 1} evTypes={evTypes} lint={lintIndicatorText(ind.text)} editable={editable} />)}
                  {inds.length === 0 && <tr><td colSpan={7} className="text-slate-500">Bu seviyede gösterge yok.</td></tr>}
                </tbody>
              </table>
              {editable && <IndicatorEditor competencyId={comp.id} level={level} evTypes={evTypes} />}
            </section>
          );
        })}
      </div>
    </div>
  );
}
