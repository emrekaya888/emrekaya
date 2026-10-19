# 07 · Teknik Mimari (karar: kısıt yok, tüm sistem)

## 1. Yığın

| Katman | Seçim | Gerekçe |
|---|---|---|
| Uygulama | **TypeScript, Next.js (App Router)** — web + PWA | Tek kod tabanı; sunucu bileşenleri ile hızlı raporlar; PWA ile mobil (ana ekrana ekleme, bildirim, çevrimdışı kanıt taslağı) |
| Arayüz | React, Tailwind, erişilebilir bileşen kütüphanesi | Mobil öncelikli formlar (kanıt ekleme, 360) |
| API | Next.js route handlers + tRPC veya REST (OpenAPI) | HRIS/satış sistemleri için sonradan entegrasyon yüzeyi |
| Veritabanı | **PostgreSQL** + Prisma | İlişkisel model; sürümleme ve denetim izi için uygun; 6.400 kullanıcı için fazlasıyla yeterli |
| Kimlik | SSO (OIDC: Entra ID / Keycloak) + rol tabanlı yetki | Banka ortamında SSO beklenir; yoksa e-posta + şifre + MFA |
| Dosya | S3 uyumlu nesne depolama (MinIO kurum içi / bulut) | Kanıt dosyaları; imzalı URL ile erişim |
| İş kuyruğu | Postgres tabanlı kuyruk veya Redis | Toplu içe aktarma, 360 davetleri, bildirimler, seviye yeniden hesaplama |
| Raporlama | Materialized view + döngü anlık görüntüleri | Isı haritası ve kalibrasyon panoları hızlı açılır |
| Test | Vitest + Playwright | Seviye hesaplama kuralları birim testli, akışlar uçtan uca testli |

Barındırma: kurum içi Kubernetes/Docker veya bulut; banka olduğundan **kurum içi** varsayılır, konteyner imajı ile ikisine de taşınabilir.

## 2. Modül → kod yapısı

```
apps/web                 Next.js uygulaması (web + PWA)
packages/db              Prisma şeması, migration, seed
packages/domain          Saf iş kuralları: seviye hesaplama, öncelik, kritiklik, potansiyel, hazırlık
packages/import          CSV/Excel içe aktarma (organizasyon, kişi, KPI, lisans, devralınan değerlendirme)
packages/ui              Ortak bileşenler
```

`packages/domain` arayüzden bağımsızdır; her formül `02` ve `05` dokümanındaki tanımla birebir test edilir.

## 3. Yetkilendirme modeli

- Rol (Çalışan, Yönetici, Küratör, Fonksiyonel değerlendirici, Üst doğrulayıcı, 360 değerlendirici, İK iş ortağı, İK admin, Üst yönetim) × **kapsam** (org birimi alt ağacı).
- Örnek: Bölge segment yöneticisi = "Fonksiyonel değerlendirici" rolü, kapsam = bölge ağacı, beceri filtresi = segment becerileri.
- Her sorgu kapsam filtresiyle çalışır (satır düzeyi güvenlik).

## 4. Veri içe aktarma (HRIS öncesi)

| Dosya | Alanlar | Sıklık |
|---|---|---|
| Organizasyon | birim kodu, üst birim kodu, tür, ad, yönetici sicil, şube sınıfı | Başlangıç + aylık |
| Kişi/atama | sicil, ad, e-posta, pozisyon kodu, rol kodu, başlangıç | Aylık |
| KPI | sicil, dönem, KPI kodu, değer, hedef | Aylık |
| Lisans/yetki | sicil, lisans kodu, bitiş; yetki kodu, limit | Aylık |
| Devralınan davranışsal sonuçlar | sicil, dönem, yetkinlik kodu, puan | Bir kez |

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
| 3 | Rol profilleri, hedef matrisi, şube sınıfı istisnaları, kariyer yolları |
| 4 | Kanıt kasası (web + mobil), KPI/lisans otomatik kanıt |
| 5 | Değerlendirme döngüsü: öz-beyan, 360, doğrulama, fonksiyonel teyit, seviye 5, mutabakat, itiraz, potansiyel |
| 6 | Kalibrasyon panoları (şube/bölge/merkez), analitik ve ısı haritaları |
| 7 | Gelişim planı, mentor eşleştirme |
| 8 | Kritik rol/beceri, yedekleme, bilgi aktarım planı |
| 9 | İşe alım modülü |
| 10 | Pilot (2 bölge + 3 GM departmanı), düzeltmeler, tüm ağa açılış |
