"use client";
import { useActionState } from "react";
import { importAction, type ImportKind, type ImportResult } from "./actions";

export function ImportForm({ kind, title, cols, note }: { kind: ImportKind; title: string; cols: string; note: string }) {
  const [state, action, pending] = useActionState<ImportResult | undefined, FormData>(importAction, undefined);
  return (
    <div className="card space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <div className="rounded-md bg-slate-50 p-2 text-xs"><code>{cols}</code><p className="mt-1 text-slate-600">{note}</p></div>
      <form action={action} className="space-y-2">
        <input type="hidden" name="kind" value={kind} />
        <input type="file" name="file" accept=".csv,text/csv" required className="block w-full text-sm" />
        <div className="flex gap-2">
          <button name="mode" value="validate" disabled={pending} className="btn-ghost">Doğrula</button>
          <button name="mode" value="apply" disabled={pending} className="btn-primary">Uygula</button>
        </div>
      </form>
      {pending && <p className="text-sm text-slate-500">İşleniyor…</p>}
      {state && !pending && (
        <div className="space-y-2 text-sm">
          {state.fatal && <p className="rounded-md bg-red-50 p-2 text-red-700">{state.fatal}</p>}
          {!state.fatal && (
            <p>
              <strong>{state.fileName}</strong>: {state.total} satır, <span className="text-green-700">{state.validCount} geçerli</span>, <span className={state.errors.length ? "text-red-700" : ""}>{state.errors.length} hata</span>
              {state.applied && <> · Uygulandı: {state.applied.inserted} yeni, {state.applied.updated} güncellendi (parti #{state.applied.batchId})</>}
            </p>
          )}
          {state.errors.length > 0 && (
            <div className="max-h-56 overflow-auto rounded-md border border-red-100">
              <table className="table"><thead><tr><th>Satır</th><th>Alan</th><th>Hata</th></tr></thead>
                <tbody>{state.errors.slice(0, 200).map((e, i) => <tr key={i}><td>{e.rowNo || "—"}</td><td>{e.field ?? "—"}</td><td>{e.message}</td></tr>)}</tbody></table>
              {state.errors.length > 200 && <p className="p-2 text-xs text-slate-500">İlk 200 hata gösteriliyor.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
