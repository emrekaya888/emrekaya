# 06 · Şube Ağı Yapısı — Bölge, Şube ve Portföy Ekipleri

Karar (19–20.10.2026): Genel Müdürlük departmanları için kurulan yapının aynısı **şube ağı** için de kurulacak. **15 bölge müdürlüğü, 450 şube** (ortalama 30 şube/bölge). Şube sınıfları segment bazlıdır: **Özel Bankacılık, KOBİ, Ticari, Kurumsal** şubeler. Resmi rol adları: Gişe = **Bireysel Satış Temsilcisi**, MİY = **Müşteri İlişkileri**, portföyler = **Bireysel Satış, KOBİ Satış, Ticari Satış, Kurumsal Satış**. Şube müdürleri bölge müdürüne bağlı; portföyler bölgeye fonksiyonel bağlı **değil**. Her bölgenin merkezden atanmış bir İK iş ortağı var. Sistem verileri CSV ile alınabilir. Mevcut davranışsal değerlendirme 3'lü ölçekte. Pilot yapılmayacak, tüm ağ birlikte açılacak. Bölgelerle birlikte davranışsal (soft skill) değerlendirmesi zaten yapılıyor; teknik beceri değerlendirmesi eklenecek. Tüm portföyler için **ortak teknik beceri seti** ve portföye özgü beceriler tanımlanacak; seçim, ölçüm, kanıt, veri kaydı, değerlendirme ve kalibrasyon süreçleri işletilecek.

---

## 1. Teşhis: GM departmanlarından farkı ne?

| Konu | GM departmanları | Şube ağı |
|---|---|---|
| Çeşitlilik | 100+ farklı iş, her servis kendine özgü beceri | **Az sayıda rol, çok sayıda tekrar** (aynı 8–10 rol yüzlerce şubede) |
| Toplama yöntemi | Her servisten ayrı toplama | Rol başına **bir kez** merkezi tasarım (segment GM yardımcılıkları + bölgeler + İK), tüm şubelere uygulanır |
| Kanıt | Çoğunlukla iş çıktısı ve gözlem | **Sistem verisi** çok güçlü: satış, portföy, kredi kalitesi, denetim bulguları, lisanslar, şikayet, NPS |
| Değerlendirici | Servis yöneticisi | **Şube müdürü** (tek hat; portföyler bölgeye fonksiyonel bağlı değil). Teknik derinlik için seviye 5'te segment GM departmanından alan uzmanı |
| Kalibrasyon | Departman içi | **Üç kademe**: şube → bölge (bölge müdürü + merkezden İK iş ortağı) → segment GMY |
| Mevcut durum | Yok | Davranışsal değerlendirme bölgelerle zaten yapılıyor → **devralınacak**, sıfırdan kurulmayacak |

Sonuç: şube ağı için beceri *toplama* değil, beceri *tasarımı ve standartlaştırma* yapılır. Asıl zorluk tutarlılık ve ölçektir: 450 şube, 600 yönetici, 6.400 çalışan, tek seferde açılış.

---

## 2. Organizasyon modeli (şube ağı)

```
Kurum
├── Genel Müdürlük → Direktörlük/GMY → Departman (100+) → Servis          [bkz. 01]
└── Şube Ağı (GMY / Şube Bankacılığı)
    └── Bölge Müdürlüğü ×15 (~30 şube; merkezden atanmış İK iş ortağı)
        └── Şube ×450 — sınıfı: Özel Bankacılık | KOBİ | Ticari | Kurumsal
            ├── Şube Müdürü                      ← bölge müdürüne bağlı
            ├── Bireysel Satış Temsilcisi ekibi  (gişe)
            ├── Bireysel Satış portföyü          (bizbize bankacılık dahil ❓ S31)
            ├── KOBİ Satış portföyü
            ├── Ticari Satış portföyü
            ├── Kurumsal Satış portföyü          (kurumsal şubelerde)
            ├── Özel Bankacılık portföyü         (özel bankacılık şubelerinde ❓ S31)
            └── Müşteri İlişkileri ekibi         (operasyon)
```

Veri modelinde: `OrgBirimi.tür` = Bölge | Şube | Portföy ekibi; `OrgBirimi.şube_sınıfı` = Özel Bankacılık | KOBİ | Ticari | Kurumsal. **Şube sınıfı iki şeyi belirler:** (1) şubede hangi portföy ekipleri bulunur, (2) aynı rolün hedef seviyesi (ticari şubede Ticari Satış için mali analiz hedefi 4, KOBİ şubesindeki ticari satışçı için 3).

**Roller ve kademeler (resmi adlar; kademe adları ❓ S25 ile netleşecek):**

| Rol ailesi | Resmi ad | Kademe önerisi | Yönetici mi |
|---|---|---|---|
| Şube Müdürü | Şube Müdürü | Şube sınıfına göre | Evet |
| Gişe | **Bireysel Satış Temsilcisi** | Temsilci → Kıdemli Temsilci | Hayır |
| Operasyon | **Müşteri İlişkileri** | Yetkili → Yönetici | Son kademe |
| Bireysel portföy | **Bireysel Satış** | Yetkili → Yönetici → Kıdemli | Hayır |
| KOBİ portföy | **KOBİ Satış** | Yetkili → Yönetici → Kıdemli | Hayır |
| Ticari portföy | **Ticari Satış** | Yetkili → Yönetici → Kıdemli | Hayır |
| Kurumsal portföy | **Kurumsal Satış** | Yetkili → Yönetici → Kıdemli | Hayır |
| Özel bankacılık | (resmi ad ❓ S31) | Yönetici → Kıdemli | Hayır |
| Bölge | Bölge Müdürü | – | Evet |
| Bölge (merkez) | İK İş Ortağı | – | İK rolü |

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
| Bireysel Satış (bizbize dahil) | Bireysel kredi değerlendirme ve skorlama; bireysel varlık ürünleri (BES, fon, mevduat yapılandırma); maaş/şirket anlaşmaları; bizbize bankacılığı süreçleri |
| KOBİ | Mali tablo analizi (KOBİ düzeyi); nakit akışı ve teminat yapılandırma; KGF ve destekli krediler; POS/üye işyeri ve nakit yönetimi ürünleri |
| Ticari | İleri mali analiz ve derecelendirme; dış ticaret işlemleri (akreditif, garanti, ihracat kredileri); proje/yapılandırılmış finansman temel; hazine ürünleri (döviz, türev temel); kredi izleme ve erken uyarı |
| Kurumsal Satış | Büyük ölçekli firma mali analizi ve grup/konsolide değerlendirme; sendikasyon ve yapılandırılmış finansman; nakit yönetimi ve tahsilat/ödeme sistemleri; hazine ve türev ürünler (kur/faiz riski yönetimi); uluslararası ticaret finansmanı; kurumsal müşteri ilişki ve paydaş yönetimi (CFO düzeyi) |
| Özel Bankacılık | Varlık yönetimi ve yatırım danışmanlığı (SPK Düzey 3 / Türev); portföy yapılandırma ve risk profili; sermaye piyasası ürünleri; vergi ve miras temel; yüksek gelirli müşteri ilişki yönetimi |

### 3.4 D — Gişe / Operasyon

Nakit ve kasa yönetimi; havale/EFT/swift ve ödeme işlemleri; çek-senet ve kıymetli evrak; döviz ve kıymetli maden işlemleri; sahte para/belge tespiti; işlem sonu mutabakat ve kasa farkı yönetimi; müşteri ilişkileri (operasyon) için: hesap açılış/kapanış ve belge kontrolü, veraset/vekalet işlemleri, kredi kullandırım operasyonu.

### 3.5 E — Şube ve Bölge Yönetimi

Şube bütçe ve kârlılık yönetimi; kredi yetki kullanımı ve portföy risk yönetimi; şube operasyonel kontrol ve denetim hazırlığı; ekip hedef yönetimi ve koçluk (davranışsal liderlikle çakışmayan teknik kısmı); bölge için: çoklu şube performans analizi, pazar/rakip analizi.

### 3.6 Hedef seviye matrisi (örnek, karar sonrası doldurulacak)

| Beceri | BST (gişe) | Bireysel Satış | KOBİ Satış | Ticari Satış | Kurumsal Satış | Özel Bank. | Müşteri İlişkileri | Şube Md. |
|---|---|---|---|---|---|---|---|---|
| A1 Mevzuat/uyum | 2 | 2 | 3 | 3 | 3 | 3 | 3 | 4 |
| A2 MASAK/KYC | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 4 |
| A5 Ürün bilgisi | 2 | 3 | 3 | 3 | 3 | 3 | 2 | 4 |
| B1 Portföy derinleştirme | 1 | 3 | 3 | 3 | 4 | 4 | – | 4 |
| B4 Kredi ön değerlendirme | – | 2 | 3 | 4 | 4 | 2 | – | 4 |
| C Mali tablo analizi | – | 1 | 3 | 4 | 5 | 2 | – | 3 |
| C Dış ticaret | – | – | 2 | 4 | 4 | 1 | 2 | 3 |
| C Nakit yönetimi ürünleri | – | – | 2 | 3 | 4 | – | 1 | 3 |
| C Varlık yönetimi | – | 1 | – | – | – | 4 | – | 2 |
| D Nakit/kasa | 3 | 1 | – | – | – | – | 2 | 2 |
| E Şube kârlılık | – | – | – | – | – | – | – | 4 |

Hedefler **şube sınıfına** göre istisna alır: aynı rol kurumsal şubede +1 (KOBİ şubesindeki Ticari Satış: mali analiz 3; ticari şubede 4; kurumsal şubede Kurumsal Satış 5). Şube müdürü hedefleri de şube sınıfına göre değişir (kurumsal şube müdürü: mali analiz 4, dış ticaret 4).

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
- Şube müdürü ortak müşteri görüşmesi ve iş başı gözlem notunu mobilden girer; bölge müdürü şube ziyaretlerinde şube müdürü için gözlem notu girer.
- Lisans ve yetki limiti değişince ilgili gösterge otomatik güncellenir.

### 5.3 Değerlendirme (tek hat: şube müdürü)

Portföyler bölgeye fonksiyonel bağlı olmadığı için (S26) tek değerlendirici **şube müdürü**dür. Teknik derinliği şube müdürünün tek başına yargılamasının riski, iki mekanizmayla dengelenir: **sistem verisi otomatik kanıt** (yargı yerine ölçüm) ve **seviye 5'te segment GM departmanından alan uzmanı doğrulaması**.

| Adım | Kim |
|---|---|
| Öz-beyan + kanıt | Çalışan (sistem verisi otomatik dolar) |
| 360 (davranışsal) | Şube içi akran, Müşteri İlişkileri/BST (iç müşteri), şube müdürü; şube müdürü için bölge müdürü + şube ekibi (ast) |
| Kanıt doğrulama | Şube müdürü |
| Seviye 5 üst doğrulama | Bölge müdürü + ilgili segment GM departmanının atadığı alan uzmanı (teknik) |
| Mutabakat | Şube müdürü + çalışan |
| İtiraz | Bölge İK iş ortağı + bölge müdürü (S4 kuralının şube karşılığı) |
| Şube müdürü değerlendirmesi | Bölge müdürü; itirazda İK iş ortağı + Şube Bankacılığı GMY |
| Bölge müdürü değerlendirmesi | Şube Bankacılığı GMY; itirazda İK direktörü |

### 5.4 Kalibrasyon (üç kademe)

| Kademe | Kapsam | Kimler | Ne bakılır |
|---|---|---|---|
| Şube | Şube içi ekipler | Şube müdürü | Portföyler arası tutarlılık (sistem bayrakları) |
| Bölge | ~30 şube, rol bazında | Bölge müdürü + bölge İK iş ortağı (+ gerektiğinde segment GM temsilcisi) | Şubeler arası dağılım, şube müdürü cömertlik endeksi, sistem verisi ile mutabık seviye uyumu ("KPI düşük ama seviye 4" bayrağı), şube sınıfına göre kıyas |
| Merkez | Segment bazında 15 bölge | Segment GMY'leri + Şube Bankacılığı GMY + İK | Bölgeler arası dağılım, KPI eşik revizyonu, İK iş ortakları arası tutarlılık |

Sistem her kademe için hazır pano üretir: dağılım, bayraklı kayıtlar, önerilen düzeltmeler. Kalibrasyon kararları gerekçeli ve denetim izinde.

### 5.5 Mevcut davranışsal değerlendirmenin devralınması (3'lü ölçek)

Mevcut ölçek: **iyi olabilirsin / iyisin / çok iyisin**. Yeni ölçek 1–5. Eşleme önerisi (❓ S34):

| Eski | Yeni (dönüştürülmüş) | Gerekçe |
|---|---|---|
| İyi olabilirsin | 2 (Uygular) — gelişim alanı işaretli | "Henüz beklenen düzeyde değil"; 1 değil, çünkü eski ölçek alt ucu yoktu |
| İyisin | 3 (Güçlü) | Beklenen düzey |
| Çok iyisin | 4 (Rol model) | 5 verilmez: 5 üst doğrulama ister, devralınan veride kanıt yok |

Kurallar:
- Devralınan kayıtlar `kanıtlanmış_seviye = null`, `mutabık_seviye = dönüştürülmüş`, `kaynak = Devralınan` ile saklanır; raporlarda ayrı renkle gösterilir.
- İlk yeni döngüde herkes gösterge bazlı yeniden kanıtlar; devralınan seviye **başlangıç referansı**dır, taban değildir (kanıt yoksa düşebilir — çalışana önceden duyurulur, adalet algısı için).
- 3'lü ölçekle 5'li ölçeğin dağılımı ilk döngü sonunda karşılaştırılır (devralınan "çok iyisin"lerin yüzde kaçı 4 kanıtlayabildi?) → kalibrasyon ve iletişim girdisi.
- Mevcut yetkinlik listesi yeni sözlüğe eşlenir (birebir, birleştirme, emekli); bölgelerin alıştığı takvim korunur.

---

## 6. Ölçek ve yük hesabı (6.400 çalışan, 600 yönetici)

| Büyüklük | Değer | Not |
|---|---|---|
| Ortalama ekip | ~10,7 kişi / yönetici | 450 şube; şube müdürü 8–20 kişi değerlendirir, bölge müdürü ~30 şube müdürü |
| Değerlendirme satırı / kişi | 12–18 beceri + 10–12 davranışsal ≈ 25–30 | Rol profili bu sınırı aşmamalı |
| Gösterge kararı / kişi | ≈ 25 satır × ~4 gösterge (hedef seviyeye kadar) ≈ 100 | Sistem verisiyle otomatik dolanlar hariç |
| Yönetici başına karar / döngü | ≈ 1.000 | **Riskli**; aşağıdaki önlemler şart |
| 360 davet / döngü | 6.400 × 4–6 ≈ 30.000 | Gösterge bazlı kısa form (≤ 10 dk) |

Önlemler:
- **Otomatik kanıt**: şube becerilerinin yarısından fazlası sistem verisi/lisans/yetki ile dolsun → yönetici sadece istisnaları karara bağlar.
- **Toplu doğrulama ekranı**: yönetici, ekibin aynı göstergesini tek ekranda görür ve karar verir.
- **Yalnızca hedef seviyeye kadar** göstergeler sorulur; üstü isteğe bağlı.
- **Pilot yok, tek seferde açılış (karar):** pilot yerine (a) gerçek verilerle **prova döngüsü** (test ortamında 2 bölge verisiyle uçtan uca akış, sonuçlar silinir), (b) 600 yöneticiye kısa rol bazlı eğitim ve 15 İK iş ortağına derin eğitim, (c) açılış ayında İK yardım masası, (d) ilk döngünün "kalibrasyon yılı" ilan edilmesi: sonuçlar ücret/terfiye bağlı değil (S5), eşikler ve göstergeler ilk döngü sonunda revize edilir.
- **Tek döngü, dalgalı açılış:** aynı döngü içinde bölgeler 3 dalgada (5+5+5) 2'şer hafta arayla açılır; takvim tek, yük dağıtılmış.
- **İK iş ortağı başına bölge:** 15 bölge × 1 İK iş ortağı kalibrasyon ve itirazları taşır; iş ortağı başına ~30 şube, ~430 çalışan.
- ➕ **Yönetici yük panosu (E4):** şube müdürü başına bekleyen karar ve tahmini süre izlenir; 8 saat/döngü eşiği aşılınca İK iş ortağı devreye girer. Gartner 2025 bulgusu (yöneticilerin ~%75'i bunalmış) bu önlemin gerekçesidir.

---

## 7. Şube ağına özgü raporlar

- **Bölge yetkinlik haritası**: 30 şube × rol × beceri; şubeler arası kıyas.
- **Segment haritası**: tüm ağda KOBİ portföy yöneticilerinin mali analiz dağılımı.
- **Lisans/yetki uyum raporu**: lisansı olmadan ürün satan/yetki üstü işlem yapan kişi listesi (uyum riski).
- **Kritik şube rolleri**: tek ticari portföy yöneticisi olan şubeler (bus factor = 1), yedeği olmayan şube müdürlükleri.
- **Şube müdürü yedek havuzu**: 450 şube için bölge bazında hazır / 1-2 yıl / 3+ yıl; şube sınıfına göre (kurumsal şube müdürü yedekliği ayrı); portföyler arası geçiş (KOBİ Satış → Ticari Satış → Kurumsal Satış) kariyer yolları.
- **Bölge müdürü yedek havuzu**: 15 pozisyon için şube müdürlerinden aday.
- **KPI–seviye uyumu**: sistem verisi ile mutabık seviye arasındaki tutarsızlıklar (kalibrasyon girdisi).
- **Devralınan davranışsal trend**: eski dönemlerle karşılaştırma.
