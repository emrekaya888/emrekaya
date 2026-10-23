/** CSV ayrıştırma (noktalı virgül ayraçlı, UTF-8), başlık normalizasyonu ve ortak doğrulama yardımcıları. */
import Papa from "papaparse";

export interface ParsedCsv { headers: string[]; rows: Record<string, string>[] }

export function normalizeHeader(h: string): string {
  return h.trim().toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function parseCsv(text: string): ParsedCsv {
  const clean = text.replace(/^﻿/, "");
  const res = Papa.parse<Record<string, string>>(clean, { header: true, skipEmptyLines: true, delimiter: "", transformHeader: normalizeHeader });
  const rows = res.data.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, (v ?? "").toString().trim()])));
  return { headers: res.meta.fields ?? [], rows };
}

export interface RowError { rowNo: number; field?: string; message: string }

export function requireHeaders(headers: string[], required: string[]): RowError[] {
  const missing = required.filter((r) => !headers.includes(r));
  return missing.map((m) => ({ rowNo: 0, field: m, message: `Zorunlu sütun eksik: ${m}` }));
}

export function parseBool(v: string): boolean | null {
  const s = v.trim().toLowerCase();
  if (["evet", "e", "1", "true", "x"].includes(s)) return true;
  if (["hayir", "hayır", "h", "0", "false", ""].includes(s)) return false;
  return null;
}

export function parseDateTR(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  let y: number, mo: number, d: number;
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else {
    m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
    if (!m) return null;
    d = +m[1]; mo = +m[2]; y = +m[3];
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
