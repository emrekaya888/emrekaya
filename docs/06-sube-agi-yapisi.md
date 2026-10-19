# 06 · Şube Ağı Yapısı — Bölge, Şube ve Portföy Ekipleri

Karar (19.10.2026): Genel Müdürlük departmanları için kurulan yapının aynısı **şube ağı** için de kurulacak. Şubelerde gişe, bireysel, KOBİ, ticari, özel bankacılık, bizbize bankacılık (bireysel + müşteriye bakan), operasyondaki müşteri ilişkileri ekipleri ve şube müdürü var. Ortalama 30 şube bir bölge müdürlüğüne bağlı. Bölgelerle birlikte davranışsal (soft skill) değerlendirmesi zaten yapılıyor; teknik beceri değerlendirmesi eklenecek. Tüm portföyler için **ortak teknik beceri seti** ve portföye özgü beceriler tanımlanacak; seçim, ölçüm, kanıt, veri kaydı, değerlendirme ve kalibrasyon süreçleri işletilecek.

---

## 1. Teşhis: GM departmanlarından farkı ne?

| Konu | GM departmanları | Şube ağı |
|---|---|---|
| Çeşitlilik | 100+ farklı iş, her servis kendine özgü beceri | **Az sayıda rol, çok sayıda tekrar** (aynı 8–10 rol yüzlerce şubede) |
| Toplama yöntemi | Her servisten ayrı toplama | Rol başına **bir kez** merkezi tasarım (segment GM yardımcılıkları + bölgeler + İK), tüm şubelere uygulanır |
| Kanıt | Çoğunlukla iş çıktısı ve gözlem | **Sistem verisi** çok güçlü: satış, portföy, kredi kalitesi, denetim bulguları, lisanslar, şikayet, NPS |
| Değerlendirici | Tek hat (servis yöneticisi) | **Çift hat**: şube müdürü (idari) + bölge segment yöneticisi (fonksiyonel) |
| Kalibrasyon | Departman içi | **Üç kademe**: şube → bölge (30 şube) → segment GMY |
| Mevcut durum | Yok | Davranışsal değerlendirme bölgelerle zaten yapılıyor → **devralınacak**, sıfırdan kurulmayacak |

Sonuç: şube ağı için beceri *toplama* değil, beceri *tasarımı ve standartlaştırma* yapılır. Asıl zorluk tutarlılık ve ölçektir: 600 yönetici, 6.400 çalışan.

---

## 2. Organizasyon modeli (şube ağı)

```
Kurum
├── Genel Müdürlük → Direktörlük/GMY → Departman (100+) → Servis          [bkz. 01]
└── Şube Ağı (GMY / Şube Bankacılığı)
    └── Bölge Müdürlüğü (~30 şube)
        ├── Bölge segment yöneticileri (Bireysel, KOBİ, Ticari, Özel, Operasyon …)  ← fonksiyonel hat
        └── Şube
            ├── Şube Müdürü
            ├── Gişe ekibi
            ├── Bireysel portföy
            ├── KOBİ portföy
            ├── Ticari portföy
            ├── Özel bankacılık portföy
            ├── Bizbize bankacılık portföy (bireysel + müşteriye bakan)
            └── Operasyon / Müşteri İlişkileri ekibi
```

Veri modelinde: `OrgBirimi.tür` = Bölge | Şube | Portföy ekibi; **şube tipi/segmenti** (büyük, orta, küçük; ticari ağırlıklı, bireysel ağırlıklı) `OrgBirimi.şube_sınıfı` alanında tutulur, çünkü hedef seviye şube sınıfına göre değişebilir (büyük şube ticari portföyü ≥ 4, küçük şubede 3).

**Rol ailesi (öneri; kademe adlarını siz netleştirirsiniz ❓ S25):**

| Rol ailesi | Kademeler (örnek) | Yönetici mi |
|---|---|---|
| Şube Müdürü | Şube Müdürü (şube sınıfına göre A/B/C) | Evet |
| Gişe | Gişe Yetkilisi → Kıdemli Gişe Yetkilisi → Gişe Yöneticisi/Operasyon Yöneticisi | Son kademe |
| Bireysel Portföy | Portföy Yetkilisi → Portföy Yöneticisi → Kıdemli Portföy Yöneticisi | Hayır |
| Bizbize Portföy | aynı | Hayır |
| KOBİ Portföy | aynı | Hayır |
| Ticari Portföy | aynı | Hayır |
| Özel Bankacılık Portföy | Özel Bankacılık Yöneticisi → Kıdemli | Hayır |
| Müşteri İlişkileri (Operasyon) | MİY Yetkilisi → MİY Yöneticisi | Son kademe |
| Bölge | Bölge Müdürü, Bölge Segment Yöneticisi, Bölge Operasyon Yöneticisi | Evet |

---

## 3. Şube teknik beceri mimarisi

```
Şube Teknik Becerileri
├── A. Ortak Şube Çekirdeği (tüm şube rolleri, 8–10 beceri)
├── B. Satış ve Portföy Çekirdeği (müşteriye bakan tüm portföyler, 5–6 beceri)
├── C. Segmente özgü (her portföy 3–6 beceri)
├── D. Gişe/Operasyon özgü (3–5 beceri)
└── E. Şube ve Bölge Yönetimi (şube müdürü, bölge rolleri, 4–6 beceri)
```

### 3.1 A — Ortak Şube Çekirdeği (öneri)

| Kod | Beceri | Kategori | Kanıt kaynağı (örnek) |
|---|---|---|---|
| A1 | Bankacılık mevzuatı ve düzenleyici uyum (BDDK, TCMB, 5411) | Mevzuat | Uyum sınavları, denetim bulgusu yokluğu |
| A2 | MASAK / suç gelirlerinin aklanmasını önleme ve müşteri tanı (KYC) | Mevzuat | MASAK eğitimi/sınavı, şüpheli işlem bildirim kalitesi |
| A3 | KVKK ve bilgi güvenliği | Mevzuat | Sınav, ihlal kaydı yokluğu |
| A4 | Etik, suistimal önleme ve iç kontrol | Süreç | Teftiş/iç kontrol bulguları, vaka kayıtları |
| A5 | Temel ürün ve hizmet bilgisi (mevduat, kredi, kart, ödeme, dijital kanallar) | Ürün | Ürün sınavı, satış çeşitliliği |
| A6 | Temel bankacılık sistemi ve CRM kullanımı | Yazılım/Araç | Sistem işlem hatası oranı, CRM kayıt kalitesi |
| A7 | Operasyonel risk ve işlem güvenliği | Süreç | Operasyonel hata/kayıp kaydı, düzeltme işlemleri |
| A8 | Müşteri şikayet ve talep yönetimi | Süreç | Şikayet sayısı, çözüm süresi, tekrar oranı |
| A9 | Dijital kanala yönlendirme ve dijital ürün bilgisi | Ürün | Dijital aktivasyon oranı |

### 3.2 B — Satış ve Portföy Çekirdeği (müşteriye bakan roller)

| Kod | Beceri | Kanıt kaynağı |
|---|---|---|
| B1 | Portföy yönetimi ve müşteri derinleştirme (çapraz satış, ürün adedi/müşteri) | Portföy KPI'ları, çapraz satış oranı |
| B2 | Müşteri edinimi ve ihtiyaç analizi | Yeni müşteri adedi, görüşme kayıtları |
| B3 | Satış süreci ve kampanya yönetimi | Hedef gerçekleşme, kampanya sonuçları |
| B4 | Kredi başvuru hazırlama ve ön değerlendirme | Tahsis geri dönüş oranı, dosya kalitesi |
| B5 | Yatırım ve sigorta ürünleri sunumu (lisans gerektirir) | SPK / SEGEM lisansı, ürün satışları |
| B6 | Fiyatlama ve kârlılık yönetimi | Portföy kârlılığı, fiyat istisna oranı |

### 3.3 C — Segmente özgü (öneri)

| Segment | Beceriler |
|---|---|
| Bireysel / Bizbize | Bireysel kredi değerlendirme ve skorlama; bireysel varlık ürünleri (BES, fon, mevduat yapılandırma); maaş/şirket anlaşmaları; bizbize için "iç müşteri/çalışan bankacılığı süreçleri" |
| KOBİ | Mali tablo analizi (KOBİ düzeyi); nakit akışı ve teminat yapılandırma; KGF ve destekli krediler; POS/üye işyeri ve nakit yönetimi ürünleri |
| Ticari | İleri mali analiz ve derecelendirme; dış ticaret işlemleri (akreditif, garanti, ihracat kredileri); proje/yapılandırılmış finansman temel; hazine ürünleri (döviz, türev temel); kredi izleme ve erken uyarı |
| Özel Bankacılık | Varlık yönetimi ve yatırım danışmanlığı (SPK Düzey 3 / Türev); portföy yapılandırma ve risk profili; sermaye piyasası ürünleri; vergi ve miras temel; yüksek gelirli müşteri ilişki yönetimi |

### 3.4 D — Gişe / Operasyon

Nakit ve kasa yönetimi; havale/EFT/swift ve ödeme işlemleri; çek-senet ve kıymetli evrak; döviz ve kıymetli maden işlemleri; sahte para/belge tespiti; işlem sonu mutabakat ve kasa farkı yönetimi; müşteri ilişkileri (operasyon) için: hesap açılış/kapanış ve belge kontrolü, veraset/vekalet işlemleri, kredi kullandırım operasyonu.

### 3.5 E — Şube ve Bölge Yönetimi

Şube bütçe ve kârlılık yönetimi; kredi yetki kullanımı ve portföy risk yönetimi; şube operasyonel kontrol ve denetim hazırlığı; ekip hedef yönetimi ve koçluk (davranışsal liderlikle çakışmayan teknik kısmı); bölge için: çoklu şube performans analizi, pazar/rakip analizi.

### 3.6 Hedef seviye matrisi (örnek, karar sonrası doldurulacak)

| Beceri | Gişe Yetk. | Bireysel PY | KOBİ PY | Ticari PY | Özel PY | MİY | Şube Md. | Bölge Seg. Yön. |
|---|---|---|---|---|---|---|---|---|
| A1 Mevzuat/uyum | 2 | 2 | 3 | 3 | 3 | 3 | 4 | 4 |
| A2 MASAK/KYC | 3 | 2 | 3 | 3 | 3 | 3 | 4 | 4 |
| A5 Ürün bilgisi | 2 | 3 | 3 | 3 | 3 | 2 | 4 | 4 |
| B1 Portföy derinleştirme | – | 3 | 3 | 3 | 4 | – | 4 | 5 |
| B4 Kredi ön değerlendirme | – | 2 | 3 | 4 | 2 | – | 4 | 4 |
| C Mali tablo analizi | – | 1 | 3 | 4 | 2 | – | 3 | 4 |
| C Dış ticaret | – | – | 2 | 4 | 1 | 2 | 3 | 4 |
| C Varlık yönetimi | – | 1 | – | – | 4 | – | 2 | – |
| D Nakit/kasa | 3 | 1 | – | – | – | 2 | 2 | – |
| E Şube kârlılık | – | – | – | – | – | – | 4 | 5 |

Hedefler **şube sınıfına** göre istisna alabilir (büyük şube ticari PY: mali analiz 4, küçük şube: 3).

**Kademe ilişkisi:** aynı rol ailesinde kademe yükseldikçe hedef +1 (Yetkili 2 → Yöneticisi 3 → Kıdemli 4). Terfi için "zorunlu beceri eşiği" karar S5 gereği ilk döngülerde uygulanmaz, raporlanır.

---

## 4. Bankacılığa özgü kanıt türleri (05'e ek)

Şube ağında kanıtın büyük kısmı **sistem verisi** olmalı; çalışan ve yönetici yükü böyle azalır.

| Kanıt türü | Örnek | Kaynak | Seviyeye bağlama |
|---|---|---|---|
| Lisans / sertifika | SPK Düzey 1-2-3, Türev Araçlar, SEGEM, BES | İK/HRIS, belge | Belirli göstergeler için **ön koşul** (lisans yoksa B5 seviye 2'yi geçemez) |
| Yetki limiti | Kredi tahsis yetkisi, işlem onay limiti | Kredi politikası sistemi | Yetki seviyesi = gösterge kanıtı (yetki 3. kademe → B4 seviye 4 göstergesi) |
| Performans KPI | Çapraz satış, yeni müşteri, portföy büyümesi, dijital aktivasyon, NPS | Satış/CRM raporları (CSV içe aktarma) | Gösterge eşiği: "12 ay üst üste hedefin ≥ %100'ü" gibi; eşikler segment GMY ile belirlenir |
| Kalite verisi | Tahsis geri dönüş oranı, operasyonel hata, kasa farkı, şikayet tekrar oranı | Kredi tahsis, operasyon, şikayet sistemleri | Ters gösterge (düşük olması kanıt) |
| Denetim/iç kontrol | Teftiş bulgusu, iç kontrol puanı, uyum sınavı | Teftiş kurulu, uyum | "Son denetimde A4'te bulgu yok" |
| Gözlem/koçluk | Bölge segment yöneticisinin saha ziyareti notu, ortak müşteri görüşmesi | Sistem formu | Satış/görüşme göstergeleri için birincil kanıt |
| Vaka çalışması / sınav | Mali analiz vaka sınavı, ürün bilgisi sınavı | Sistem içi veya dış | Bilgi göstergeleri için |
| Gizli müşteri | Hizmet kalitesi skoru | Kalite ekibi | A8, B2 |

Kural: **Kanıt kasası sistem verisini otomatik doldurur** (CSV içe aktarma, sonra entegrasyon); çalışan sadece sistemde olmayan kanıtı (vaka, görüşme örneği, proje) ekler. Göstergelerde "otomatik kanıt" bayrağı: `kaynak = Sistem verisi, eşik = …`.

---

## 5. Süreçler (şube ağı uyarlaması)

### 5.1 Seçim (tasarım)
1. Segment GMY'leri + 3–4 bölge + İK ile çalıştay: rol başına beceri seti ve gösterge taslağı (rol başına 1 çalıştay, toplam ~10).
2. Sistem verisi eşikleri: her KPI göstergesi için seviye eşikleri segment GMY'si tarafından verilir.
3. Pilot: 2 bölge (≈60 şube) bir döngü; eşikler ve göstergeler revize; sonra tüm ağ.

### 5.2 Ölçüm ve kanıt
- Yıl boyunca **sistem verisi otomatik** akar; çalışan kanıt kasasında eksik göstergeleri görür.
- Bölge segment yöneticisi saha ziyaretlerinde gözlem notunu mobilden girer (fonksiyonel kanıt).
- Lisans ve yetki limiti değişince ilgili gösterge otomatik güncellenir.

### 5.3 Değerlendirme (çift hat)

| Adım | Kim |
|---|---|
| Öz-beyan + kanıt | Çalışan |
| 360 (davranışsal) | Şube içi akran, MİY/gişe (iç müşteri), şube müdürü; portföy yöneticileri için bölge segment yöneticisi |
| Kanıt doğrulama (idari) | Şube müdürü |
| Fonksiyonel teyit | Bölge segment yöneticisi: teknik becerilerde (B, C) idari doğrulamayı teyit eder veya itiraz eder |
| Seviye 5 üst doğrulama | Bölge müdürü veya segment GMY temsilcisi |
| Mutabakat | Şube müdürü + çalışan (fonksiyonel görüş ekte) |
| İtiraz | İK iş ortağı + bölge müdürü (S4 kuralının şube karşılığı) |
| Şube müdürü değerlendirmesi | Bölge müdürü idari; segment yöneticileri fonksiyonel girdi |

### 5.4 Kalibrasyon (üç kademe)

| Kademe | Kapsam | Kimler | Ne bakılır |
|---|---|---|---|
| Şube | Şube içi ekipler | Şube müdürü | Portföyler arası tutarlılık |
| Bölge | ~30 şube, rol bazında | Bölge müdürü + segment yöneticileri + İK iş ortağı | Şubeler arası dağılım, cömertlik endeksi, sistem verisi ile mutabık seviye uyumu ("KPI düşük ama seviye 4" bayrağı) |
| Merkez | Segment bazında tüm bölgeler | Segment GMY + İK | Bölgeler arası dağılım, eşik revizyonu |

Sistem her kademe için hazır pano üretir: dağılım, bayraklı kayıtlar, önerilen düzeltmeler. Kalibrasyon kararları gerekçeli ve denetim izinde.

### 5.5 Mevcut davranışsal değerlendirmenin devralınması
- Mevcut soft skill yetkinlik listesi yeni sözlüğe **eşlenir** (birebir, birleştirme, emekli).
- Son 1–2 dönem sonuçları "devralınan dönem" olarak içe aktarılır; gösterge bazlı değil puan bazlı olduğu için `kanıtlanmış_seviye = null, mutabık_seviye = devralınan` işaretiyle saklanır; ilk yeni döngüde gösterge bazlı yeniden kanıtlanır.
- Bölgelerin alıştığı takvim ve roller korunur; yeni olan teknik beceri satırları ve kanıt kasasıdır.

---

## 6. Ölçek ve yük hesabı (6.400 çalışan, 600 yönetici)

| Büyüklük | Değer | Not |
|---|---|---|
| Ortalama ekip | ~10,7 kişi / yönetici | Şubede şube müdürü 8–20 kişi değerlendirebilir |
| Değerlendirme satırı / kişi | 12–18 beceri + 10–12 davranışsal ≈ 25–30 | Rol profili bu sınırı aşmamalı |
| Gösterge kararı / kişi | ≈ 25 satır × ~4 gösterge (hedef seviyeye kadar) ≈ 100 | Sistem verisiyle otomatik dolanlar hariç |
| Yönetici başına karar / döngü | ≈ 1.000 | **Riskli**; aşağıdaki önlemler şart |
| 360 davet / döngü | 6.400 × 4–6 ≈ 30.000 | Gösterge bazlı kısa form (≤ 10 dk) |

Önlemler:
- **Otomatik kanıt**: şube becerilerinin yarısından fazlası sistem verisi/lisans/yetki ile dolsun → yönetici sadece istisnaları karara bağlar.
- **Toplu doğrulama ekranı**: yönetici, ekibin aynı göstergesini tek ekranda görür ve karar verir.
- **Yalnızca hedef seviyeye kadar** göstergeler sorulur; üstü isteğe bağlı.
- **Döngü kademelendirme**: bölgeler 2–3 dalgada açılır; sistem yükü ve İK destek kapasitesi dengelenir.
- **İK iş ortağı başına bölge**: bölge başına 1 İK iş ortağı kalibrasyon ve itirazları taşır (❓ S26).

---

## 7. Şube ağına özgü raporlar

- **Bölge yetkinlik haritası**: 30 şube × rol × beceri; şubeler arası kıyas.
- **Segment haritası**: tüm ağda KOBİ portföy yöneticilerinin mali analiz dağılımı.
- **Lisans/yetki uyum raporu**: lisansı olmadan ürün satan/yetki üstü işlem yapan kişi listesi (uyum riski).
- **Kritik şube rolleri**: tek ticari portföy yöneticisi olan şubeler (bus factor = 1), yedeği olmayan şube müdürlükleri.
- **Şube müdürü yedek havuzu**: bölge bazında hazır / 1-2 yıl / 3+ yıl; portföyler arası geçiş (KOBİ PY → ticari PY) kariyer yolları.
- **KPI–seviye uyumu**: sistem verisi ile mutabık seviye arasındaki tutarsızlıklar (kalibrasyon girdisi).
- **Devralınan davranışsal trend**: eski dönemlerle karşılaştırma.
