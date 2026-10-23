/**
 * Gösterge kalite kontrolü — 12-proje-yonetim-modeli.md §1.6 kontrol listesinin otomatik kısmı.
 * Kesin hüküm değil, uyarı üretir; son karar İK yetkinlik ekibinindir.
 */
export interface LintIssue { severity: "HATA" | "UYARI"; code: string; message: string }

const judgmentWords = ["iyi", "etkili", "başarılı", "kaliteli", "mükemmel", "güçlü", "zayıf", "yeterli", "uygun"];
const abilityPatterns = [/yapabil/i, /bilir\b/i, /\bbilir\./i, /farkında/i, /edebil/i, /olabil/i, /abilir\b/i, /ebilir\b/i];
const pastTensePatterns = [/dı\b/i, /di\b/i, /du\b/i, /dü\b/i, /tı\b/i, /ti\b/i, /tu\b/i, /tü\b/i, /mış\b/i, /miş\b/i, /muş\b/i, /müş\b/i, /ştü\b/i, /\(otomatik\)/i, /\(z\)/i];

export function lintIndicatorText(text: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const t = text.trim();
  if (t.length < 15) issues.push({ severity: "HATA", code: "KISA", message: "Gösterge çok kısa; ne yapıldığını ve çıktısını yazın." });
  if (t.length > 220) issues.push({ severity: "UYARI", code: "UZUN", message: "Gösterge çok uzun; tek davranışa indirin." });
  if (abilityPatterns.some((p) => p.test(t))) issues.push({ severity: "HATA", code: "YETENEK_DILI", message: "\"yapabilir / bilir / farkındadır\" ölçülemez; geçmiş zamanda yapılan işi yazın." });
  const words = t.toLowerCase().split(/[^a-zçğıöşü]+/i);
  const judged = judgmentWords.filter((w) => words.includes(w));
  if (judged.length) issues.push({ severity: "UYARI", code: "YARGI", message: `Yargı sözcüğü: ${judged.join(", ")}. Gözlenebilir davranış ve çıktı yazın.` });
  const andCount = (t.match(/\b(ve|veya|ya da)\b/gi) ?? []).length;
  if (andCount >= 2) issues.push({ severity: "UYARI", code: "COKLU_DAVRANIS", message: "Birden fazla davranış tek göstergede olabilir; ayırmayı düşünün." });
  const lastWord = words.filter(Boolean).pop() ?? "";
  const pastTense = pastTensePatterns.some((p) => p.test(lastWord)) || pastTensePatterns.some((p) => p.test(t.slice(-12)));
  if (!pastTense) issues.push({ severity: "UYARI", code: "ZAMAN", message: "Geçmiş zaman kullanın (hazırladı, kurdu, öğretti)." });
  return issues;
}

export interface LevelSummary { level: number; count: number; mandatory: number }
/** Yayın (Aktif) için yapısal kurallar: v0'da her seviyede en az `minPerLevel` gösterge ve en az 1 zorunlu. */
export function lintStructure(levels: LevelSummary[], minPerLevel = 3): LintIssue[] {
  const issues: LintIssue[] = [];
  for (let n = 1; n <= 5; n++) {
    const l = levels.find((x) => x.level === n) ?? { level: n, count: 0, mandatory: 0 };
    if (l.count < minPerLevel) issues.push({ severity: "HATA", code: `SEVIYE_${n}_AZ`, message: `Seviye ${n}: en az ${minPerLevel} gösterge gerekir (${l.count} var).` });
    if (l.count > 0 && l.mandatory < 1) issues.push({ severity: "HATA", code: `SEVIYE_${n}_ZORUNLU`, message: `Seviye ${n}: en az 1 zorunlu gösterge işaretleyin.` });
    if (l.count > 5) issues.push({ severity: "UYARI", code: `SEVIYE_${n}_COK`, message: `Seviye ${n}: ${l.count} gösterge çok; 3–5 arası tutun.` });
  }
  return issues;
}

export function canActivate(levels: LevelSummary[], minPerLevel = 3): boolean {
  return !lintStructure(levels, minPerLevel).some((i) => i.severity === "HATA");
}
