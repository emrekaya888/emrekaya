"use client";
import type { CompetencyProven } from "@/lib/proven";

/** Gösterge seçici: yetkinlik ve seviye gruplu; hedefe kadar olanlar öne çıkar, kanıtlı olanlar işaretli görünür. */
export function IndicatorPicker({ comps, name = "indicatorIds", defaultChecked = [] }: { comps: CompetencyProven[]; name?: string; defaultChecked?: number[] }) {
  return (
    <div className="max-h-80 space-y-3 overflow-auto rounded-md border border-slate-200 p-2 text-sm">
      {comps.map((c) => (
        <details key={c.competencyId} open={c.provenLevel < c.targetLevel}>
          <summary className="cursor-pointer font-medium">{c.code} · {c.name} <span className="text-xs text-slate-500">hedef {c.targetLevel} · kanıtlanmış {c.provenLevel}</span></summary>
          <div className="ml-3 mt-1 space-y-1">
            {c.indicators.map((i) => (
              <label key={i.id} className={`flex items-start gap-2 ${i.level > c.targetLevel ? "opacity-60" : ""}`}>
                <input type="checkbox" name={name} value={i.id} defaultChecked={defaultChecked.includes(i.id)} className="mt-1" />
                <span><span className="badge mr-1 bg-slate-100 text-slate-600">S{i.level}{i.mandatory ? " Z" : ""}</span>{i.text}{i.proven && <span className="ml-1 text-xs text-green-700">✓ kanıtlı</span>}{!i.proven && i.pendingCount > 0 && <span className="ml-1 text-xs text-amber-700">inceleniyor</span>}</span>
              </label>
            ))}
          </div>
        </details>
      ))}
      {comps.length === 0 && <p className="text-slate-500">Rol profiliniz tanımlı değil; gösterge listesi boş.</p>}
    </div>
  );
}
