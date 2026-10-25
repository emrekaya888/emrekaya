# Yetkinlik Yönetim Sistemi — v1 Gereksinimler ve Etap Planı

**Tarih:** 25.10.2026 · **Kapsam:** İK Grup Müdürlüğü (1 grup müdürlüğü, 5 müdürlük, ~13 ekip, ~55 kişi) · **Sürüm:** tek dosya HTML (tarayıcıda çalışır, kurulum yok)

Bu belge, 23–25 Ekim'de verilen kararların tek yerde toplanmış halidir. Uygulama sıfırdan, bu belgeye göre **etap etap** yeniden yazılacak; her etap sen deneyip "tamam" dedikten sonra bir sonrakine geçilecek. Eski tam sürüm `html/arsiv/` altında referans olarak kalır.

---

## 1. Temel kararlar (değişmeyecekler)

| # | Karar |
|---|---|
| K1 | **Tek dosya HTML.** Sunucu, Docker, kurulum yok. Veri tarayıcıda (localStorage) saklanır; JSON yedek alınır/yüklenir/birleştirilir. |
| K2 | **Kullanıcı hesapları.** Herkes kendi kullanıcı adı ve şifresiyle girer (ilk şifre = sicil no, ilk girişte değiştirir). İK admin tüm süreci görür ve istediği kişi olarak bakabilir. |
| K3 | **Üç rol, üç ayrı süreç.** İK admin / Müdür ve Grup müdürü / Çalışan. Menü ve Özet sayfası role göre farklıdır. |
| K4 | **Takvim ve döngü yok.** Değerlendirme süreklidir; kişi ve yönetici hazır olduğunda ilerler. İsterse İK "dönem kaydet" ile anlık görüntü alır. |
| K5 | **Seviye yalnız kanıtla gelir.** "Yaparım" değil "yaptım". Kimse puan vermez; seviye kanıtlanmış göstergelerden hesaplanır. |
| K6 | **Ücret ve terfiden ayrık.** Amaç gelişim planıdır. |
| K7 | **Kütüphane boş başlar.** Örnek yetkinlik yok; her şeyi İK ve müdürler sıfırdan tanımlar. Örnek veri yalnız birim, rol, kişi ve hesaptır. |

## 2. Roller: kim ne yapar

### İK admin
- Kurulum: birimler (grup müdürlüğü → müdürlük → servis), roller (kademeli), kişiler (tek tek veya CSV), kullanıcı hesapları, yetkinlik türleri ve alt türleri, ayarlar.
- **Davranışsal yetkinlikleri ve göstergelerini tanımlar** (yalnız İK).
- **Teknik becerileri onaylar** (müdürlerden gelenleri inceler; onaylar ya da notla geri gönderir). Gerekirse doğrudan da tanımlayabilir.
- Rol profillerini tanımlar (rol × yetkinlik × hedef seviye × ağırlık).
- Süreç takibi (kim ne yaptı), raporlar, dönem kaydı, yedek.

### Müdür ve Grup müdürü
- Davranışsal yetkinlikleri ve rol profillerini **salt okunur** görür.
- **Kendi müdürlüğünün teknik becerilerini tanımlar** ve İK onayına gönderir (süreç başlatma beklemez; sayfa her zaman açık).
- Ekibinin kanıtlarını karara bağlar (kabul / ek bilgi / red, gerekçeli); gözlem notu ekler.
- Ekibinin yetkinlik taleplerini onaylar (çalışanlar için açıksa).
- Her kişi için **yönetici değerlendirmesi** yazar (yetkinlik başına görüş + gerekçe), doğrulamayı tamamlar, görüşme yapar, mutabık seviyeyi gönderir.
- Gelişim planını onaylar.
- Grup müdürü ayrıca: seviye 5 onayı, itiraz kararı, kalibrasyon oturumu.
- Müdürler **ek yetkinlik seçmez** ("Yetkinliklerim" sayfası yok); kendi rol profilini Kanıt kasam'da görür. Müdürler de kendi yöneticisi tarafından değerlendirilir (grup müdürünü İK değerlendirir).

### Çalışan
- Rol profilini görür; (ayar açıksa) kütüphaneden ek yetkinlik seçip gerekçesiyle onaya gönderir.
- Kanıt yazar: ne yaptı, ne zaman, çıktı, doğrulayıcı; hangi göstergeleri karşıladığını işaretler.
- Hazır olunca öz-beyanı tamamlar; mutabakatı onaylar ya da gerekçeli itiraz eder.
- Gelişim planını yazar.

## 3. Yetkinlik modeli (sade)

- **İki tür:** Davranışsal yetkinlik (herkes için ortak) ve Teknik beceri (müdürlük başına 8–12). Kütüphane bu ikisi için **ayrı sayfalardır**.
- **Tür adı ve alt türler** Kurulum'dan yönetilir (ekle, düzenle, sil). Davranışsalda "yalnız yönetici" işaretli alt türler yalnız yönetici rollerine uygulanır.
- **Kod otomatik:** önek-kısaltma-sıra (örn. D-C-001; teknikte müdürlük kısaltması, T-IA-001).
- **Kritiklik yok.**
- **Alanlar:** ad, tanım (tek cümle), sınır (isteğe bağlı), alt tür, 5 seviye.
- **Seviye:** 1 Başlangıç · 2 Uygulayıcı · 3 Yetkin Uygulayıcı · 4 Yöneten · 5 Yön Veren (davranışsalda: Gelişmekte · Uygular · Güçlü · Rol model · Kültür taşıyıcı). Her seviyede isteğe bağlı **çıpa** (tek cümle tarif).
- **Gösterge:** her seviyede **1–3** gösterge, **tek cümle**, geçmiş zamanda, yapılmış iş. Zorunlu işareti, süre, kanıt türü **yok**. Gösterge örnek değil **ölçüttür**; parantezde örnek verilebilir.
- **Kalite kontrol:** "yapabilir / bilir" → hata; yargı sözcüğü (iyi, etkili) → uyarı; geçmiş zaman değilse → uyarı; 15 karakterden kısa → hata.
- **Aktifleştirme şartı:** ad, tanım, her seviyede ≥1 gösterge, ifade hatası yok. Eksikler ekranda madde madde yazılır; düğme hiç kilitlenmez, tıklayınca eksik söylenir. Tamamlanınca onay penceresi çıkar.
- **Durumlar:** Taslak → İK onayında (yalnız teknik, müdürden gelen) → Aktif → Arşiv. Geri gönderilen teknik beceri notla Taslak'a döner.

## 4. Kurallar

| Kural | Değer |
|---|---|
| Seviye hesabı | Bir seviyenin göstergelerinin **en az yarısı** kabul edilmiş kanıtla karşılanınca o seviye verilir (3'te 2, 1'de 1). Alt seviyeler zinciri korunur. |
| Seviye 5 | Ek olarak grup müdürü onayı gerekir; onaysız en fazla 4. |
| Kanıt süresi | Sınır yok. |
| Görüşme zorunlu | \|öz-beyan − kanıtlanmış\| ≥ 2 veya \|yönetici görüşü − kanıtlanmış\| ≥ 2. |
| Mutabık seviye | Kanıtlanmışı aşamaz. Yönetici görüşü kanıtın üstündeyse gözlem notuyla kanıta dönüştürülür. |
| İtiraz | Satır bazında, gerekçeli (≥10 karakter); grup müdürü kanıt üzerinden karar verir (korundu / değişti). |
| Rol profili | Kişi başı en fazla 30 satır; ağırlık 1–3; "zorunlu" rol profilinde kalır (yetkinlik için zorunluluk, göstergede değil). |
| Öncelik puanı | (hedef − mutabık) × ağırlık. İlk 3 öncelik → gelişim eylemi. |
| Kanıt kaydı | Açıklama ≥25 karakter, tarih zorunlu, ≥1 gösterge; "yaparım" ifadesi engellenir. Ek bilgi/red gerekçe ister. |
| Ek yetkinlik seçimi | Ayar: yalnız çalışanlar (varsayılan) / herkes / kapalı. |

## 5. Değerlendirme akışı (sürekli)

1. **Kanıt** (sürekli): çalışan yazar, yönetici karara bağlar; gözlem notu otomatik kabul.
2. **Öz-beyan:** çalışan "tamamla" der; iddiası sunulan kanıtlardan hesaplanır.
3. **Yönetici değerlendirmesi:** yetkinlik başına görüş + gerekçe; bekleyen kanıt kalmayınca "doğrulamayı tamamla". Seviye 5 iddiası grup müdürüne düşer.
4. **Mutabakat:** görüşme (gerekirse zorunlu), mutabık seviye, çalışan onayı veya itiraz; itirazı grup müdürü karara bağlar → kesinleşir.
5. **Gelişim planı:** ilk 3 öncelik, eksik gösterge = eylem; yönetici onaylar.
6. **Yeni tur:** yeni kanıt birikince çalışan ya da yönetici başlatır; önceki tur geçmişte kalır.

## 6. Ekranlar (menü) — role göre

| Sayfa | İK | Müdür / GM | Çalışan |
|---|---|---|---|
| Özet (sıradaki adım + süreç adımları) | kurum aşamaları | kendi + ekip süreci | kendi süreci |
| Öğrenme rehberi | ✓ | ✓ | ✓ |
| Kurulum (birim, rol, kişi, tür, kullanıcı, ayar) | ✓ | – | – |
| Davranışsal yetkinlikler | tanımlar | salt okunur | – |
| Teknik beceriler | onaylar / tanımlar | salt okunur (tanımlılar) | – |
| Rol profilleri | tanımlar | salt okunur | – |
| Teknik beceri tanımlama (müdürlüğüm) | – | ✓ | – |
| Yetkinliklerim | – | – | ✓ (ayar açıksa) |
| Kanıt kasam | – | ✓ | ✓ |
| Değerlendirmem | – | ✓ | ✓ |
| Ekibimin kanıtları / talepleri / değerlendirmeleri | tüm ekipler | ✓ | – |
| Üst doğrulama / itiraz | ✓ | GM | – |
| Gelişim planları | tümü | kendi + ekip | kendi |
| Raporlar (ısı haritası, dağılım, cömertlik, bayraklar, öğrenim ölçütleri, dönem kaydı) | ✓ | ✓ | – |
| Süreç takibi (kim ne yaptı, yönetici iş yükü, denetim izi) | ✓ | – | – |
| Yedek ve veri | ✓ | ✓ | ✓ |

**Her sayfada** 📘 "bu sayfada ne yapılır, nasıl yazılır" kutusu ve doğru/yanlış örnekler bulunur.

## 7. Ekran kullanım kuralları (son geri bildirimden)

- Tıklamada sayfa başa dönmez; yeni gösterge eklenince imleç oraya gider.
- Yazılanlar 0,5 saniye içinde otomatik kaydedilir; "Kaydet" ek güvencedir.
- Engelleyen düğme yerine **eksik listesi**; tamamlanınca **onay penceresi**.
- Aynı bilgi iki kutuda tekrarlanmaz.

## 8. Etap planı

Her etap: bir yayın (aynı link), senin denemen, "tamam" ya da düzeltme. Bir sonraki etaba geçilmeden önceki etap değişmez.

| Etap | İçerik | Senin kontrol edeceğin |
|---|---|---|
| **0 · Çekirdek** | Giriş ekranı, hesaplar, role göre boş menü iskeleti, Özet taslağı, Yedek ve veri (dışa/içe aktarma, birleştirme, sıfırlama). Örnek veri: 1 grup müdürlüğü, 2 müdürlük, 6 kişi, hesaplar. | Giriş yapabiliyor muyum, admin olarak başka kişi gibi bakabiliyor muyum, yedek alıp geri yükleyebiliyor muyum. |
| **1 · Kurulum** | Birim ağacı, roller, kişiler (tek tek + CSV), kullanıcı hesapları (toplu açma, şifre sıfırlama), yetkinlik türleri/alt türleri, ayarlar. | 5 müdürlüğü ve kişileri girebiliyor muyum; alt tür ekleyip silebiliyor muyum. |
| **2 · Davranışsal yetkinlikler** | İK editörü: ad, tanım, sınır, alt tür, 5 seviye × 1–3 gösterge, çıpa; kalite kontrol; eksik listesi; aktifleştirme + onay penceresi; liste sayfası. Müdürlerde salt okunur görünüm. | Bir yetkinliği baştan sona yazıp aktifleştirebiliyor muyum; sayfa başa dönüyor mu; eksikler anlaşılır mı. |
| **3 · Teknik beceriler** | Müdür "Teknik beceri tanımlama" sayfası (aynı editör + önerilen rol hedefleri), İK onayına gönderme; İK "onay bekleyen" listesi, onay / notla geri gönderme; müdürlük bazında durum tablosu. | Müdür olarak beceri yazıp gönderebiliyor muyum; İK olarak onaylayıp geri gönderebiliyor muyum. |
| **4 · Rol profilleri ve Yetkinliklerim** | İK rol profili (davranışsalları tüm rollere uygula, teknik ekle, hedef/ağırlık/zorunlu, uyarılar); onaylanan teknik becerinin önerilen rollere işlenmesi; çalışan Yetkinliklerim (rol profili + ayar açıksa ek seçim + yönetici onayı). | Her rolün profili tamam mı; çalışan kendi profilini görüyor mu. |
| **5 · Kanıt** | Kanıt kasam (form, gösterge seçici, taslak/sun), Ekibimin kanıtları (kabul/ek bilgi/red, gözlem notu), kanıtlanmış seviye hesabı ve "sonraki seviyeye" göstergesi. | Çalışan olarak kanıt yazıp yönetici olarak karara bağlayabiliyor muyum; seviye doğru hesaplanıyor mu. |
| **6 · Değerlendirme** | Değerlendirmem (öz-beyan, mutabakat yanıtı, itiraz, yeni tur), Ekibimin değerlendirmeleri (yönetici görüşü + gerekçe, doğrulama, görüşme notu, mutabakat gönderme), Üst doğrulama / itiraz (S5, itiraz kararı). | Uçtan uca bir kişiyi kesinleştirebiliyor muyum; itiraz akışı çalışıyor mu. |
| **7 · Gelişim planı** | Öncelik listesi, eksik göstergeler, mentor önerisi, eylem (tür, çıktı, tarih), durum, yönetici onayı. | Plan yazıp onaylayabiliyor muyum. |
| **8 · Raporlar ve takip** | Raporlar (tamamlanma, ısı haritası, dağılım/bus factor, cömertlik ve görüş−kanıt, bayraklar, 9 öğrenim ölçütü, dönem kaydı), Süreç takibi, Özet'teki kurum aşamaları ve kişisel süreç adımlarının tamamlanması, Öğrenme rehberi (A'dan Z'ye). | Raporlar anlamlı mı; kimin takıldığını görebiliyor muyum. |

Her etabın sonunda: uçtan uca test çalıştırılır, aynı artifact linki güncellenir, `html/yys.html` dala gönderilir.

## 9. Henüz karar verilmemiş sorular

| # | Soru | Varsayılan (karar gelene kadar) |
|---|---|---|
| A1 | Rol profillerini yalnız İK mi yazar, müdürler öneri verebilir mi? | Yalnız İK yazar; teknik beceride müdürün "önerilen rol" alanı vardır. |
| A2 | Davranışsalda kaç yetkinlik hedefleniyor? | 8–10 çekirdek + 4–5 yönetici. |
| A3 | Grup müdürünü kim değerlendirir? | İK admin. |
| A4 | Seviye adları (teknik/davranışsal) böyle kalsın mı? | Evet. |
| A5 | Kanıt türü (iş çıktısı, gözlem notu…) kanıt kaydında kalsın mı? | Kalsın (yalnız kanıt kaydında; göstergede yok). |
| A6 | Dönem kaydı (anlık görüntü) gerekli mi? | Etap 8'de, isteğe bağlı. |

---

**Bir sonraki adım:** Bu belge onaylanınca uygulama sıfırlanır ve **Etap 0** yazılır. Etap 0 yayımlanır, sen denersin, "tamam" dersin, Etap 1'e geçilir.
