# 01 · Yapı Tasarımı — Yetkinlik Yönetim Sistemi

> Amaç: Uygulama yazılmadan önce kavramsal yapıyı, süreçleri, kuralları ve ölçümleri netleştirmek.
> Sembol: ✅ sizin tarifinizden gelen, ➕ benim eklediğim, ❓ karar bekleyen (bkz. `03-acik-sorular-ve-kararlar.md`).
>
> **Güncelleme 19.10.2026 — alınan kararlar:** 100+ departman ölçeği; HRIS bağlantısı sonraya; davranışsal ölçek aynı 1–5; 360 var; seviye 5 için üst doğrulama; itirazda İK + üst yönetici; ücret/terfiden ayrık; web + mobil; eğitim kataloğu kapsam dışı; potansiyel bu sistemde ölçülecek; **tüm seviyelerde davranış göstergesi ve her puan kanıtla** (ayrıntı: `05-kanit-gosterge-ve-potansiyel-modeli.md`). **Şube ağı** (bölge → şube → portföy ekipleri) aynı yapıya dahil edildi: `06-sube-agi-yapisi.md`. Teknoloji: kısıt yok, tüm sistem birlikte: `07-teknik-mimari.md`. Ölçek: 6.400 çalışan, 600 yönetici, 15 bölge, 450 şube. Pilot yok; prova döngüsü + tek seferde açılış.

---

## 0. Teşhis: Bu sistem hangi problemi çözüyor?

Tarif ettiğiniz ihtiyaç tek bir "değerlendirme formu" değil; **yetkinlik temelli bir organizasyon (skills-based organization)** altyapısı. Aynı veri beş farklı kararı besleyecek:

| Karar | Bugün nasıl veriliyor? | Sistemle nasıl verilecek? |
|---|---|---|
| Kim neyi ne kadar iyi yapıyor? | Yönetici sezgisi | Seviye ölçeğiyle, kanıta dayalı, mutabık kalınmış kayıt |
| Kimi nasıl geliştireceğiz? | Genel eğitim katalogu | Açık (gap) bazlı bireysel gelişim planı |
| Hangi rol / beceri kaybedilirse kurum zarar görür? | Bilinmiyor / kişiye bağlı | Kritiklik skoru + yedekleme kapsama oranı |
| Kimi yedek yetiştireceğiz? | Ad hoc | Hazırlık seviyesi hesaplanmış yedek havuzu |
| Kimi işe alacağız? | Pozisyon ilanı | Rol profilindeki açık yetkinliklere göre mülakat ve puan kartı |

**En büyük tasarım riski:** değerlendirme ücret/terfiye bağlanırsa öz-değerlendirmeler şişer, yöneticiler çatışmadan kaçınır ve veri bozulur (literatürde "rating inflation"). Bu yüzden ilk döngüde ölçümü **gelişim amaçlı** tutmayı, ücret/terfi bağlantısını veri olgunlaştıktan sonra ayrı bir karar olarak ele almayı öneriyorum (❓ S5).

---

## 1. Kavramsal çerçeve

Seçilen çerçeveler ve neden:

- **Yetkinlik sözlüğü + rol profilleri + seviye ölçeği** (Korn Ferry / Lominger ve SFIA mantığı): seviye tanımları davranışsal çıpalarla yazılır, kişiye değil role hedef verilir.
- **Davranışsal çıpalı derecelendirme (BARS):** her seviyede "ne yapıyor olmalı" somut cümlelerle yazılır; "iyi / çok iyi" gibi yargı sözcükleri kullanılmaz. Değerlendiriciler arası tutarlılığı artırır.
- **70-20-10 gelişim modeli:** gelişim planı eylemleri iş başında (%70), ilişkiyle (%20, mentor/koç) ve eğitimle (%10) dağıtılır.
- **9-kutu (performans × potansiyel)** ve **yedekleme hazırlık seviyeleri** (hazır / 1-2 yıl / 3+ yıl): yedekleme modülünün omurgası.
- **Build / Buy / Borrow** (stratejik işgücü planlaması): açık yetkinliği içeriden mi yetiştireceğiz, dışarıdan mı alacağız, geçici mi temin edeceğiz?

---

## 2. Yetkinlik mimarisi

### 2.1 İki ana aile ✅

```
Yetkinlik Kütüphanesi
├── Teknik Beceriler (hard skills)
│   ├── Genel Müdürlük                       ← departman/servis yöneticilerinden toplanır
│   │   ├── Departman A → Servis A1 → beceri 1..n
│   │   └── Ortak teknik beceriler (➕ birden fazla serviste geçen: Excel, SQL, ERP modülü vb.)
│   └── Şube Ağı                             ← rol başına merkezi tasarım (bkz. 06)
│       ├── Ortak şube çekirdeği · Satış/portföy çekirdeği
│       ├── Segmente özgü (bireysel, bizbize, KOBİ, ticari, özel bankacılık)
│       └── Gişe/operasyon · Şube ve bölge yönetimi
└── Davranışsal Yetkinlikler (soft skills)     ← İK ekibi seçer
    ├── Çekirdek (➕ herkes için zorunlu, 8-12 adet)
    └── Liderlik (➕ sadece yönetici rolleri, 5-7 adet)
```

➕ **Ortak teknik beceriler havuzu** önemli: aynı beceri üç serviste üç farklı adla girilirse harita bozulur. Toplama sürecinde İK "standardizasyon" yapar (bkz. şablon dokümanı).

➕ **Beceri kategorileri (etiket):** Yazılım/Araç, Mevzuat/Standart, Süreç/Metodoloji, Ürün/Alan bilgisi, Ekipman/Teknik işlem, Dil. Raporlamada filtre olarak kullanılır.

➕ **Gelecek eğilimi etiketi:** Yükselen / Stabil / Azalan. İşgücü planlamasında "azalan" becerilere yatırım yapılmaz, "yükselen"lerde erken açık yakalanır.

### 2.2 Seviye ölçeği ✅ (5 seviye) + ➕ seviye 0

| Kod | Ad | Genel tanım (tüm becerilerde ortak çıpa) | Özerklik | Karmaşıklık | Etki alanı |
|---|---|---|---|---|---|
| 0 | Yok / Uygulanamaz | Beceri bu kişi için geçerli değil veya hiç deneyim yok | – | – | – |
| 1 | Başlangıç | Temel kavramları bilir, yakın gözetimle basit görevleri yapar | Gözetim altında | Basit, tanımlı | Kendi görevi |
| 2 | Uygulayıcı | Standart görevleri bağımsız yapar; rutin dışı durumda destek ister | Rutin işte bağımsız | Standart | Kendi görevi |
| 3 | Yetkin Uygulayıcı | Karmaşık/rutin dışı görevleri bağımsız çözer; başkalarına rehberlik eder; kalite referansıdır | Tam bağımsız | Karmaşık | Ekip |
| 4 | Yöneten | Alanın standardını, yöntemini ve kalitesini belirler; başkalarını geliştirir; süreci iyileştirir | Alanı yönetir | Belirsiz / çok değişkenli | Departman |
| 5 | Yön Veren | Kurum çapında yön verir; yeni yaklaşımlar geliştirir; iç/dış referans uzmanıdır | Stratejik | Yeni / öncü | Kurum ve dışı |

Kurallar:
- ✅ Her yetkinlik × her seviye için **3–5 davranış göstergesi** yazılır; seviye bir sayı seçilerek değil, kanıtlanmış göstergelerden **hesaplanarak** belirlenir (bkz. `05`).
- Her teknik beceri için 1–5 seviyelerinin **beceriye özgü davranışsal çıpası** yazılır (yukarıdaki genel tanım sadece rehberdir). Çıpa cümleleri "…yapar / …tasarlar / …öğretir" fiiliyle gözlenebilir olmalıdır.
- ✅ (S2 kararı) Davranışsal yetkinlikler aynı 1–5 sayısal ölçeği kullanır; seviye adları: Gelişmekte / Uygular / Güçlü / Rol model / Kültür taşıyıcı.

### 2.3 Teknik beceri ↔ davranışsal yetkinlik bağı ✅➕ ("katalizör" modeli)

Sizin gözleminizi modele çeviriyoruz: *"Sürekli öğrenme güçlü olan teknik becerilerde yükselir; süreç odaklı olan süreç geliştirme becerisinde yükselir."*

**Tanım:** Her teknik beceri için 1–3 adet **katalizör davranışsal yetkinlik** ve ağırlığı tanımlanır; ayrıca üst seviyelere geçiş için **eşik** konabilir.

| Teknik beceri | Katalizör yetkinlik | Ağırlık | Eşik kuralı (örnek) |
|---|---|---|---|
| Süreç İyileştirme (Kaizen/Lean) | Süreç Odaklılık | 0,5 | Seviye 4 için ≥ 3 |
|  | Analitik Düşünme | 0,3 | |
|  | Etki ve İkna | 0,2 | Seviye 5 için ≥ 3 |
| SAP MM Modülü | Sürekli Öğrenme | 0,6 | Seviye 3 için ≥ 2 |
|  | Problem Çözme | 0,4 | |

Sistemde dört yerde kullanılır:

1. **Gelişim önerisi:** teknik açık varsa ve katalizör yetkinlik de düşükse plan önce katalizöre eylem ekler ("SAP'de 3'e çıkmak istiyor ama Sürekli Öğrenme 1 → önce öğrenme alışkanlığı").
2. **Potansiyel tahmini:** kişinin bir teknik beceride bir üst seviyeye çıkma "olasılık puanı" = katalizör yetkinliklerin ağırlıklı ortalaması. Yedek aday sıralamasında kullanılır.
3. **Tutarlılık kontrolü (kalibrasyon bayrağı):** teknik 5, katalizörleri 1–2 olan kayıt "incelenmeli" işaretlenir. Yanlış puanlamayı yakalar.
4. ➕ **Ampirik doğrulama:** 2–3 döngü sonra sistem, hipotez edilen bağların gerçekten seviye artışıyla korele olup olmadığını raporlar; ağırlıklar veriyle güncellenir. Böylece model "inanç" değil "kanıt" olur.

---

## 3. Organizasyon ve rol yapısı

```
Kurum → [Direktörlük / GMY …] → Departman → Servis (birim) → Rol (iş ailesi + kademe) → Pozisyon (kadro) → Kişi
```

Şube ağı: `Kurum → Şube Bankacılığı GMY → Bölge Müdürlüğü (~30 şube) → Şube → Portföy ekibi → Rol → Pozisyon → Kişi` (bkz. `06`).

➕ (100+ departman kararı) Organizasyon **serbest derinlikte ağaç** olarak modellenir (her birimin bir üst birimi ve türü vardır); "departman" ve "servis" tür etiketidir, katman sayısı sabit değildir (❓ S19). Organizasyon verisi şimdilik Excel/CSV ile yüklenir; HRIS bağlantısı sonraki fazda.

- **Rol:** "Satınalma Uzmanı", "Bakım Mühendisi" gibi tekrarlayan iş tanımı. **Rol profili** burada tanımlanır.
- **Pozisyon:** rolün belirli bir servisteki kadrosu (bir rol birden çok pozisyon olabilir). ➕ Pozisyon düzeyinde rol profiline **istisna** (ek beceri / farklı hedef) verilebilir.
- **Kişi:** bir pozisyona atanır; geçmiş atamalar saklanır (kariyer geçmişi).

### 3.1 Rol profili (yetkinlik gereksinimi)

| Alan | Açıklama |
|---|---|
| Beceri / yetkinlik | Kütüphaneden |
| Hedef seviye | 1–5 |
| Rol içi ağırlık | 1 Destekleyici · 2 Önemli · 3 Çekirdek |
| Zorunlu mu? | Zorunlu ise işe alım/terfi için eşik |

➕ **Kariyer yolları:** Rol A → Rol B geçişleri tanımlanır; kişi bir sonraki rolün profiline göre otomatik açık görür ("Uzman → Kıdemli Uzman için 3 beceride 1 seviye açık").

➕ **Rol profili kalıtımı:** Çekirdek davranışsal yetkinlikler tüm rollere otomatik eklenir; liderlik yetkinlikleri "yönetici" bayraklı rollere eklenir. Tek tek girilmez.

---

## 4. Süreçler (uçtan uca)

### 4.1 Faz 1 — Kütüphane kurulumu (tespit)

**Davranışsal:** İK ekibi aday sözlükten (bkz. `04-…`) 8–12 çekirdek + 5–7 liderlik yetkinliği seçer; seviye çıpalarını onaylar; üst yönetim onayı alınır.

**Teknik:** 100+ departman olduğu için toplama Excel ile değil, uygulamanın **ilk modülü olan Beceri Toplama Portalı** ile yapılır (❓ S23). Şablon dokümanı portalın form tasarımıdır. Portal: benzer beceri önerisi (mükerrer önleme), gösterge yazım yardımı, ➕ **departman küratörü** rolü (gösterge taslaklarını yazar, İK onaylar). Akış:

```
Yönetici taslağı → İK standardizasyon (birleştirme, adlandırma, çıpa kalitesi) → Yönetici teyidi → Departman müdürü onayı → Kütüphane (v1.0, "Aktif")
```

➕ Kütüphane **sürümlüdür**: bir beceri değiştiğinde eski değerlendirmeler eski sürüme bağlı kalır; rapor "aynı sürümle" karşılaştırır.

➕ **Beceri yaşam döngüsü:** Taslak → İncelemede → Aktif → Emekli (yeni değerlendirme yapılmaz, geçmiş korunur).

### 4.2 Faz 2 — Rol profilleri

Yöneticiyle birlikte her role hedef seviye ve ağırlık atanır. ➕ Sistem "aynı rol farklı serviste farklı hedef" tutarsızlıklarını raporlar.

### 4.3 Faz 3 — Değerlendirme döngüsü

**Kaynaklar (S3 kararı):**

| Kaynak | Durum | Not |
|---|---|---|
| Öz-beyan | Zorunlu | Çalışan göstergeleri işaretler ve **kanıt** sunar ("yaptım" formu) |
| Yönetici doğrulaması | Zorunlu | Her kanıtı kabul/red eder, gözlem notu ekler; seviye hesaplanır |
| 360 | Var | Davranışsal: tam 360; teknik: gözlem teyidi (❓ S22). Gösterge bazlı "gözlemledim / gözlemlemedim" |
| Nesnel kanıt | Zorunlu (göstergeye göre) | Sertifika, sınav, iş çıktısı, proje, ölçülebilir sonuç |
| Üst doğrulama | Seviye 5 için zorunlu | N+2 veya İK'nın atadığı alan uzmanı onaylamadan 5 verilmez |
| ➕ Potansiyel değerlendirmesi | Yıllık, döngü içinde | Kanıtlı potansiyel göstergeleri (bkz. `05` §6) |

| ➕ Alan uzmanı doğrulaması (şube ağı) | Seviye 5 | Segment GM departmanından atanmış uzman, bölge müdürüyle birlikte onaylar (portföyler bölgeye fonksiyonel bağlı olmadığı için tek hat + uzman) |
| ➕ Sistem verisi (otomatik kanıt) | Şube ağında ağırlıklı | KPI, lisans, yetki limiti, denetim bulgusu CSV ile kanıt kasasına akar |

**Temel kural:** Mutabık seviye, kabul edilmiş kanıtla hesaplanan seviyeden yüksek olamaz.

**Döngü takvimi:** Yıllık ana döngü + ➕ 6 aylık ara güncelleme (sadece gelişim planı kapsamındaki beceriler yeniden puanlanır). Yeni işe giren için işe başlangıçtan 90 gün sonra ilk değerlendirme.

**Değerlendirme durum makinesi:**

```
Açıldı → Öz-beyan ve kanıtlar sunuldu → 360 toplandı → Yönetici kanıt doğrulaması tamamlandı
      → (Seviye 5 iddiası varsa) Üst doğrulama → Mutabakat görüşmesi → [Mutabık | İtiraz]
      → (İtiraz: İK + üst yönetici ortak karar) → Potansiyel değerlendirmesi → Kesinleşti → Kilitli
```

➕ **Kalibrasyon oturumu:** GM'de departman müdürü + İK; şube ağında üç kademe (şube → bölge → segment GMY, bkz. `06` §5.4). Servisler/şubeler arası dağılımı karşılaştırır (bir yönetici herkese 4 vermiş mi?). Sistem bunun için "yönetici cömertlik endeksi" ve dağılım grafiği üretir.

### 4.4 Mutabakat ✅

Her beceri satırında: öz-beyan seviyesi, kanıtlanmış seviye, **mutabık seviye**, gösterge bazında kabul/red listesi, görüşme notu, tarih, iki tarafın onay işareti. Fark ≥ 2 seviye veya reddedilmiş zorunlu kanıt varsa görüşme zorunlu. Görüşme sayı değil kanıt üzerinden yapılır: "bu gösterge için hangi kanıt eksik?". İtirazda (S4 kararı) **İK + üst yönetici** birlikte karar verir; karar gerekçesi ve hangi kanıtın nasıl değerlendirildiği yazılır.

Kayıt altına alınanlar: kim, ne zaman, hangi puanı, hangi gerekçeyle verdi; mutabakat metni; itiraz gerekçesi; nihai karar. Tam denetim izi.

### 4.5 Açık analizi ve gelişim planı (IDP)

**Açık** = Hedef seviye − Mutabık seviye (negatif açık = "fazlalık", mentor adayı).

**Öncelik puanı** = Açık × Rol içi ağırlık × Beceri kritikliği (1–3). Plan ilk 3–5 önceliğe odaklanır (kaynak dağılmasın).

**Plan satırı:** beceri, mevcut → hedef seviye, eylem tipi (70-20-10), eylem, sorumlu, mentor, bitiş tarihi, başarı kanıtı, durum, ilerleme %. ➕ Katalizör önerisi otomatik eklenir. ➕ **Eksik gösterge = eylem**: plan satırı, kanıtlanmamış göstergeleri doğrudan hedef olarak listeler ("Seviye 3 için 3.2 'aksiyon planı kurdu' kanıtı gerekiyor"). Eğitim kataloğu/LMS **kapsam dışı** (S9); eylem serbest metin + tür (iş başında / mentor / eğitim) olarak girilir, kurum eğitimi bağlanmaz.

➕ **Mentor eşleştirme:** Aynı beceride seviye ≥ 4 olanlar, seviye ≤ 2 olanlara mentor önerilir (yük dengesi: bir mentor ≤ 3 kişi).

➕ **Plan kapanışı:** eylem bitince "yeniden değerlendirme talebi" tetiklenir; seviye artışı plan satırına bağlanır → gelişim hızı metriği buradan hesaplanır.

### 4.6 Ölçümleme ve raporlama

**Kurumsal yetkinlik haritası (ısı haritası):** satır = beceri, sütun = servis/departman; hücre = ortalama seviye ve hedef karşılama %. Renk: yeşil (≥ hedef), sarı (1 açık), kırmızı (≥ 2 açık).

| Metrik | Formül | Ne için |
|---|---|---|
| Hedef karşılama oranı | Hedefi karşılayan satır / toplam satır | Rol, servis, kurum olgunluğu |
| Ortalama açık | Σ açık / satır sayısı | Gelişim yükü |
| Güçlü alanlar | Ortalama seviye ≥ hedef + 0,5 olan beceriler | Rekabet avantajı, mentor havuzu |
| Gelişim alanları | Hedef karşılama < %60 olan beceriler | Eğitim bütçesi önceliği |
| Beceri kapsama (bus factor) | Seviye ≥ 3 olan kişi sayısı | Kritik beceri riski |
| Gelişim hızı | Yılda kazanılan seviye adımı / kişi | Planların etkinliği |
| Plan tamamlama | Kapanan eylem / toplam eylem | Uygulama disiplini |
| Öz–yönetici farkı | Ortalama (öz − yönetici) | Kalibrasyon kalitesi |
| Değerlendirme tamamlanma | Kesinleşen / açılan | Süreç uyumu |
| Yedekleme kapsama | Hazır yedeği olan kritik rol / kritik rol | Risk |
| ➕ Katalizör korelasyonu | Katalizör puanı ile seviye artışı arasındaki ilişki | Modelin doğrulanması |

Trend: her döngü anlık görüntü (snapshot) alınır; "2026 → 2027 harita değişimi" raporu.

➕ **Yetkinlik envanteri araması:** "SQL ≥ 3 ve İngilizce ≥ 3 olan kimler var?" → proje kadrolama, geçici görevlendirme.

### 4.7 Kritik yetkinlik ve kritik rol ✅➕

**Kritik beceri skoru** (her boyut 1–5, İK + müdür puanlar):

| Boyut | Soru |
|---|---|
| İş etkisi | Bu beceri yoksa operasyon/ciro/uyum ne kadar etkilenir? |
| İç kıtlık | Seviye ≥ 3 kaç kişide var? (1 kişi = 5 puan) |
| Edinim süresi | Sıfırdan seviye 3'e kaç ay? |
| Dış piyasa kıtlığı | Dışarıdan temin ne kadar zor? |
| Kayıp riski | Sahiplerinin ayrılma/emeklilik riski |

Skor = ağırlıklı toplam; ≥ eşik → "Kritik". ➕ Kritik beceriler için **bilgi aktarım planı** (dokümantasyon, gölgeleme, çift kadrolama) zorunlu.

**Kritik rol skoru:** stratejik etki, benzersizlik, doldurma süresi, boşluğun maliyeti, kritik beceri yoğunluğu.

### 4.8 Yedekleme (succession) ✅➕

Her kritik rol için aday havuzu. **Hazırlık seviyesi** otomatik önerilir, yönetici/İK teyit eder:

| Hazırlık | Kural (öneri) |
|---|---|
| Hazır (şimdi) | Zorunlu becerilerde açık yok; toplam açık ≤ 2 |
| 1–2 yıl | Zorunlu becerilerde açık ≤ 1; katalizör puanı yüksek |
| 3+ yıl | Daha büyük açık ama potansiyel yüksek |

✅ **Potansiyel** bu sistemde ölçülür (S11): uzmanlık ve liderlik potansiyeli ayrı, kanıtlı göstergelerle; performans verisi gelince 9-kutu ayrı modülde (bkz. `05` §6). ➕ **Kişi risk kaydı:** ayrılma riski, emeklilik tarihi, tek nokta bağımlılığı. ➕ **Yedek derinliği raporu:** her kritik rol için 0 / 1 / 2+ hazır yedek.

### 4.9 İşe alım bağlantısı ✅➕

- **Build / Buy kararı:** kritik beceride içeride "1–2 yıl" adayı yoksa → işe alım talebi önerisi.
- **İş tanımı üretimi:** rol profilinden zorunlu/önemli beceriler ve hedef seviyeleri otomatik ilana gelir.
- **Yetkinlik bazlı mülakat kılavuzu:** her beceri için hedef seviyenin çıpasına dayalı davranışsal sorular (STAR) ve puan kartı; aynı 1–5 ölçeği.
- **Aday profili:** mülakat puanları rol profiline göre açık raporu üretir; işe alınırsa ilk IDP otomatik oluşur, 90. gün değerlendirmesi planlanır.
- ➕ **İşe alım kalitesi geri beslemesi:** mülakat puanı ile 90. gün / 1. yıl mutabık puanı karşılaştırılır → mülakat sürecinin öngörü gücü ölçülür.

---

## 5. Roller ve yetkiler (uygulama)

| Rol | Yapabildikleri |
|---|---|
| Çalışan | Kendi profilini, öz-değerlendirmesini, planını görür/doldurur; mutabakatı onaylar |
| Yönetici (servis) | Ekibini değerlendirir, mutabakat yapar, plan onaylar, teknik beceri taslağı önerir |
| Departman müdürü | Kütüphane onayı, kalibrasyon, kritik rol/beceri puanlama, yedek aday teyidi |
| İK uzmanı | Kütüphane standardizasyonu, döngü yönetimi, raporlar, hakemlik |
| İK admin | Yapı, roller, sürümler, ayarlar |
| Üst yönetim | Kurum haritası, kritik risk, yedekleme panoları (salt okunur) |
| ➕ Mentor | Mentisinin plan satırını ve ilerlemesini görür |
| ➕ Departman küratörü | Departmanının teknik beceri ve gösterge taslaklarını yazar/düzenler, İK onayına sunar |
| ➕ Üst doğrulayıcı / alan uzmanı | Seviye 5 kanıtlarını onaylar |
| ➕ 360 değerlendirici | Atandığı kişiler için gösterge gözlem beyanı verir (anonim) |

Gizlilik: kişi bazlı puanlar sadece hiyerarşi hattı + İK; akran/360 girdileri anonim; KVKK kapsamında saklama süresi ve açık rıza metni (❓ S10).

---

## 6. Yönetişim ve kalite kuralları

- Kütüphane değişiklikleri onaysız yayınlanmaz; her değişiklik sürüm notu ile.
- Her gösterge için kanıt zorunlu; kanıtsız gösterge "kanıtlanmadı" sayılır. Seviye 5 üst doğrulama olmadan verilmez.
- Kilitlenmiş döngü değiştirilemez; düzeltme yeni "düzeltme kaydı" ile.
- ➕ Beceri "bayatlama": 18 ayda yeniden değerlendirilmeyen seviye "doğrulanmalı" işaretlenir.
- ➕ Sertifika/lisans geçerlilik takibi (bitiş tarihi, hatırlatma).
- Tüm işlemler denetim günlüğünde (kim, ne, ne zaman, önce/sonra).

---

## 7. Uygulama modülleri (ekran haritası)

1. **Organizasyon** — serbest derinlikte birim ağacı/rol/pozisyon/kişi; Excel/CSV içe aktarma (HRIS sonra).
2. **Beceri Toplama Portalı** — yönetici/küratör formu, benzer beceri önerisi, gösterge yazım yardımı, İK standardizasyon kuyruğu, onay zinciri. **İlk teslim edilecek modül.**
3. **Yetkinlik Kütüphanesi** — teknik ve davranışsal; seviye × gösterge × kanıt türü; katalizör bağları; sürüm; yaşam döngüsü.
4. **Rol Profilleri** — hedef seviyeler, ağırlıklar, kariyer yolları.
5. **Değerlendirme Döngüleri** — açma, takvim, öz-beyan + kanıt, 360, yönetici doğrulaması, seviye 5 üst doğrulama, mutabakat, itiraz, kalibrasyon, potansiyel.
6. **Kanıt Kasası** — kişinin tüm kanıtları (dosya, bağlantı, gözlem), gösterge eşlemesi, geçerlilik; mobilden fotoğraf/dosya ile ekleme.
7. **Gelişim Planları** — açık, eksik gösterge, öncelik, eylem, mentor, ilerleme (eğitim kataloğu yok).
8. **Analitik** — ısı haritası, metrik panoları, trend, envanter araması, katalizör doğrulama, potansiyel dağılımı.
9. **Kritik Rol & Yedekleme** — skorlama, aday havuzu, hazırlık, risk kaydı, bilgi aktarım planı (9-kutu performans gelince).
10. **İşe Alım** — iş tanımı, mülakat kılavuzu, aday puan kartı, build/buy.
11. **Yönetim** — kullanıcı/rol, bildirimler, ayarlar (eşikler, ağırlıklar, kanıt geçerlilik süresi), denetim günlüğü.

**Mobil (S8):** Öncelik responsive web + PWA (ana ekrana ekleme, bildirim, çevrimdışı kanıt taslağı). Mobilde öne çıkan işler: kanıt ekleme (fotoğraf/dosya), 360 gözlem beyanı, onay/mutabakat imzası, bildirimler. Native uygulama ihtiyacı pilot sonrasında değerlendirilir.

---

## 8. Yol haritası (öneri)

| Faz | İçerik | Çıktı |
|---|---|---|
| 0 | Yapı ve kararlar (bu dokümanlar) | Onaylı tasarım |
| 1 | **Uygulama v0: Organizasyon + Beceri Toplama Portalı + Kütüphane**; şube ağı için rol başına tasarım çalıştayları (≈10) ve mevcut davranışsal değerlendirmenin eşlenmesi (100+ departmandan toplama buradan yapılır) ve İK ekibinin davranışsal sözlük seçimi + gösterge yazımı | Kütüphane v1.0 (gösterge ve kanıt türleriyle) |
| 2 | Rol profilleri | Hedef seviyeler |
| 3 | Uygulama v1: Değerlendirme döngüsü (öz-beyan + kanıt, 360, doğrulama, seviye 5 uzman onayı, mutabakat, potansiyel) | Prova döngüsü (test ortamı, gerçek veri), ardından tüm ağ |
| 4 | Gelişim planı + analitik + kanıt kasası mobil | Kurum haritası v1 |
| 5 | Kritik rol / yedekleme / işe alım | Risk ve yedek panoları |
| 6 | 2. döngü: katalizör ve potansiyel doğrulama, ağırlık güncelleme; HRIS bağlantısı; performans + 9-kutu | Kanıta dayalı model |

**Riskler ve önlemler:**
- Yöneticiler beceri listesini çok uzun/çok kısa verir → şablonda "servis başına 8–20 beceri" sınırı, İK standardizasyonu.
- Çıpalar yargı sözcüğüyle yazılır → kalite kontrol listesi (şablonda).
- Değerlendirme enflasyonu → gösterge bazlı hesaplanan seviye, her gösterge için kanıt, seviye 5 üst doğrulama, kalibrasyon, ücretle ayrık.
- 100+ departmanda gösterge yazım kalitesi düşer → departman küratörleri + İK onayı + kalite kontrol listesi + ortak havuz.
- 600 yöneticiye döngü başına ~1.000 gösterge kararı düşer → sistem verisiyle otomatik kanıt, toplu doğrulama ekranı, yalnızca hedef seviyeye kadar gösterge, bölgeleri dalgalar halinde açma (bkz. `06` §6).
- Kanıt toplama yük olarak algılanır → kanıt kasası yıl boyunca açık (döngüde değil, iş olurken eklenir), mobil hızlı ekleme, bir kanıt birden çok göstergeyi karşılar.
- Sistem "form doldurma" olarak algılanır → gelişim planı ve mentor eşleşmesi ilk döngüde görünür fayda olarak sunulur; yöneticilere servis haritası hemen geri verilir.

**Başarı ölçütleri (12 ay):** değerlendirme tamamlanma ≥ %90; mutabık kalınan satır oranı ≥ %85; her kritik rol için en az 1 adlandırılmış yedek; plan tamamlama ≥ %60; öz–yönetici farkı ≤ 0,5.

---

## 9. v1.1 eklemeleri — araştırma ve sektör raporlarından türeyen tasarım kararları

Öğrenme raporundaki (11) kuram, meta-analiz ve sektör bulguları tasarıma on ekleme getirdi. Her biri için gerekçe, hangi faza girdiği ve hangi dokümanlarda ayrıntılandığı aşağıdadır. "Ocak" = ilk döngü açılışında var; "Faz 2" = ilk döngü kapanışından sonra.

| # | Ekleme | Gerekçe (kaynak) | Faz | Ayrıntı |
|---|---|---|---|---|
| E1 | **Beceri komşuluğu ve kariyer yolu motoru** — her kişi için rol profilleri arası örtüşmeden hesaplanan "en yakın 3 rol" ve geçiş açığı; kariyer yolları elle değil veriyle de önerilir | Beceri temelli organizasyon literatürü (Mercer, Bersin); LinkedIn: kariyer ilerlemesi öğrenmenin 1. motivasyonu | Ocak (hesap), Faz 2 (öneri ekranı) | 02 §3, 09 P13/P16 |
| E2 | **Delphi uzlaşı aracı** — KPI eşiği ve kritiklik puanları için anonim, iki turlu uzman puanlama; dağılım ve gerekçeler görünür, ikinci turda yakınsama | Delphi tekniği; tek toplantıda "en yüksek ses" sorunu | Ocak (eşikler için şart) | 02 §2.9, 09 P3/P15 |
| E3 | **Danışma ağı sinyali (ONA-lite)** — 360 formuna tek soru: "Teknik sorularınızı en çok kime sorarsınız? (en fazla 3 kişi)"; danışılma sayısı yüksek ama kanıtlanmış seviyesi düşük kişi "gizli uzman, kanıt eksik" bayrağı alır; mentor aday listesine girer | Organizasyonel ağ analizi; seviye 4–5 doğrulaması için ikinci kaynak | Ocak | 02 §2.4, 05 §5, 09 P7/P11 |
| E4 | **Yönetici yük panosu ve eşiği** — döngüde yönetici başına bekleyen gösterge kararı sayısı ve tahmini süre izlenir; eşik aşılırsa İK iş ortağına otomatik uyarı ve "öncelikli satırlar" görünümü | Gartner 2025: yöneticilerin ~%75'i bunalmış; Gallup: ekip bağlılığının ~%70'i yöneticiye bağlı | Ocak | 02 §3, 06 §6, 09 P8 |
| E5 | **Yönetici tutarlılığı liderlik göstergesi** — "Performans Yönetimi" (L7) yetkinliğine sistem verisiyle otomatik dolan gösterge: cömertlik endeksi ±0,5 içinde, red gerekçeleri tam, mutabakat süresinde | Öğrenme raporu 10. bölüm önerisi; yönetici kalitesi ölçülmeden iyileşmez | Ocak (gösterge), ilk döngü sonunda değerlendirilir | 04 B, 05 §2 |
| E6 | **Stratejik beceri planı görünümü** — "Yükselen" etiketli becerilerde hedef kapsama (ör. 2 yılda seviye ≥ 3 olan kişi sayısı), "Azalan" becerilerde yatırım durdurma; yıllık gelecek eğilimi gözden geçirmesi | WEF 2025: becerilerin ~%40'ı 2030'a kadar değişiyor; yarı ömür kısalıyor | Faz 2 (ilk harita sonrası) | 09 P14, P6 |
| E7 | **Gelişim görevleri pazarı** — kısa süreli proje/görev ilanları; açığı olan ve "stretch" isteyen kişiler başvurur; tamamlanan görev hem gelişim planı eylemi hem potansiyel (stretch) kanıtıdır | 70-20-10'un %70'i; Unilever iç yetenek pazarı; CEB potansiyel modelinde "istek" | Faz 2 | 02 §2.5, 09 P13 |
| E8 | **Rol–lisans zorunluluk matrisi** — rol profiline `zorunlu_lisans_kodları`; Uyum birimi onaylı; lisanssız görev yapan listesi uyum raporu olarak çıkar | SPK Tebliği VII-128.7: zorunluluk unvana bağlı; denetimde savunulabilirlik | Ocak | 02 §2.3, 06 §4 |
| E9 | **Değerlendirme merkezi kanıt türü** — şube müdürü ve bölge müdürü yedek havuzları için simülasyon/vaka merkezi; sonuçları "Simülasyon" kanıt türü olarak kasaya girer | Gaugler ve ark. (1987) ~.37, Hermelin ve ark. ~.28 geçerlilik; kritik rollerde değer | Faz 2 | 02 §2.4, 09 P16 |
| E10 | **Ölçüm kalitesi panosu** — değerlendiriciler arası uyum (kappa), gösterge ayırt ediciliği, KPI–seviye yakınsaması, 360 yanıt oranı; döngü kilidinde anlık görüntüye dahil | Psikometrik güvenilirlik/geçerlilik; sistem her döngüde kendi kanıtını üretir | Ocak (temel), Faz 2 (tam) | 02 §2.8, 10 §7 |

**Bilerek eklenmeyenler:** Performansa bağlı ücret ve 9-kutu (S5/S11 kararları); yapay zekâ ile beceri çıkarımı (KVKK ve kanıt ilkesi; en fazla "öneri" olarak Faz 3'te); zorunlu dağılım (araştırma karşı).

