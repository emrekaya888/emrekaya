import { ImportForm } from "./import-form";

const formats = [
  { kind: "ORG", title: "1 · Organizasyon", cols: "birim_kodu; ust_birim_kodu; tur; ad; yonetici_sicil; sube_sinifi; segment", note: "Tür: Kurum, GMY, Direktörlük, Departman, Servis, Bölge, Şube, Portföy ekibi, Ekip. Şube için şube sınıfı (Özel Bankacılık / KOBİ / Ticari / Kurumsal), portföy ekibi için segment zorunlu. Üst birimler dosyada önce gelmeli veya sistemde olmalı." },
  { kind: "ROLE", title: "2 · Roller", cols: "rol_kodu; ad; is_ailesi; kademe; yonetici_mi; ag; segment; aciklama", note: "Kademe 1–9; yönetici_mi Evet/Hayır; ağ GM / Şube / Bölge." },
  { kind: "POSITION", title: "3 · Pozisyonlar", cols: "pozisyon_kodu; rol_kodu; birim_kodu; kritik", note: "Rol ve birim kodları sistemde olmalı." },
  { kind: "PEOPLE", title: "4 · Kişiler ve atamalar", cols: "sicil; ad_soyad; e_posta; ise_giris; pozisyon_kodu; baslangic", note: "Tarih GG.AA.YYYY veya YYYY-AA-GG. Pozisyon değişirse eski atama kapatılır, yenisi açılır." },
] as const;

export default function IceAktarmaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--brand)]">İçe aktarma</h1>
      <p className="text-sm text-slate-600">Noktalı virgülle ayrılmış UTF-8 CSV. Önce <strong>Doğrula</strong>: hatalı satırlar listelenir ve hiçbir şey yazılmaz. Sonra <strong>Uygula</strong>: yalnızca temiz satırlar işlenir, hatalılar raporda kalır (süreç P19). Yükleme sırası: organizasyon → roller → pozisyonlar → kişiler.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {formats.map((f) => <ImportForm key={f.kind} kind={f.kind} title={f.title} cols={f.cols} note={f.note} />)}
      </div>
    </div>
  );
}
