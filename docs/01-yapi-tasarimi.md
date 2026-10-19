# 01 · Yapı Tasarımı — Yetkinlik Yönetim Sistemi

> Amaç: Uygulama yazılmadan önce kavramsal yapıyı, süreçleri, kuralları ve ölçümleri netleştirmek.
> Sembol: ✅ sizin tarifinizden gelen, ➕ benim eklediğim, ❓ karar bekleyen (bkz. `03-acik-sorular-ve-kararlar.md`).

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
├── Teknik Beceriler (hard skills)            ← departman/servis yöneticilerinden toplanır
│   ├── Departman A
│   │   ├── Servis A1 → beceri 1..n
│   │   └── Servis A2 → beceri 1..n
│   └── Ortak teknik beceriler (➕ birden fazla serviste geçen: Excel, SQL, ERP modülü vb.)
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
- Her teknik beceri için 1–5 seviyelerinin **beceriye özgü davranışsal çıpası** yazılır (yukarıdaki genel tanım sadece rehberdir). Çıpa cümleleri "…yapar / …tasarlar / …öğretir" fiiliyle gözlenebilir olmalıdır.
- ❓ S2: Davranışsal yetkinlikler aynı 1–5 sayısal ölçeği kullanır (ilişki analizi için şart), ama seviye **adları** farklı olabilir (örn. Gelişmekte / Uygular / Güçlü / Rol model / Kültür taşıyıcı).

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
Kurum → Departman → Servis (birim) → Rol (iş ailesi + kademe) → Pozisyon (kadro) → Kişi
```

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

**Teknik:** Her servis için yönetici şablonu doldurur (bkz. şablon). Akış:

```
Yönetici taslağı → İK standardizasyon (birleştirme, adlandırma, çıpa kalitesi) → Yönetici teyidi → Departman müdürü onayı → Kütüphane (v1.0, "Aktif")
```

➕ Kütüphane **sürümlüdür**: bir beceri değiştiğinde eski değerlendirmeler eski sürüme bağlı kalır; rapor "aynı sürümle" karşılaştırır.

➕ **Beceri yaşam döngüsü:** Taslak → İncelemede → Aktif → Emekli (yeni değerlendirme yapılmaz, geçmiş korunur).

### 4.2 Faz 2 — Rol profilleri

Yöneticiyle birlikte her role hedef seviye ve ağırlık atanır. ➕ Sistem "aynı rol farklı serviste farklı hedef" tutarsızlıklarını raporlar.

### 4.3 Faz 3 — Değerlendirme döngüsü

**Kaynaklar (❓ S3):**

| Kaynak | Varsayılan | Not |
|---|---|---|
| Öz-değerlendirme | Zorunlu | Kanıt alanı ile |
| Yönetici değerlendirmesi | Zorunlu | Kanıt/gözlem notu zorunlu |
| Akran / 360 | Opsiyonel, davranışsal için | Teknik için gürültülü olabilir |
| Nesnel kanıt | Opsiyonel | Sertifika, sınav, iş örneği, proje çıktısı |
| ➕ Doğrulama (üst yönetici / uzman) | Seviye 4–5 iddialarında | Üst seviye enflasyonunu engeller |

**Döngü takvimi:** Yıllık ana döngü + ➕ 6 aylık ara güncelleme (sadece gelişim planı kapsamındaki beceriler yeniden puanlanır). Yeni işe giren için işe başlangıçtan 90 gün sonra ilk değerlendirme.

**Değerlendirme durum makinesi:**

```
Açıldı → Öz-değerlendirme tamamlandı → Yönetici değerlendirmesi tamamlandı
      → Mutabakat görüşmesi → [Mutabık | İtiraz] → (İtiraz: Üst değerlendirme / İK hakemliği) → Kesinleşti → Kilitli
```

➕ **Kalibrasyon oturumu:** Departman müdürü + İK, servisler arası dağılımı karşılaştırır (bir yönetici herkese 4 vermiş mi?). Sistem bunun için "yönetici cömertlik endeksi" ve dağılım grafiği üretir.

### 4.4 Mutabakat ✅

Her beceri satırında: öz puan, yönetici puanı, **mutabık puan**, görüşme notu, kanıt, tarih, iki tarafın onay işareti. Fark ≥ 2 seviye ise görüşme zorunlu. İtirazda ❓ S4 nihai karar mercii belirlenmeli (önerim: üst yönetici kararı + İK gözlemci; komite sadece kritik rollerde).

Kayıt altına alınanlar: kim, ne zaman, hangi puanı, hangi gerekçeyle verdi; mutabakat metni; itiraz gerekçesi; nihai karar. Tam denetim izi.

### 4.5 Açık analizi ve gelişim planı (IDP)

**Açık** = Hedef seviye − Mutabık seviye (negatif açık = "fazlalık", mentor adayı).

**Öncelik puanı** = Açık × Rol içi ağırlık × Beceri kritikliği (1–3). Plan ilk 3–5 önceliğe odaklanır (kaynak dağılmasın).

**Plan satırı:** beceri, mevcut → hedef seviye, eylem tipi (70-20-10), eylem, sorumlu, mentor, bitiş tarihi, başarı kanıtı, durum, ilerleme %. ➕ Katalizör önerisi otomatik eklenir. ➕ Eğitim kataloğu ile eşleme: her eğitim "hangi beceri, hangi seviyeye götürür" etiketiyle tanımlanır.

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

➕ **Potansiyel** = katalizör yetkinlik ortalaması + liderlik yetkinlikleri (+ varsa performans verisi) → 9-kutu. ➕ **Kişi risk kaydı:** ayrılma riski, emeklilik tarihi, tek nokta bağımlılığı. ➕ **Yedek derinliği raporu:** her kritik rol için 0 / 1 / 2+ hazır yedek.

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

Gizlilik: kişi bazlı puanlar sadece hiyerarşi hattı + İK; akran/360 girdileri anonim; KVKK kapsamında saklama süresi ve açık rıza metni (❓ S10).

---

## 6. Yönetişim ve kalite kuralları

- Kütüphane değişiklikleri onaysız yayınlanmaz; her değişiklik sürüm notu ile.
- Değerlendirmede kanıt alanı zorunlu (seviye ≥ 4 için en az bir somut örnek).
- Kilitlenmiş döngü değiştirilemez; düzeltme yeni "düzeltme kaydı" ile.
- ➕ Beceri "bayatlama": 18 ayda yeniden değerlendirilmeyen seviye "doğrulanmalı" işaretlenir.
- ➕ Sertifika/lisans geçerlilik takibi (bitiş tarihi, hatırlatma).
- Tüm işlemler denetim günlüğünde (kim, ne, ne zaman, önce/sonra).

---

## 7. Uygulama modülleri (ekran haritası)

1. **Organizasyon** — departman/servis/rol/pozisyon/kişi; içe aktarma (Excel/HRIS).
2. **Yetkinlik Kütüphanesi** — teknik ve davranışsal; seviye çıpaları; katalizör bağları; sürüm; onay akışı.
3. **Rol Profilleri** — hedef seviyeler, ağırlıklar, kariyer yolları.
4. **Değerlendirme Döngüleri** — açma, takvim, öz/yönetici/360, kanıt, mutabakat, itiraz, kalibrasyon.
5. **Gelişim Planları** — açık, öncelik, eylem, mentor, eğitim kataloğu, ilerleme.
6. **Analitik** — ısı haritası, metrik panoları, trend, envanter araması, katalizör doğrulama.
7. **Kritik Rol & Yedekleme** — skorlama, aday havuzu, hazırlık, 9-kutu, risk kaydı, bilgi aktarım planı.
8. **İşe Alım** — iş tanımı, mülakat kılavuzu, aday puan kartı, build/buy.
9. **Yönetim** — kullanıcı/rol, bildirimler, ayarlar (eşikler, ağırlıklar), denetim günlüğü.

---

## 8. Yol haritası (öneri)

| Faz | İçerik | Çıktı |
|---|---|---|
| 0 | Yapı ve kararlar (bu dokümanlar) | Onaylı tasarım |
| 1 | Davranışsal sözlük seçimi + teknik beceri toplama (şablon + 1 saatlik çalıştay/servis) | Kütüphane v1.0 |
| 2 | Rol profilleri | Hedef seviyeler |
| 3 | Uygulama MVP: modül 1-2-3-4 (+ mutabakat) | Pilot 1–2 departman |
| 4 | Gelişim planı + analitik | Kurum haritası v1 |
| 5 | Kritik rol / yedekleme / işe alım | Risk ve yedek panoları |
| 6 | 2. döngü: katalizör doğrulama, ağırlık güncelleme | Kanıta dayalı model |

**Riskler ve önlemler:**
- Yöneticiler beceri listesini çok uzun/çok kısa verir → şablonda "servis başına 8–20 beceri" sınırı, İK standardizasyonu.
- Çıpalar yargı sözcüğüyle yazılır → kalite kontrol listesi (şablonda).
- Değerlendirme enflasyonu → kanıt zorunluluğu, kalibrasyon, seviye 4–5 doğrulaması, ilk yıl ücretle ayrık.
- Sistem "form doldurma" olarak algılanır → gelişim planı ve mentor eşleşmesi ilk döngüde görünür fayda olarak sunulur; yöneticilere servis haritası hemen geri verilir.

**Başarı ölçütleri (12 ay):** değerlendirme tamamlanma ≥ %90; mutabık kalınan satır oranı ≥ %85; her kritik rol için en az 1 adlandırılmış yedek; plan tamamlama ≥ %60; öz–yönetici farkı ≤ 0,5.
