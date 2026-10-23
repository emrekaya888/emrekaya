# 07 · Teknik Mimari (karar: kısıt yok, tüm sistem)

## 1. Yığın

| Katman | Seçim | Gerekçe |
|---|---|---|
| Uygulama | **TypeScript, Next.js (App Router)** — web + PWA | Tek kod tabanı; sunucu bileşenleri ile hızlı raporlar; PWA ile mobil (ana ekrana ekleme, bildirim, çevrimdışı kanıt taslağı) |
| Arayüz | React, Tailwind, erişilebilir bileşen kütüphanesi | Mobil öncelikli formlar (kanıt ekleme, 360) |
| API | Next.js sunucu eylemleri (server actions) + gerekirse REST (OpenAPI) | HRIS/satış sistemleri için sonradan entegrasyon yüzeyi |
| Veritabanı | **PostgreSQL** + Drizzle ORM (tip güvenli şema, SQL'e yakın; Prisma yerine tercih edildi, bkz. not) | İlişkisel model; sürümleme ve denetim izi için uygun; 6.400 kullanıcı için fazlasıyla yeterli |
| Kimlik | SSO (OIDC: Entra ID / Keycloak) + rol tabanlı yetki | Banka ortamında SSO beklenir; yoksa e-posta + şifre + MFA |
| Dosya | S3 uyumlu nesne depolama (MinIO kurum içi / bulut) | Kanıt dosyaları; imzalı URL ile erişim |
| İş kuyruğu | Postgres tabanlı kuyruk veya Redis | Toplu içe aktarma, 360 davetleri, bildirimler, seviye yeniden hesaplama |
| Raporlama | Materialized view + döngü anlık görüntüleri | Isı haritası ve kalibrasyon panoları hızlı açılır |
| Test | Vitest + Playwright | Seviye hesaplama kuralları birim testli, akışlar uçtan uca testli |

Barındırma: kurum içi Kubernetes/Docker veya bulut; banka olduğundan **kurum içi** varsayılır, konteyner imajı ile ikisine de taşınabilir.

## 2. Modül → kod yapısı

```
app/                      Next.js uygulaması (web + PWA)
  src/db/                 Drizzle şeması, bağlantı, Türkçe etiketler
  src/domain/             Saf iş kuralları: seviye hesaplama, öncelik, kritiklik, potansiyel, hazırlık, yük (birim testli)
  src/import/             CSV ayrıştırma, doğrulama, uygulama (organizasyon, rol, pozisyon, kişi; sonra KPI, lisans, devralınan)
  src/lib/                Oturum, kimlik doğrulama, yetki kapsamı
  src/app/(auth)/giris    Giriş
  src/app/(app)/          Uygulama ekranları (özet, organizasyon, kişiler, roller, içe aktarma …)
  scripts/seed.ts         Geliştirme tohumu
  drizzle/                Migration dosyaları
```

`src/domain` arayüzden ve veritabanından bağımsızdır; her formül `02` ve `05` dokümanındaki tanımla birebir test edilir (Vitest). Tek uygulama, klasör ayrımı; ileride paketlere bölünebilir.

**Uygulama notu (Sprint 1, 23.10.2026):** ORM olarak Drizzle seçildi (Prisma 8 henüz ön sürümde; Drizzle SQL'e yakın, migration ve tip güvenliği yeterli). Kimlik doğrulama ilk sürümde e-posta + şifre (bcrypt, iron-session çerezi); SSO (OIDC) kurum kararıyla eklenecek.

## 3. Yetkilendirme modeli

- Rol (Çalışan, Yönetici, Küratör, Alan uzmanı, Üst doğrulayıcı, 360 değerlendirici, İK iş ortağı, İK admin, Üst yönetim) × **kapsam** (org birimi alt ağacı).
- Örnek: Bölge İK iş ortağı = "İK iş ortağı" rolü, kapsam = bölge ağacı; Alan uzmanı = kapsam tüm ağ, beceri filtresi = segment becerileri, yalnızca seviye 5 kayıtları.
- Her sorgu kapsam filtresiyle çalışır (satır düzeyi güvenlik).

## 4. Veri içe aktarma (HRIS öncesi)

| Dosya | Alanlar | Sıklık |
|---|---|---|
| Organizasyon | birim kodu, üst birim kodu, tür, ad, yönetici sicil, şube sınıfı (Özel/KOBİ/Ticari/Kurumsal), segment | Başlangıç + aylık |
| İK iş ortağı / alan uzmanı | bölge kodu, sicil; segment, sicil | Başlangıç + değişince |
| Kişi/atama | sicil, ad, e-posta, pozisyon kodu, rol kodu, başlangıç | Aylık |
| KPI | sicil, dönem, KPI kodu, değer, hedef | Aylık |
| Lisans/yetki | sicil, lisans kodu, bitiş; yetki kodu, limit | Aylık |
| Devralınan davranışsal sonuçlar | sicil, dönem, eski yetkinlik kodu, puan (İyi olabilirsin / İyisin / Çok iyisin) | Bir kez; eşleme tablosuyla 2/3/4'e dönüştürülür |

Her içe aktarma doğrulama raporu üretir (eşleşmeyen kod, eksik üst birim, mükerrer sicil); hatalı satırlar işlenmez.

## 5. Güvenlik ve uyum

- KVKK: kişisel veri envanteri, saklama süresi (S10: 5 yıl), çalışanın kendi verisini dışa aktarması, silme talebi akışı.
- Denetim izi değiştirilemez (append-only tablo).
- Kanıt dosyaları şifreli depolama, erişim loglu.
- 360 anonimliği: değerlendirici kimliği ayrı tabloda, raporlara yalnızca toplulaştırılmış veri gider.

## 6. Teslim planı (tüm sistem)

| Sprint bloğu | Teslim |
|---|---|
| 1 | Organizasyon ağacı, kişi, roller/yetki, içe aktarma, SSO |
| 2 | Yetkinlik kütüphanesi: beceri, seviye, gösterge, kanıt türü, katalizör, sürüm; Beceri Toplama Portalı |
| 3 | Rol profilleri, hedef matrisi, şube sınıfı istisnaları, kariyer yolları, rol–lisans matrisi (E8), Delphi uzlaşı aracı (E2) |
| 4 | Kanıt kasası (web + mobil), KPI/lisans otomatik kanıt |
| 5 | Değerlendirme döngüsü: öz-beyan, 360 (+ danışma sorusu, E3), doğrulama, seviye 5 uzman onayı, mutabakat, itiraz, potansiyel |
| 6 | Kalibrasyon panoları (şube/bölge/merkez), analitik ve ısı haritaları, ölçüm kalitesi panosu (E10), yönetici yük panosu (E4) |
| 7 | Gelişim planı, mentor eşleştirme, beceri komşuluğu ve "en yakın roller" (E1) |
| 8 | Kritik rol/beceri, yedekleme, bilgi aktarım planı |
| 9 | İşe alım modülü |
| Faz 2 | Gelişim görevleri pazarı (E7), stratejik beceri planı görünümü (E6), değerlendirme merkezi kanıt türü (E9), tam ölçüm kalitesi panosu |
| 10 | Prova döngüsü (test ortamında 2 bölge gerçek verisi, uçtan uca), yönetici ve İK iş ortağı eğitimi, düzeltmeler, tüm ağa açılış (3 dalga, tek döngü) |
