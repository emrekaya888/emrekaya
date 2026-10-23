/** Rol profili kuralları — 01 §3.1, 09 P5, 13 §2. */

export const MAX_ROWS_PER_PERSON = 30;

/** Davranışsal yetkinlik için varsayılan hedef: kademeye göre; yönetici rollerinde en az 3. */
export function defaultBehavioralTarget(grade: number, isManager: boolean, subKind: "CEKIRDEK" | "LIDERLIK"): number {
  let t = grade <= 1 ? 2 : grade <= 3 ? 3 : 4;
  if (isManager) t = Math.max(t, 3);
  if (subKind === "LIDERLIK") t = Math.max(t, 3);
  return Math.min(t, 5);
}

/** Alt kademeden kopyalama: hedef +1 (en fazla 5), ağırlık ve zorunluluk korunur. */
export function copyWithPlusOne<T extends { targetLevel: number }>(rows: T[], plus = 1): T[] {
  return rows.map((r) => ({ ...r, targetLevel: Math.min(5, Math.max(1, r.targetLevel + plus)) }));
}

export interface ProfileRowLite { kind: "TEKNIK" | "DAVRANISSAL"; subKind?: string | null; targetLevel: number; weight: number; mandatory: boolean }
export interface ProfileWarning { code: string; message: string; severity: "HATA" | "UYARI" }

/** Rol profili tutarlılık uyarıları (P5 adım 6). */
export function profileWarnings(rows: ProfileRowLite[], opts: { isManager: boolean; hasPositions: boolean }): ProfileWarning[] {
  const w: ProfileWarning[] = [];
  const tech = rows.filter((r) => r.kind === "TEKNIK");
  const beh = rows.filter((r) => r.kind === "DAVRANISSAL");
  if (rows.length > MAX_ROWS_PER_PERSON) w.push({ code: "COK_SATIR", severity: "HATA", message: `Kişi başı ${rows.length} satır; üst sınır ${MAX_ROWS_PER_PERSON}. Sadeleştirin.` });
  if (tech.length === 0) w.push({ code: "TEKNIK_YOK", severity: "UYARI", message: "Teknik beceri yok; rol yalnızca davranışsal değerlendirilecek." });
  if (tech.length > 18) w.push({ code: "TEKNIK_COK", severity: "UYARI", message: `${tech.length} teknik beceri; 12–18 arası önerilir.` });
  if (beh.length === 0) w.push({ code: "DAVRANISSAL_YOK", severity: "UYARI", message: "Davranışsal yetkinlik bağlanmamış; çekirdek yetkinlikleri uygulayın." });
  if (opts.isManager && !beh.some((r) => r.subKind === "LIDERLIK")) w.push({ code: "LIDERLIK_YOK", severity: "UYARI", message: "Yönetici rolünde liderlik yetkinliği yok." });
  if (!opts.isManager && beh.some((r) => r.subKind === "LIDERLIK")) w.push({ code: "LIDERLIK_FAZLA", severity: "UYARI", message: "Yönetici olmayan rolde liderlik yetkinliği var; bilinçli değilse kaldırın." });
  const all4plus = rows.length >= 5 && rows.every((r) => r.targetLevel >= 4);
  if (all4plus) w.push({ code: "HEP_YUKSEK", severity: "UYARI", message: "Tüm hedefler 4 ve üstü; hedef \"ideal\" değil \"bu rolde beklenen\" olmalı." });
  if (rows.some((r) => r.mandatory && r.weight < 3)) w.push({ code: "ZORUNLU_AGIRLIK", severity: "UYARI", message: "Zorunlu işaretli ama ağırlığı 3 olmayan satır var; zorunlu beceriler genelde çekirdek ağırlıktadır." });
  if (!opts.hasPositions) w.push({ code: "POZISYON_YOK", severity: "UYARI", message: "Bu role bağlı pozisyon yok; profil kimseye uygulanmayacak." });
  return w;
}
