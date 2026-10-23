/** İçe aktarma doğrulayıcıları: organizasyon, rol, pozisyon, kişi. Hatalı satır işlenmez; temiz satırlar işlenir (09 P19). */
import { parseBool, parseDateTR, requireHeaders, type ParsedCsv, type RowError } from "./parse";

export const ORG_TYPES = ["KURUM", "GMY", "DIREKTORLUK", "DEPARTMAN", "SERVIS", "BOLGE", "SUBE", "PORTFOY_EKIBI", "EKIP"] as const;
export const BRANCH_CLASSES = ["OZEL_BANKACILIK", "KOBI", "TICARI", "KURUMSAL"] as const;
export const SEGMENTS = ["BIREYSEL_SATIS_TEMSILCISI", "BIREYSEL_SATIS", "KOBI_SATIS", "TICARI_SATIS", "KURUMSAL_SATIS", "OZEL_BANKACILIK", "MUSTERI_ILISKILERI"] as const;
export const NETWORKS = ["GM", "SUBE", "BOLGE"] as const;

const typeAliases: Record<string, string> = {
  kurum: "KURUM", gmy: "GMY", "genel mudur yardimciligi": "GMY", direktorluk: "DIREKTORLUK", departman: "DEPARTMAN", servis: "SERVIS",
  bolge: "BOLGE", "bolge mudurlugu": "BOLGE", sube: "SUBE", "portfoy ekibi": "PORTFOY_EKIBI", portfoy: "PORTFOY_EKIBI", ekip: "EKIP",
};
const classAliases: Record<string, string> = { "ozel bankacilik": "OZEL_BANKACILIK", ozel: "OZEL_BANKACILIK", kobi: "KOBI", ticari: "TICARI", kurumsal: "KURUMSAL" };
const segmentAliases: Record<string, string> = {
  "bireysel satis temsilcisi": "BIREYSEL_SATIS_TEMSILCISI", gise: "BIREYSEL_SATIS_TEMSILCISI", "bireysel satis": "BIREYSEL_SATIS",
  "kobi satis": "KOBI_SATIS", "ticari satis": "TICARI_SATIS", "kurumsal satis": "KURUMSAL_SATIS", "ozel bankacilik": "OZEL_BANKACILIK",
  "musteri iliskileri": "MUSTERI_ILISKILERI", miy: "MUSTERI_ILISKILERI",
};
function norm(s: string) {
  return s.trim().toLowerCase().replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/_/g, " ");
}
export function toEnum(value: string, allowed: readonly string[], aliases: Record<string, string>): string | null {
  const v = value.trim();
  if (!v) return null;
  const up = v.toUpperCase().replace(/\s+/g, "_");
  if (allowed.includes(up)) return up;
  const a = aliases[norm(v)];
  return a && allowed.includes(a) ? a : null;
}

// ---------- Organizasyon
export interface OrgRow { code: string; parentCode: string | null; type: string; name: string; managerEmployeeNo: string | null; branchClass: string | null; segment: string | null }
export interface ValidationResult<T> { valid: T[]; errors: RowError[]; total: number }

export function validateOrg(csv: ParsedCsv, existingCodes: Set<string>): ValidationResult<OrgRow> {
  const errors = requireHeaders(csv.headers, ["birim_kodu", "tur", "ad"]);
  if (errors.length) return { valid: [], errors, total: csv.rows.length };
  const codesInFile = new Set<string>();
  const valid: OrgRow[] = [];
  csv.rows.forEach((r, i) => {
    const rowNo = i + 2;
    const rowErrors: RowError[] = [];
    const code = r.birim_kodu;
    if (!code) rowErrors.push({ rowNo, field: "birim_kodu", message: "Birim kodu boş" });
    else if (codesInFile.has(code)) rowErrors.push({ rowNo, field: "birim_kodu", message: `Dosyada mükerrer birim kodu: ${code}` });
    const type = toEnum(r.tur ?? "", ORG_TYPES, typeAliases);
    if (!type) rowErrors.push({ rowNo, field: "tur", message: `Geçersiz birim türü: "${r.tur}"` });
    if (!r.ad) rowErrors.push({ rowNo, field: "ad", message: "Ad boş" });
    const parentCode = r.ust_birim_kodu || null;
    if (parentCode && !codesInFile.has(parentCode) && !existingCodes.has(parentCode)) rowErrors.push({ rowNo, field: "ust_birim_kodu", message: `Üst birim bulunamadı: ${parentCode}` });
    if (!parentCode && type !== "KURUM") rowErrors.push({ rowNo, field: "ust_birim_kodu", message: "Kurum dışındaki birimlerde üst birim zorunlu" });
    let branchClass: string | null = null;
    if (r.sube_sinifi) { branchClass = toEnum(r.sube_sinifi, BRANCH_CLASSES, classAliases); if (!branchClass) rowErrors.push({ rowNo, field: "sube_sinifi", message: `Geçersiz şube sınıfı: "${r.sube_sinifi}"` }); }
    if (type === "SUBE" && !branchClass) rowErrors.push({ rowNo, field: "sube_sinifi", message: "Şube için şube sınıfı zorunlu (Özel Bankacılık / KOBİ / Ticari / Kurumsal)" });
    let seg: string | null = null;
    if (r.segment) { seg = toEnum(r.segment, SEGMENTS, segmentAliases); if (!seg) rowErrors.push({ rowNo, field: "segment", message: `Geçersiz segment: "${r.segment}"` }); }
    if (type === "PORTFOY_EKIBI" && !seg) rowErrors.push({ rowNo, field: "segment", message: "Portföy ekibi için segment zorunlu" });
    if (rowErrors.length) { errors.push(...rowErrors); return; }
    codesInFile.add(code);
    valid.push({ code, parentCode, type: type!, name: r.ad, managerEmployeeNo: r.yonetici_sicil || null, branchClass, segment: seg });
  });
  return { valid, errors, total: csv.rows.length };
}

// ---------- Rol
export interface RoleRow { code: string; name: string; jobFamily: string | null; grade: number; isManager: boolean; network: string; segment: string | null; description: string | null }
export function validateRoles(csv: ParsedCsv): ValidationResult<RoleRow> {
  const errors = requireHeaders(csv.headers, ["rol_kodu", "ad"]);
  if (errors.length) return { valid: [], errors, total: csv.rows.length };
  const seen = new Set<string>(); const valid: RoleRow[] = [];
  csv.rows.forEach((r, i) => {
    const rowNo = i + 2; const e: RowError[] = [];
    if (!r.rol_kodu) e.push({ rowNo, field: "rol_kodu", message: "Rol kodu boş" });
    else if (seen.has(r.rol_kodu)) e.push({ rowNo, field: "rol_kodu", message: `Mükerrer rol kodu: ${r.rol_kodu}` });
    if (!r.ad) e.push({ rowNo, field: "ad", message: "Ad boş" });
    const grade = r.kademe ? Number(r.kademe) : 1;
    if (!Number.isInteger(grade) || grade < 1 || grade > 9) e.push({ rowNo, field: "kademe", message: `Kademe 1–9 arası tam sayı olmalı: "${r.kademe}"` });
    const isManager = r.yonetici_mi ? parseBool(r.yonetici_mi) : false;
    if (isManager === null) e.push({ rowNo, field: "yonetici_mi", message: `Yönetici mi alanı Evet/Hayır olmalı: "${r.yonetici_mi}"` });
    const network = r.ag ? toEnum(r.ag, NETWORKS, { "genel mudurluk": "GM", gm: "GM", sube: "SUBE", bolge: "BOLGE" }) : "GM";
    if (!network) e.push({ rowNo, field: "ag", message: `Ağ GM/SUBE/BOLGE olmalı: "${r.ag}"` });
    let seg: string | null = null;
    if (r.segment) { seg = toEnum(r.segment, SEGMENTS, segmentAliases); if (!seg) e.push({ rowNo, field: "segment", message: `Geçersiz segment: "${r.segment}"` }); }
    if (e.length) { errors.push(...e); return; }
    seen.add(r.rol_kodu);
    valid.push({ code: r.rol_kodu, name: r.ad, jobFamily: r.is_ailesi || null, grade, isManager: isManager!, network: network!, segment: seg, description: r.aciklama || null });
  });
  return { valid, errors, total: csv.rows.length };
}

// ---------- Pozisyon
export interface PositionRow { code: string; roleCode: string; orgCode: string; isCritical: boolean }
export function validatePositions(csv: ParsedCsv, roleCodes: Set<string>, orgCodes: Set<string>): ValidationResult<PositionRow> {
  const errors = requireHeaders(csv.headers, ["pozisyon_kodu", "rol_kodu", "birim_kodu"]);
  if (errors.length) return { valid: [], errors, total: csv.rows.length };
  const seen = new Set<string>(); const valid: PositionRow[] = [];
  csv.rows.forEach((r, i) => {
    const rowNo = i + 2; const e: RowError[] = [];
    if (!r.pozisyon_kodu) e.push({ rowNo, field: "pozisyon_kodu", message: "Pozisyon kodu boş" });
    else if (seen.has(r.pozisyon_kodu)) e.push({ rowNo, field: "pozisyon_kodu", message: `Mükerrer pozisyon kodu: ${r.pozisyon_kodu}` });
    if (!roleCodes.has(r.rol_kodu)) e.push({ rowNo, field: "rol_kodu", message: `Rol bulunamadı: ${r.rol_kodu}` });
    if (!orgCodes.has(r.birim_kodu)) e.push({ rowNo, field: "birim_kodu", message: `Birim bulunamadı: ${r.birim_kodu}` });
    const crit = r.kritik ? parseBool(r.kritik) : false;
    if (crit === null) e.push({ rowNo, field: "kritik", message: `Kritik alanı Evet/Hayır olmalı: "${r.kritik}"` });
    if (e.length) { errors.push(...e); return; }
    seen.add(r.pozisyon_kodu);
    valid.push({ code: r.pozisyon_kodu, roleCode: r.rol_kodu, orgCode: r.birim_kodu, isCritical: crit! });
  });
  return { valid, errors, total: csv.rows.length };
}

// ---------- Kişi ve atama
export interface PersonRow { employeeNo: string; fullName: string; email: string | null; hireDate: string | null; positionCode: string | null; startDate: string | null }
export function validatePeople(csv: ParsedCsv, positionCodes: Set<string>): ValidationResult<PersonRow> {
  const errors = requireHeaders(csv.headers, ["sicil", "ad_soyad"]);
  if (errors.length) return { valid: [], errors, total: csv.rows.length };
  const seen = new Set<string>(); const emails = new Set<string>(); const valid: PersonRow[] = [];
  csv.rows.forEach((r, i) => {
    const rowNo = i + 2; const e: RowError[] = [];
    if (!r.sicil) e.push({ rowNo, field: "sicil", message: "Sicil boş" });
    else if (seen.has(r.sicil)) e.push({ rowNo, field: "sicil", message: `Mükerrer sicil: ${r.sicil}` });
    if (!r.ad_soyad) e.push({ rowNo, field: "ad_soyad", message: "Ad soyad boş" });
    const email = r.e_posta ? r.e_posta.toLowerCase() : null;
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.push({ rowNo, field: "e_posta", message: `Geçersiz e-posta: ${email}` });
    if (email && emails.has(email)) e.push({ rowNo, field: "e_posta", message: `Dosyada mükerrer e-posta: ${email}` });
    const hireDate = r.ise_giris ? parseDateTR(r.ise_giris) : null;
    if (r.ise_giris && !hireDate) e.push({ rowNo, field: "ise_giris", message: `Tarih biçimi GG.AA.YYYY veya YYYY-AA-GG olmalı: "${r.ise_giris}"` });
    const positionCode = r.pozisyon_kodu || null;
    if (positionCode && !positionCodes.has(positionCode)) e.push({ rowNo, field: "pozisyon_kodu", message: `Pozisyon bulunamadı: ${positionCode}` });
    const startDate = r.baslangic ? parseDateTR(r.baslangic) : null;
    if (r.baslangic && !startDate) e.push({ rowNo, field: "baslangic", message: `Tarih biçimi hatalı: "${r.baslangic}"` });
    if (e.length) { errors.push(...e); return; }
    seen.add(r.sicil); if (email) emails.add(email);
    valid.push({ employeeNo: r.sicil, fullName: r.ad_soyad, email, hireDate, positionCode, startDate });
  });
  return { valid, errors, total: csv.rows.length };
}
