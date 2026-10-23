# 13 · Sade Sürüm (v0) — İK Grup Müdürlüğü ile Başlangıç

> Karar (23.10.2026): Tüm kurum yerine **önce İnsan Kaynakları Grup Müdürlüğü'nün 5 müdürlüğü** için daha sade bir sistem kurulur; buradaki revizyon ve öğrenimlerle sistem genişletilir. 01–12 numaralı dokümanlar **hedef tasarım** olarak kalır; bu doküman, hedefe giden ilk basamağın kapsamını tanımlar. Çelişki olursa v0 için bu doküman geçerlidir.

---

## 1. Neden bu yol doğru

- Yöntem (gösterge + kanıt + mutabakat) gerçek kullanıcıda denenmeden 6.400 kişiye açılmamalı; en ucuz öğrenme yeri İK'nın kendisidir.
- İK ekibi sistemi "kullanan" değil "yaşamış" olarak sahaya çıkar; eğitim vakaları ve SSS gerçek olur.
- Sade sürüm, hedef tasarımın küçültülmüşü olduğu için atılan hiçbir şey boşa gitmez; genişleme "yeniden yazma" değil "kapsamı açma"dır.

## 2. Kapsam: ne var, ne yok

| Alan | v0'da VAR | v0'da YOK (hedef tasarımda var, sonra) |
|---|---|---|
| Kim | İK Grup Müdürlüğü: 5 müdürlük, tüm kademeler, grup müdürü | Diğer GM departmanları, şube ağı |
| Yetkinlik aileleri | Davranışsal: 8–10 çekirdek + 4–5 liderlik · Teknik: müdürlük başına 8–12 beceri | Şube teknik katmanları, ortak havuz yönetimi (basit tutulur) |
| Seviye ölçeği | 5 seviye, aynı tanımlar (01 §2.2) | — |
| Göstergeler | Seviye başına **3** gösterge (1'i zorunlu) | 3–5 esnekliği, otomatik kanıt kuralları, potansiyel göstergeleri |
| Kanıt | "Yaptım" formu, dosya/bağlantı, yönetici gözlem notu, sertifika; 24 ay geçerlilik | KPI/lisans/yetki otomatik kanıt, denetim bulgusu entegrasyonu |
| Değerlendirme | Öz-beyan → yönetici doğrulaması → (seviye 5: grup müdürü onayı) → mutabakat → itiraz | 360, alan uzmanı, fonksiyonel teyit, potansiyel değerlendirmesi |
| Kalibrasyon | Tek oturum: grup müdürü + 5 müdür + yetkinlik ekibi; sistem dağılım ve cömertlik endeksini gösterir | Üç kademe, KPI–seviye bayrağı, gizli uzman, Delphi |
| Rol profilleri | Rol başına hedef seviye ve ağırlık; kademe +1 kuralı | Şube sınıfı istisnaları, lisans matrisi, beceri komşuluğu |
| Gelişim | Kişi başı 3 öncelik, eksik gösterge = eylem, mentor önerisi (seviye ≥ 4) | Gelişim görevleri pazarı, eğitim kataloğu, kariyer yolu motoru |
| Raporlar | Müdürlük × beceri ısı haritası, hedef karşılama, bus factor (seviye ≥ 3 kişi sayısı), tamamlanma, öz–kanıtlanmış farkı, cömertlik | Kritik rol skoru, yedekleme, işe alım, potansiyel dağılımı, ölçüm kalitesi panosu (temel metrikler hariç) |
| Entegrasyon | CSV içe aktarma (organizasyon, rol, pozisyon, kişi) — hazır | HRIS, KPI, lisans beslemeleri |
| Kimlik | E-posta + şifre (iron-session) | SSO |
| Mobil | Responsive web | PWA bildirim, çevrimdışı |

**Değişmeyen ilkeler:** Kanıtsız seviye yok; mutabık seviye kanıtlanmış seviyeyi aşamaz; sayı seçilmez, gösterge işaretlenir; ücret/terfiden ayrık; kalibrasyon seviye yükseltmez.

## 3. Kütüphane kurulumu — sadeleştirilmiş yöntem

| Adım | Nasıl (v0) | Süre |
|---|---|---|
| Davranışsal seçim | 04 aday sözlüğünden İK yetkinlik ekibi + 5 müdür 2 saatlik kart sıralama; kritik olay görüşmesi yerine her müdürden 2 "iyi/kötü giden olay" yazılı örneği | 1 hafta |
| Teknik tespit | Her müdürlükte 60 dk çalıştay (şablon §3); müdürlük başına 8–12 beceri | 1 hafta (5 çalıştay) |
| Gösterge yazımı | Seviye başına 3 gösterge; kalite kontrol listesi (12 §1.6); geri eşleme testi 3 kişiyle (ekip içi) | 1 hafta |
| Rol profilleri | Müdürlük rolleri (uzman yardımcısı → uzman → kıdemli → yönetmen → müdür gibi): hedef seviye, ağırlık | 3 gün |
| Onay | Grup müdürü tek imza; v0.1 Aktif | — |

Örnek teknik beceriler (müdürlüğe göre değişir): İşe Alım ve Seçme Değerlendirme; Ücret ve Yan Haklar Tasarımı; Performans Sistemi Yönetimi; Eğitim Tasarımı ve Ölçümü; İK Analitiği ve Raporlama; Özlük ve İş Hukuku Uygulaması; Bordro Süreçleri; Çalışan İlişkileri ve Disiplin; Yetenek ve Yedekleme Planlama; İK Sistemleri (HRIS) Kullanımı.

## 4. Değerlendirme döngüsü — sadeleştirilmiş akış

```
Açılış → Öz-beyan + kanıt (2 hafta) → Yönetici doğrulaması (2 hafta) → Seviye 5 grup müdürü onayı (3 gün)
      → Mutabakat görüşmesi (1 hafta) → İtiraz (grup müdürü; 1 hafta) → Kalibrasyon oturumu (yarım gün) → Kilit
```

- Fark ≥ 2 veya reddedilmiş zorunlu kanıt → görüşme zorunlu (kural korunur).
- İtiraz mercii: grup müdürü; grup müdürünün kendi ekibi için İK'dan sorumlu GMY.
- Grup müdürü ve müdürler de değerlendirilir (liderlik yetkinlikleri dahil); üst değerlendirici İK GMY.

## 5. Uygulama modülleri (v0) ve sprintler

| Sprint | Teslim | Durum |
|---|---|---|
| 1 | Organizasyon, kişi, rol/pozisyon, yetki, CSV içe aktarma, giriş; **Kurulum sayfası** (elle ekleme/çıkarma, giriş hesapları) | **Tamamlandı** (23.10) |
| 2 | Yetkinlik kütüphanesi: yetkinlik, seviye, gösterge, kanıt türü; sürüm/durum; kütüphane ekranları; gösterge kalite kontrolü | **Tamamlandı** (23.10) |
| 3 | Rol profilleri (hedef seviye, ağırlık, zorunlu); otomatik çekirdek/liderlik bağlama; alt kademeden +1 kopyalama; tutarsızlık uyarıları; kişi başı satır listesi | **Tamamlandı** (23.10) |
| 4 | Kanıt kasası: "yaptım" formu, dosya/bağlantı, gözlem notu, gösterge eşleme, geçerlilik; şifre değiştirme | Sırada |
| 5 | Değerlendirme döngüsü: açma, öz-beyan, yönetici doğrulaması (toplu ekran), seviye 5 onayı, mutabakat, itiraz, kilit | |
| 6 | Raporlar: ısı haritası, tamamlanma, öz–kanıtlanmış farkı, cömertlik, bus factor; gelişim planı (3 öncelik); kalibrasyon özet ekranı | |

Kullanıcı rolleri (v0): Çalışan · Yönetici (müdür) · Üst yönetici (grup müdürü) · İK admin (yetkinlik ekibi). Diğer roller şemada durur, ekranda kullanılmaz.

## 6. Takvim (öneri, 8 hafta + 1 döngü)

| Hafta | İş |
|---|---|
| 1–2 (27 Ekim–7 Kasım) | Davranışsal seçim + 5 teknik çalıştay; sprint 2 |
| 3 (10–14 Kasım) | Gösterge yazımı ve geri eşleme; sprint 3 |
| 4 (17–21 Kasım) | Rol profilleri; kütüphane v0.1 Aktif; sprint 4 |
| 5–6 (24 Kasım–5 Aralık) | Sprint 5; kanıt kasası açılır, herkes kanıt biriktirir; 30 dk tanıtım |
| 7–8 (8–19 Aralık) | Döngü: öz-beyan ve yönetici doğrulaması |
| Ocak (5–23 Ocak) | Mutabakat, itiraz, kalibrasyon oturumu, kilit; sprint 6 raporlar |
| Ocak sonu | Öğrenim raporu ve genişleme kararı |

Takvim gevşek tutuldu; Ocak "tüm kurum açılışı" artık bir taahhüt değildir, genişleme kararı öğrenim raporuna bağlıdır.

## 7. Ne öğreneceğiz: ölçütler ve karar kriterleri

| Öğrenim sorusu | Ölçüt | Hedef |
|---|---|---|
| Göstergeler anlaşılıyor mu? | Geri eşleme uzlaşısı; "anlaşılır" anketi | ≥ %80; ≥ 4/5 |
| Kanıt toplama yükü taşınabilir mi? | Kişi başı kanıt ekleme süresi; kanıt sayısı/gösterge | ≤ 15 dk/hafta; ≥ 1 |
| Kanıt kalitesi nasıl? | Kabul / ek bilgi / red oranları | Red ≤ %25, ikinci turda ≤ %10 |
| Yönetici yükü ne kadar? | Müdür başına doğrulama süresi | ≤ 4 saat/döngü |
| Seviye dağılımı makul mu? | Beceri bazında dağılım | Tek seviyede > %60 yığılma yok |
| Öz-beyan şişiyor mu? | Öz-beyan − kanıtlanmış farkı | ≤ 0,5 |
| Mutabakat çalışıyor mu? | Mutabık satır oranı; itiraz oranı | ≥ %85; ≤ %10 |
| Süreç adil algılanıyor mu? | Adalet anketi (10 §4.9) | ≥ 3,8 |
| Sistem kullanılabilir mi? | Görev tamamlama, yardım talebi sayısı | — |

**Genişleme kriteri:** Yukarıdaki hedeflerin en az 7/9'u sağlanır ve revizyon listesi uygulanırsa bir sonraki halka açılır: önerilen sıra (1) 3–5 GM departmanı, (2) 1 bölge, (3) tüm şube ağı, (4) tüm GM. Her halkada aynı öğrenim ölçütleri tekrar ölçülür.

## 8. v0'da değişen kararlar (karar kaydına işlendi)

- S30 (pilot yok, tek seferde) → yerini S39 aldı: **İK Grup Müdürlüğü ile sade başlangıç, halkalar halinde genişleme.**
- S33 (Ocak tüm kurum açılışı) → Ocak, İK v0 döngüsünün kapanış ayıdır; kurum geneli takvimi genişleme kararıyla belirlenir.
- S3 (360) ve S11 (potansiyel) → v0'da uygulanmaz; hedef tasarımda korunur.
