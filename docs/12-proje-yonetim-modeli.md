# 12 · Proje Yönetim Modeli ve Uygulama Kılavuzu

> Bu doküman, Yetkinlik Yönetim Sistemi'ni kuracak **uygulayıcı ekip** için yazılmış bir iş planı ve kullanım kılavuzudur. Tasarım dokümanları (01–10) "ne" ve "neden"i anlatır; bu doküman "kim, hangi sırayla, nasıl, nelere dikkat ederek" sorusuna cevap verir. Her iş paketi aynı iskeletle yazıldı: amaç, roller, adımlar, her adımda **yapılması gerekenler**, **kaçınılması gerekenler**, **örnek**, çıkış kriteri (kalite kapısı), şablon ve riskler.
>
> Önce iki sayfalık **Yönetici Özeti**, sonra uygulayıcılar için ayrıntılı iş paketleri gelir. Yetkinlik mimarisi iş paketi (İP1) kasıtlı olarak en uzun bölümdür; projenin kalitesi orada belirlenir.

---

# A. Yönetici Özeti

## A.1 Ne kuruyoruz?

6.400 çalışan, 600 yönetici, 100+ Genel Müdürlük departmanı ve 15 bölge / 450 şubeyi kapsayan; teknik beceri ve davranışsal yetkinlikleri **kanıta dayalı** ölçen, mutabakatla kesinleştiren, gelişim planına, kritik rol/yetkinlik analizine, yedeklemeye ve işe alıma bağlayan bir yetkinlik yönetim sistemi. İlk değerlendirme döngüsü **Ocak 2027**'de açılır.

## A.2 Proje modeli tek bakışta

| İş paketi | Ne üretir | Sahip | Kabaca süre | Ocak için şart mı |
|---|---|---|---|---|
| İP0 Proje kurulumu ve yönetişim | Sponsor, yönlendirme kurulu, çekirdek ekip, RACI, risk kaydı, iletişim planı | Proje lideri | 1 hafta | Evet |
| İP1 Yetkinlik mimarisi | Davranışsal sözlük (8–12 + 5–7), şube teknik kütüphanesi, GM teknik kütüphanesi (1. dalga), seviye ölçeği, göstergeler, kanıt kuralları, katalizör bağları | İK yetkinlik ekibi | 6–7 hafta | Evet |
| İP2 Rol profilleri | Her rol için hedef seviye, ağırlık, zorunluluk, lisans gereği, şube sınıfı istisnaları, kariyer yolları | İK + yöneticiler | 3 hafta (İP1 ile örtüşür) | Evet |
| İP3 Veri hazırlığı | Temiz organizasyon/kişi verisi, KPI, lisans, yetki, devralınan davranışsal sonuçlar | İK sistemleri + BT | 3 hafta | Evet |
| İP4 Sistem kurulumu | Konfigürasyon, yetkiler, içe aktarma, prova döngüsü | BT / geliştirme | Sprint 1–5 (8 hafta) | Evet |
| İP5 Döngü işletimi | Öz-beyan, 360, doğrulama, seviye 5 onayı, mutabakat, itiraz | İK iş ortakları + yöneticiler | 13 hafta / dalga | Ocak–Nisan |
| İP6 Kalibrasyon ve potansiyel | Üç kademeli kalibrasyon kararları, potansiyel kayıtları | Bölge/departman + İK | 3 hafta | Mart–Nisan |
| İP7 Gelişim planları | Kişi başı 3–5 öncelikli plan, mentor eşleşmeleri | Yöneticiler + çalışanlar | 4 hafta | Mayıs |
| İP8 Analitik, kritik rol, yedekleme, işe alım | Haritalar, kritik liste, yedek havuzları, mülakat kılavuzları | İK + GMY'ler | 6 hafta | Mayıs–Haziran |
| İP9 Değişim, eğitim, iletişim (yatay) | Duyurular, eğitimler, SSS, yardım masası, adalet anketi | İletişim + İK | Sürekli | Evet |
| İP10 Kapanış ve sürekli iyileştirme | Döngü raporu, revizyon listesi, 2. döngü kararları | Proje lideri | 3 hafta | Haziran |

## A.3 Beş kritik başarı faktörü

1. **Sponsorluk görünür olmalı.** Genel Müdür imzalı açılış duyurusu ve yönlendirme kurulunda segment GMY'leri. Olmazsa 100+ departman müdürü beceri toplamaya zaman ayırmaz.
2. **Kütüphane kalitesi her şeyi belirler.** Kötü yazılmış bir gösterge, 6.400 kişide yanlış ölçüm demektir. İP1'deki kalite kapıları pazarlık konusu değildir.
3. **Yönetici yükü tasarımla düşürülmeli.** Şube becerilerinin en az yarısı sistem verisiyle otomatik kanıtlanmadan şube döngüsü açılmaz.
4. **Kanıt ilkesinden taviz yok.** "Hak ediyor ama kanıt yok" cümlesi seviye vermez, kanıt görevi açar. Bu kural bir kez delinirse sistem puanlama sistemine döner.
5. **İlk yıl kalibrasyon yılıdır.** Sonuçlar ücret/terfiye bağlı değil; eşikler ve göstergeler döngü sonunda revize edilecek. Bu, önceden ve yazılı olarak duyurulur.

## A.4 Yönlendirme kurulunun karar noktaları

| Tarih | Karar |
|---|---|
| Hafta 1 | Tasarım ve yönetişim onayı; ücret/terfiden ayrıklık kararı (yazılı) |
| Hafta 4 | Davranışsal sözlük v1.0 onayı |
| Hafta 6 | Şube teknik kütüphanesi ve KPI eşikleri onayı; Ocak dalgası GM departman listesi |
| Hafta 9 | Rol profilleri onayı; prova sonuçları |
| Hafta 10 | Go / No-Go (8 maddelik kontrol listesi) |
| Mart | Kalibrasyon kuralları ve GM 2. dalga |
| Haziran | 1. döngü raporu; eşik/gösterge revizyonları; Faz 2 eklemeleri (E6, E7, E9) |

## A.5 En büyük üç risk ve karşılığı

| Risk | Karşılık |
|---|---|
| Şube kütüphanesi ve eşikler Kasım sonuna yetişmez | Çalıştaylar hemen başlar; yetişmezse şubeler Ocak'ta yalnız davranışsal açılır, teknik Mart'ta |
| Sistem sprint 1–5 Aralık'a yetişmez | Döngü açılışı için şart olmayan her modül sonraya; potansiyel ve itiraz akışı gerekirse Ocak ortası |
| İK standardizasyon kapasitesi 100+ departmanı taşımaz | Küratör modeli, önceliklendirme, Mart dalgası; departman başına 2 saat bütçesi |

## A.6 Proje başarı ölçütleri (12 ay)

Değerlendirme tamamlanma ≥ %90 · mutabık satır ≥ %85 · itiraz ≤ %10 · yönetici cömertlik endeksi ±0,5 içinde olan yönetici ≥ %80 · gelişim planı oranı ≥ %80 · her kritik rol için ≥ 1 adlandırılmış yedek · adalet algısı anketi ≥ 3,8/5.

---

# B. Proje yönetim modeli (yöntem)

## B.1 Yönetişim yapısı

```
Yönlendirme Kurulu (aylık, karar)
  Sponsor: İK'dan sorumlu GMY · Üyeler: İK Direktörü, Şube Bankacılığı GMY, Segment GMY temsilcileri, BT Direktörü
        │
Proje Lideri (haftalık durum, risk, kapsam)
        │
├── İK Yetkinlik Ekibi (3–4 kişi: kütüphane, göstergeler, standardizasyon, döngü yönetimi)
├── Bölge İK İş Ortakları (15: şube ağı uygulaması, kalibrasyon, itiraz)
├── Departman Küratörleri (100+: GM teknik beceri taslakları)
├── Segment Çalıştay Panelleri (rol başına: GM departmanı + bölge + şube müdürü)
├── BT / Geliştirme Ekibi (sprintler, içe aktarma, prova)
└── İletişim ve Eğitim (duyuru, video, SSS, yardım masası)
```

## B.2 Çalışma ritmi

| Ritim | Kim | İçerik |
|---|---|---|
| Günlük 15 dk (İP1 süresince) | İK yetkinlik ekibi | Kuyruk durumu, blokajlar |
| Haftalık 30 dk | Proje lideri + ekip liderleri | Durum, risk, karar ihtiyacı |
| İki haftada bir | BT sprint gözden geçirme | Teslim, kabul testi |
| Aylık | Yönlendirme kurulu | Kapı kararları |
| Döngü içinde haftalık | İK iş ortakları | Tamamlanma oranları, yük, itiraz |

## B.3 Kalite kapıları (Definition of Done)

Her iş paketi, çıkış kriterleri sağlanmadan "bitti" sayılmaz. Kapıları proje lideri değil, **bir sonraki paketin sahibi** onaylar (İP1'i İP2 sahibi, İP2'yi İP4 sahibi vb.). Böylece "kâğıt üstünde bitti" önlenir.

## B.4 RACI (özet)

| İş | Sorumlu (R) | Onaylayan (A) | Danışılan (C) | Bilgilendirilen (I) |
|---|---|---|---|---|
| Davranışsal sözlük | İK yetkinlik ekibi | Yönlendirme kurulu | Yöneticiler (anket), bölgeler | Tüm çalışanlar |
| GM teknik beceri | Küratör + yönetici | Departman müdürü | İK (standardizasyon) | Çalışanlar |
| Şube teknik beceri ve eşikler | Çalıştay paneli | Segment GMY | Bölge müdürleri, Uyum | Şube müdürleri |
| Rol profilleri | Yönetici + İK | Üst yönetici / GMY | Uyum (lisans) | Çalışanlar |
| Veri hazırlığı | İK sistemleri + BT | İK direktörü | Satış/Kredi/Uyum veri sahipleri | Proje lideri |
| Döngü işletimi | Yöneticiler, çalışanlar | İK iş ortağı | Alan uzmanları | Üst yönetim |
| Kalibrasyon | Bölge/departman müdürü | GMY | İK iş ortağı | Yöneticiler |
| Gelişim planı | Çalışan + yönetici | Yönetici | Mentor | İK |
| Kritik rol / yedekleme | GMY + İK | Yönlendirme kurulu | Bölge müdürleri | — |

## B.5 Risk ve değişiklik yönetimi

- **Risk kaydı:** her risk için olasılık (1–3), etki (1–3), sahibi, önlem, tetik işareti. Haftalık gözden geçirilir.
- **Kapsam değişikliği:** döngü açıldıktan sonra kütüphane, eşik ve rol profili değişmez (sürüm kuralı). Değişiklik talepleri biriktirilir, döngü sonunda topluca ele alınır.
- **Durum raporu şablonu (haftalık, 1 sayfa):** bu hafta tamamlananlar · gelecek hafta · kapı durumu · ilk 5 risk · karar ihtiyacı · tamamlanma yüzdeleri (kütüphane, profil, veri, sprint).

---

# C. İş paketleri — uygulayıcı kılavuzu

## İP0 · Proje kurulumu ve yönetişim (1 hafta)

**Amaç:** Projenin sahiplenilmesi, karar haklarının netleşmesi, ekibin kurulması.

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler | Örnek |
|---|---|---|---|---|
| 0.1 | Sponsor ve kurul | İK'dan sorumlu GMY'yi sponsor yapın; Şube Bankacılığı GMY ve en az iki segment GMY'sini kurula alın; ilk toplantıda ücret/terfiden ayrıklık kararını tutanağa yazdırın | İK'nın kendi içinde "kendi projesi" olarak başlatması; sponsorun yalnız adının yazılması | Kurul kararı: "2027 ve 2028 döngülerinde yetkinlik sonuçları ücret ve prim kararlarına girdi olmayacaktır." |
| 0.2 | Çekirdek ekip | Proje lideri + 3–4 kişilik İK yetkinlik ekibi + BT ürün sahibi + iletişim sorumlusu; her birinin haftalık ayırdığı gün sayısını yazın | Herkesin "ek görev" olarak atanması; tam zamanlı kimsenin olmaması | İK yetkinlik ekibi: 2 tam zamanlı, 2 yarı zamanlı; proje lideri %60 |
| 0.3 | RACI ve karar hakları | B.4 tablosunu kuruma uyarlayın; her kapı için onaylayanı tek kişi yapın | "Komite onaylar" belirsizliği | Şube teknik kütüphanesi onayı: Şube Bankacılığı GMY (tek imza) |
| 0.4 | Takvim ve kapılar | A.4 karar noktalarını kurul takvimine koyun; Ocak açılış tarihini yazılı ilan edin | Tarihsiz "mümkün olan en kısa sürede" planları | Go/No-Go: 30 Aralık 2026, 14:00 |
| 0.5 | Risk kaydı | A.5'teki üç riski ve İP bazlı riskleri sahipleriyle açın | Riskleri yalnız proje liderinin taşıması | Risk 3 sahibi: İK yetkinlik ekibi lideri; tetik: 3. hafta sonunda onaylı departman < 30 |
| 0.6 | Kick-off duyurusu | Genel Müdür imzalı, 1 sayfa: neden, ne zaman, ne beklenir, ne beklenmez (ücret) | İK imzalı teknik duyuru; "yeni performans sistemi" ifadesi | Başlık: "Yetkinliklerimizi birlikte görünür kılıyoruz" |

**Çıkış kriteri:** Kurul tutanağı, RACI, takvim, risk kaydı ve kick-off duyurusu yayınlanmış.
**Şablonlar:** Kurul tutanağı · RACI · Risk kaydı · Haftalık durum raporu (B.5).

## İP1 · Yetkinlik mimarisi (6–7 hafta) — en kritik iş paketi

**Amaç:** Ölçülebilir, tutarlı, kanıtlanabilir bir yetkinlik kütüphanesi: davranışsal sözlük, teknik beceri kütüphaneleri, seviye ölçeği, göstergeler, kanıt kuralları ve katalizör bağları.

**Sahip:** İK yetkinlik ekibi. **Katılımcılar:** yönlendirme kurulu, departman küratörleri, segment panelleri, bölge temsilcileri, Uyum.

**İlke:** Önce **yapı** (sözlük iskeleti ve seviye ölçeği), sonra **içerik** (yetkinlikler), sonra **ölçüm** (göstergeler ve kanıt). Sırayı bozup "hemen yetkinlik listesi yazmaya" başlayan projeler, sonradan her şeyi yeniden yazar.

### 1.1 Sözlük yapısını kurmak (1. hafta)

**Ne yapılır:** Kütüphanenin iskeleti ve adlandırma kuralları belirlenir; henüz tek bir yetkinlik yazılmaz.

| Karar | Önerilen | Gerekçe |
|---|---|---|
| Aileler | Davranışsal (Çekirdek, Liderlik) · Teknik (GM: departman/servis; Şube: ortak çekirdek, satış çekirdeği, segment, gişe/operasyon, yönetim) | Her ailenin sahibi ve toplama yöntemi farklı |
| Sayı sınırları | Çekirdek 8–12, Liderlik 5–7, rol başına teknik 12–18, kişi başı toplam ≤ 30 satır | Değerlendirme kalitesi ve yorgunluk |
| Kod sistemi | `D-C-01` (Davranışsal-Çekirdek), `D-L-01`, `T-GM-FIN-003`, `T-SB-A1` | Raporlama ve sürüm takibi; adlar değişse de kod kalır |
| Ad kuralı | İsim tamlaması, fiil yok, araç adı yok, ≤ 5 kelime | "Mali Tablo Analizi" ✓ · "SAP" ✗ · "Müşteriyle iyi iletişim kurmak" ✗ |
| Tanım kuralı | 1–2 cümle; "ne"yi ve "ne için"i söyler; yargı sözcüğü yok | "Tedarikçilerin kalite, maliyet, teslimat ve risk boyutlarında puanlanması ve sınıflandırılması" |
| Kategori etiketleri (teknik) | Yazılım/Araç · Mevzuat/Standart · Süreç/Metodoloji · Ürün/Alan bilgisi · Ekipman/İşlem · Dil | Filtreleme ve kanıt türü eşlemesi |
| Gelecek eğilimi | Yükselen · Stabil · Azalan | Yatırım önceliği |
| Sürüm kuralı | Anlam değişikliği = yeni sürüm; yazım = aynı sürüm | Geçmiş değerlendirmeler bozulmaz |

**Yapılması gerekenler**
- Yapıyı bir sayfalık "Kütüphane Anayasası" olarak yazın ve kurula onaylatın; sonraki her tartışmada bu belgeye dönün.
- Ortak teknik beceri havuzunu (Excel, SQL, sunum, proje yönetimi, temel bankacılık sistemi) **önceden** 10–15 beceriyle açın; departmanlar bunları kopyalamaz, bağlar.
- Her yetkinliğe tek sahip (ad: İK; teknik: ilgili müdür/GMY) atayın.

**Kaçınılması gerekenler**
- Hazır bir danışmanlık sözlüğünü olduğu gibi almak: adlar tanıdık gelir ama göstergeler kuruma uymaz.
- "Dijital", "Çeviklik" gibi moda başlıkları yetkinlik yapmak: davranış değil slogan olurlar.
- Teknik ve davranışsal aileleri aynı listeye karıştırmak: "Titizlik" bir teknik beceri listesinde görünüyorsa yapı bozulmuştur.

**Örnek — Kütüphane Anayasası (özet maddeler):**
1. Her yetkinlik bir aileye, bir koda, bir sahibe ve bir sürüme sahiptir.
2. Davranışsal yetkinlik gözlenebilir davranış tanımlar; kişilik özelliği değildir.
3. Teknik beceri bir işi yapabilme yeteneğidir; araç veya ürün adı değildir.
4. Her seviye 3–5 gösterge, her gösterge en az bir kanıt türü taşır.
5. Kişi başına değerlendirme satırı 30'u geçemez.

**Çıkış kriteri:** Anayasa onaylı; kod sistemi ve ortak havuz başlangıç listesi sistemde.

### 1.2 Seviye ölçeğini belirlemek (1. hafta, 1.1 ile birlikte)

**Ne yapılır:** Tüm beceriler için ortak 5 seviye tanımı ve her seviyeyi ayıran üç boyut netleştirilir. Beceriye özgü göstergeler bu iskelete yazılır.

| Seviye | Ad (teknik / davranışsal) | Özerklik | Karmaşıklık | Etki alanı | Tipik fiiller |
|---|---|---|---|---|---|
| 0 | Yok / Uygulanamaz | – | – | – | – |
| 1 | Başlangıç / Gelişmekte | Yakın gözetim | Basit, tanımlı | Kendi görevi | uyguladı (gözetimle), kaydetti, takip etti |
| 2 | Uygulayıcı / Uygular | Rutinde bağımsız | Standart | Kendi görevi | bağımsız yaptı, tamamladı, raporladı |
| 3 | Yetkin Uygulayıcı / Güçlü | Tam bağımsız | Rutin dışı | Ekip | çözdü, analiz etti, rehberlik etti, iyileştirme önerdi |
| 4 | Yöneten / Rol model | Alanı yönetir | Belirsiz, çok değişkenli | Birim | tasarladı, standart koydu, geliştirdi (kişi/süreç), yönetti |
| 5 | Yön Veren / Kültür taşıyıcı | Stratejik | Yeni, öncü | Kurum ve dışı | politika belirledi, yeni yaklaşım geliştirdi, kurum dışı referans oldu |

**Nasıl belirlenir (adımlar):**
1. Üç boyutu (özerklik, karmaşıklık, etki) kurum diline çevirin; "birim" GM'de servis/departman, şubede şube/bölge demektir.
2. Her seviyenin **ayırt edici sorusunu** yazın: "Kim denetliyor?", "Rutin dışını çözüyor mu?", "Kimi etkiliyor?" Ardışık iki seviyede bu üç sorudan en az birinin cevabı değişmeli.
3. Beş yöneticiye ölçeği gösterip kendi ekibinden birer kişiyi yerleştirmelerini isteyin; "2 ile 3 arasında kaldım" cümlesi çoksa tanımları keskinleştirin.
4. Seviye 4 ve 5'in "daha iyi yapma" değil **"başkalarını ve sistemi değiştirme"** olduğunu her yerde vurgulayın; en sık yanlış anlaşılan nokta budur.

**Yapılması gerekenler**
- Davranışsal ölçek için aynı sayıları, farklı adları kullanın (S2 kararı); analiz için sayı ortak kalmalı.
- Seviye 0'ı koruyun: "uygulanamaz" ile "başlangıç" karışırsa ortalamalar bozulur.
- Hedef seviyeleri bu aşamada **konuşmayın**; hedef İP2'nin işidir.

**Kaçınılması gerekenler**
- "Kötü / orta / iyi / çok iyi / mükemmel" türü performans dili. Mevcut 3'lü ölçeğin ("iyi olabilirsin / iyisin / çok iyisin") tuzağı tam budur.
- 7 veya 10 seviye: ayırt edilemez, kalibre edilemez.
- Seviye adlarını kademe adlarıyla karıştırmak ("Uzman", "Kıdemli"): ölçek yeterliliği, kademe pozisyonu anlatır.

**Örnek — yanlış ve doğru seviye cümlesi (Kredi Ön Değerlendirme, seviye 3):**
- ✗ "Kredi değerlendirmede iyidir, hata yapmaz."
- ✓ "Standart dışı (teminat yapısı karmaşık veya mali tabloları düzensiz) başvuruları bağımsız analiz edip tahsise eksiksiz dosya sundu; yeni portföy yetkililerine dosya hazırlamayı öğretti."

**Çıkış kriteri:** Ölçek tablosu kurulda onaylı; 5 yöneticiyle yerleştirme testi "arada kaldım" oranı ≤ %20.

### 1.3 Davranışsal yetkinlikleri seçmek (2.–3. hafta)

**Ne yapılır:** 04 aday sözlüğünden 8–12 çekirdek + 5–7 liderlik yetkinliği, üç kaynağı kesiştirerek seçilir: strateji, saha (kritik olaylar), yönetici doğrulaması.

**Adımlar**

| # | Adım | Nasıl | Çıktı |
|---|---|---|---|
| 1 | Strateji eşlemesi | 2 saatlik çalıştay (İK + 2 üst yönetici): kurumun 3–5 yıllık hedeflerini listeleyin; her hedef için "bu, çalışanlardan hangi davranışı ister?" sorusunu cevaplayın; aday sözlükle eşleyin | Strateji → yetkinlik matrisi |
| 2 | Kritik olay görüşmeleri | 12–16 görüşme (GM/şube, yüksek/ortalama performanslı karışık; 45 dk): "Son 6 ayda işinizde çok iyi giden bir olay anlatın. Ne oldu, siz ne yaptınız, sonuç ne oldu?" Aynı soru kötü giden olay için. Notları davranış cümlelerine kodlayın | 150–250 davranış cümlesi, yetkinliklere eşlenmiş |
| 3 | Mevcut listeyi eşleme | Mevcut 3'lü ölçekli yetkinliklerin her birini aday sözlüğe "birebir / birleştir / emekli" olarak eşleyin; emekli gerekçesi yazın | Eşleme tablosu |
| 4 | Kart sıralama | 3 grup × 6–8 yönetici (GM, şube, bölge); 20–25 kart; "zorunlu / önemli / gereksiz" ayrımı, sonra ilk 10'u sıralama; gruplar arası fark tartışılır | Grup sıralamaları |
| 5 | Doğrulama anketi | Tüm yöneticilere (veya tabakalı 150): her aday için **önem** (1–5) ve **ayırt edicilik** (1–5) + 1 açık uçlu; 8 dk | Anket sonuçları |
| 6 | Seçim matrisi | 10 §1.3 matrisi: strateji bağı, kritik olay sıklığı, kart puanı, anket önem ve ayırt edicilik, katalizör bağ sayısı → toplam; örtüşenleri birleştir | Sıralı liste, gerekçeli |
| 7 | Karar | Kurul onayı; her seçilen yetkinlik için 3 cümlelik "neden seçildi" notu | Sözlük v1.0 (göstergesiz) |

**Yapılması gerekenler**
- Kararı **ayırt edicilik** puanına dayandırın; önem herkeste yüksek çıkar.
- Her yetkinliğin en az bir teknik beceriyi "besleyecek" olmasını kontrol edin (katalizör mantığı); beslemeyen yetkinliği sorgulayın.
- Liderlik yetkinliklerini şube müdürü, bölge müdürü ve GM yöneticisi için aynı anda test edin; üçünde de anlamlı olmalı.
- Bölgelerin alıştığı yetkinlikler kaldırılıyorsa gerekçeyi bölge müdürlerine önceden anlatın.

**Kaçınılması gerekenler**
- 15+ çekirdek yetkinlik: "hiçbirini bırakamadık" cümlesi, seçim yapılmadığının itirafıdır.
- Yalnızca üst yönetimin seçmesi: saha "bize sorulmadı" der; yalnızca anket: strateji bağı kopar.
- Kişilik özelliklerini yetkinlik yapmak: "Dürüstlük", "Pozitiflik", "Özgüven".
- Aynı davranışı iki ad altında tutmak: "Problem Çözme" ve "Analitik Düşünme" birlikte alınacaksa sınır cümlesi yazılmalı (analitik = veriyi ayrıştırma; problem çözme = kök neden ve çözüm uygulama).

**Örnek — seçim matrisi satırları:**

| Aday | Strateji (0–2) | Kritik olay (0–2) | Kart (0–2) | Önem | Ayırt edicilik | Katalizör bağı | Karar |
|---|---|---|---|---|---|---|---|
| Sürekli Öğrenme | 2 | 2 | 2 | 4,6 | 4,1 | 9 | Çekirdek |
| Müşteri Odaklılık | 2 | 2 | 2 | 4,8 | 3,7 | 5 | Çekirdek |
| Süreç Odaklılık | 2 | 1 | 2 | 4,2 | 3,9 | 6 | Çekirdek |
| Dayanıklılık | 1 | 2 | 1 | 4,0 | 3,2 | 2 | Değişime Uyum ile birleştir |
| Kalite ve Detay Odağı | 1 | 1 | 1 | 3,8 | 2,9 | 3 | Alınmaz: teknik göstergelerde zaten ölçülüyor |
| Pozitif Tutum (bölge önerisi) | 0 | 1 | 1 | 4,1 | 2,2 | 0 | Alınmaz: tutum, davranış değil |

**Örnek — sınır cümlesi:** "İşbirliği, birimler arası ortak hedefe katkıyı; İletişim, mesajın açık ve anlaşılır iletilmesini ölçer. Bir toplantıda net konuşan ama bilgi paylaşmayan kişi İletişim'de yüksek, İşbirliği'nde düşüktür."

**Çıkış kriteri:** 8–12 + 5–7 yetkinlik, her biri tanım + sınır cümlesi + "neden seçildi" notu ile; kurul onayı; eşleme tablosu tamam.

### 1.4 Teknik becerileri tespit etmek — Genel Müdürlük (3.–7. hafta, departman dalgalarıyla)

**Ne yapılır:** Her servisin işlerinden teknik beceriler türetilir, standardize edilir, onaylanır. Yöntem: görev envanteri + küratör çalıştayı + İK standardizasyonu (bkz. şablon dokümanı).

**Adımlar**

| # | Adım | Nasıl | Süre |
|---|---|---|---|
| 1 | Önceliklendirme | 100+ departmanı üç dalgaya ayırın: kritik rol yoğun ve büyük departmanlar 1. dalga (Ocak), kalanlar 2. (Mart) ve 3. dalga | 1 gün |
| 2 | Küratör ataması ve eğitimi | Müdürden işi bilen 1 kişi; 1 saatlik eğitim: yapı, ad kuralı, gösterge kuralı, en sık 5 hata | 1 hafta |
| 3 | Doküman madenciliği | Küratör, görev tanımları, prosedürler, denetim bulguları, zorunlu eğitim ve lisans listelerinden ön beceri listesi çıkarır | 2 saat/servis |
| 4 | İş analizi görüşmesi | Küratör + servis yöneticisi, 45 dk, 10 §2.1 soru seti: ana işler → gereken bilgi/beceri → üst seviye farkı → edinim süresi → bus factor → ortak kullanım → katalizör → gelecek eğilimi | 45 dk/servis |
| 5 | Servis çalıştayı | 60 dk (şablon §3): iş listesi → beceri çıkarımı → birleştirme/eleme → 8–20 beceri → en kritik 5 için seviye çıpası ve gösterge taslağı | 60 dk/servis |
| 6 | Portala giriş | Küratör beceriyi girer; sistem benzer beceri önerir; ortak havuzdakine bağlar | 20 dk/beceri |
| 7 | İK standardizasyonu | Ad, kategori, birleştirme, gösterge kalite listesi; düzeltme talebi | ~2 saat/departman |
| 8 | Teyit ve onay | Küratör/yönetici teyidi (5 iş günü) → departman müdürü onayı → Aktif | 1 hafta |

**Yapılması gerekenler**
- İşten başlayın: "Bu serviste hangi işler yapılıyor?" sorusu önce, "hangi beceriler gerekir?" sonra.
- Servis başına 8–20 beceri sınırını açıkça söyleyin; aşan listeyi geri gönderin.
- Mevzuat ve standartlarda sürüm yazdırın (ISO 9001:2015; BDDK ... Yönetmeliği, 2024).
- Granülerlik testi uygulayın: bir beceri sıfırdan seviye 3'e **3–18 ay** sürmeli; daha kısa ise görevdir (birleştirin), daha uzun ise parçalayın.
- "Çok iyi olan ne farklı yapıyor?" sorusunu her beceri için sorun; seviye 4–5 göstergeleri buradan çıkar.

**Kaçınılması gerekenler**
- Yöneticiye boş Excel gönderip beklemek: ya 40 satır gelir ya 3.
- Araç adını beceri yapmak: "Excel", "SAP", "Teams".
- Kişilik özelliğini beceri yapmak: "Dikkatli olma", "Sorumluluk".
- Aynı beceriyi her serviste yeniden yazmak: "Satınalma'nın tedarikçi değerlendirmesi" ile "Kalite'nin tedarikçi denetimi" tek beceri + servis bazlı hedef seviye olabilir.
- Standardizasyonu atlayıp doğrudan yayınlamak: harita okunmaz hale gelir.

**Örnek — işten beceriye dönüşüm (Finansal Planlama servisi):**

| İş (servis listesi) | Türetilen beceri | Kategori | Granülerlik testi |
|---|---|---|---|
| Yıllık bütçe hazırlama ve revizyon | Bütçe Planlama ve Kontrol | Süreç/Metodoloji | 12 ay → uygun |
| Aylık yönetim raporu | Yönetim Raporlaması ve Varyans Analizi | Süreç/Metodoloji | 6 ay → uygun |
| Raporların Excel'de hazırlanması | ✗ (araç; Ortak havuz: "Veri Analizi ve Raporlama Araçları"na bağlanır) | — | — |
| Bütçe toplantılarına katılım | ✗ (görev, beceri değil) | — | — |
| Nakit akış projeksiyonu | Nakit Akış Modelleme | Süreç/Metodoloji | 9 ay → uygun |

**Örnek — reddedilen ve düzeltilen beceri adları:**

| Gelen | Sorun | Düzeltilmiş |
|---|---|---|
| "Mevzuata hâkim olma" | Yargı + belirsiz | "Bankacılık Düzenlemeleri Uygulaması (BDDK, 5411)" |
| "SAP" | Araç | "SAP FI ile Mali Muhasebe İşlemleri" |
| "Titiz çalışma" | Kişilik | Silindi; "Yönetim Raporlaması" seviye 2 göstergesine "hatasız" kanıt kriteri eklendi |
| "Her türlü raporlama" | Çok geniş | "Yönetim Raporlaması" + "Düzenleyici Raporlama (BDDK/TCMB)" olarak ikiye bölündü |

**Çıkış kriteri (departman bazında):** Beceri sayısı 8–20/servis; mükerrer oranı < %5; gösterge kalite listesi ≥ %90; müdür onayı; ortak havuz bağlantıları yapılmış.

### 1.5 Teknik becerileri tasarlamak — Şube ağı (2.–6. hafta)

**Ne yapılır:** Az sayıda şube rolü için tek standart set: ortak çekirdek (A), satış çekirdeği (B), segment (C), gişe/operasyon (D), yönetim (E). Yöntem: KPI tabanlı kıyas + davranışsal olay görüşmesi + uzman paneli + çalıştay.

**Adımlar**

| # | Adım | Nasıl |
|---|---|---|
| 1 | Kıyas örneklemi | Her rol için son 12 ay KPI'larına göre üst %20'den 4, orta %40'tan 4 kişi; farklı bölge ve şube sınıfı |
| 2 | Davranışsal olay görüşmeleri | 8 kişi × 45 dk / rol: "En zor dosyanızı/müşterinizi anlatın; adım adım ne yaptınız?" Üst dilimde görülüp orta dilimde görülmeyen davranışları işaretleyin → seviye 4–5 göstergeleri |
| 3 | Uzman paneli | Segment GM departmanı: ürün, mevzuat, risk gereklilikleri, lisans ve yetki yapısı; A ve B katmanlarının tek seferde tanımı |
| 4 | Rol çalıştayı | 9 çalıştay (BST, Müşteri İlişkileri, Bireysel, KOBİ, Ticari, Kurumsal, Özel, Şube Müdürü, Bölge Müdürü): beceri seti 12–18, çıpalar, göstergeler, kanıt türleri |
| 5 | KPI eşikleri (Delphi) | Her otomatik kanıt göstergesi için 5 kişilik panel (GMY temsilcisi, 2 bölge müdürü, 2 şube müdürü) anonim 2 tur; geçen yıl verisiyle simülasyon |
| 6 | Lisans ve yetki eşlemesi | Uyum ile: hangi gösterge hangi lisansı ön koşul yapar; hangi yetki kademesi hangi göstergenin kanıtı |
| 7 | Şube sınıfı istisnaları | Kurumsal şube +1 kuralı; segment GMY onayı |
| 8 | Kuru test | 2 şubede 3'er kişi elle hesaplanır; çıkan seviyeler makul mü? |
| 9 | Onay | Segment GMY'leri; Şube Bankacılığı GMY tek imza |

**Yapılması gerekenler**
- A ve B katmanlarını **önce ve bir kez** yazın; segment çalıştayları bunları tartışmaz, yalnızca C–E'yi yazar.
- Her teknik göstergenin yanına "hangi sistem verisi bunu kanıtlar?" sorusunu koyun; hedef: şube göstergelerinin ≥ %50'si otomatik.
- Eşikleri "hedefe oran" olarak tanımlayın (hedefin %100'ü), mutlak sayı olarak değil; şube sınıfı farkı böyle otomatik düzelir.
- Simülasyonda hiçbir seviye > %60 yığılma olmasın; yığılıyorsa eşik yanlıştır.
- Kalite göstergesini KPI göstergesine eşlik ettirin: seviye 4 için satış hedefi **ve** tahsis geri dönüş oranı.

**Kaçınılması gerekenler**
- Sadece merkezin yazması (saha "masa başı" der) veya sadece sahanın yazması (standart olmaz).
- Satış KPI'sını tek başına yetkinlik kanıtı saymak: baskı altında satılan kötü kredi "yetkinlik" değildir.
- Rol başına 25+ beceri: şube müdürü 15 kişi × 25 beceri doğrulayamaz.
- Özel bankacılık ve kurumsal gibi küçük ama kritik segmentleri "sonra" demek.

**Örnek — şube becerisi tam tasarımı (C: Mali Tablo Analizi, KOBİ/Ticari Satış):**

| Seviye | Göstergeler (Z = zorunlu) | Kanıt kuralı |
|---|---|---|
| 1 | Mali tablo kalemlerini sisteme doğru girdi (Z); temel oranları hesapladı | Dosya kontrol kaydı; vaka sınavı ≥ 60 |
| 2 | Standart KOBİ başvurusu için mali analizi bağımsız hazırladı (Z); tahsise ilk seferde kabul edilen dosya oranı ≥ %70 (otomatik) | Tahsis sistemi, 2 dönem |
| 3 | Düzensiz veya konsolide tablolu firmayı analiz edip risk ve teminat önerisi yazdı (Z); erken uyarı sinyali verip aksiyon aldı; yeni yetkiliye analiz öğretti | Dosya + tahsis notu; erken uyarı kaydı; mentorluk kaydı |
| 4 | Şube/bölge için analiz standardı veya kontrol listesi tasarladı (Z); portföyünde NPL oranı segment medyanının altında 3 dönem (otomatik); bölge eğitimi verdi | Standart dokümanı; kredi izleme; eğitim kaydı |
| 5 | Kurum kredi politikasına analiz yöntemi önerisi kabul edildi (Z); segment GM uzmanı onayı | Politika revizyon kaydı; alan uzmanı |

Hedef: KOBİ Satış 3 · Ticari Satış 4 (ticari şube) / 3 (KOBİ şubesi) · Kurumsal Satış 5 · Şube Müdürü 3.
Katalizörler: Analitik Düşünme 0,5 · Sürekli Öğrenme 0,3 · Sonuç Odaklılık 0,2.
Lisans ön koşulu: yok. Yetki kanıtı: 2. kademe kredi yetkisi → seviye 3 göstergesi "bağımsız analiz" için destekleyici kanıt.

**Çıkış kriteri:** 9 rol için set, göstergeler, eşik tablosu, lisans/yetki eşlemesi, istisnalar; simülasyon raporu; kuru test 3/3 makul; GMY onayları.

### 1.6 Gösterge yazımı (her beceri için; 1.3–1.5 içinde)

**Ne yapılır:** Her yetkinlik × seviye için 3–5 davranış göstergesi. Yöntem: BARS geliştirme + geri eşleme testi.

**Adımlar**
1. Davranış örnekleri toplayın: görüşme ve çalıştaylardan her beceri için 10–20 geçmiş zamanlı cümle.
2. Her cümleyi üç soruyla seviyeye yerleştirin (kim denetledi, ne kadar karmaşıktı, kimi etkiledi).
3. **Geri eşleme:** cümleleri karıştırıp konuyu bilen 3–5 kişiye yeniden yerleştirtin; ≥ %80 uzlaşmayanı yeniden yazın veya atın.
4. Her seviyede 3–5 cümle seçin; en az biri **zorunlu**; mümkünse biri sistem verisiyle doğrulanabilir.
5. Her göstergeye kanıt türü, asgari kanıt sayısı (1), geçerlilik (24 ay), otomatik kural (varsa), potansiyel boyutu (varsa) yazın.
6. Kalite kontrol listesinden geçirin.

**Gösterge kalite kontrol listesi**
- [ ] Geçmiş zaman ve gözlenebilir fiil ("hazırladı", "tasarladı", "öğretti")
- [ ] Tek davranış (ve/veya ile bağlanmış iki davranış yok)
- [ ] Yargı sözcüğü yok ("iyi", "etkili", "başarılı", "kaliteli")
- [ ] Kanıtı tarif ediyor (ne üretildi, ne değişti)
- [ ] Ardışık seviyeyle farkı net (özerklik/karmaşıklık/etki)
- [ ] Her seviyede ≥ 1 zorunlu gösterge
- [ ] Kanıt türü ve geçerlilik yazılı
- [ ] 3 kişilik geri eşleme uzlaşısı ≥ %80

**Yapılması gerekenler**
- Göstergeleri **yapanlara** yazdırın, sonra İK düzeltsin; tersi (İK yazar, saha onaylar) sahada "bizim işimiz böyle değil" direnci üretir.
- Bir kanıtın birden çok göstergeyi karşılayabileceğini baştan tasarlayın; kanıt yükü böyle düşer.
- Seviye 1 göstergelerini de yazın; yeni işe girenler ve işe giriş döngüsü için gerekir.

**Kaçınılması gerekenler**
- "…yapabilir", "…bilir", "…farkındadır" ile biten cümleler: ölçülemez.
- Aynı cümleyi seviyeler arasında "daha iyi", "daha hızlı" ekleriyle çoğaltmak.
- Kanıtı bulunamayacak göstergeler yazmak: o seviyeyi kimse alamaz, çalışan sistemi adaletsiz bulur.
- Bir seviyede 8–10 gösterge: hesaplama kuralı (%70) anlamını yitirir, yönetici yükü artar.

**Örnek — yanlıştan doğruya (Müşteri Odaklılık, seviye 3):**

| Yanlış | Neden yanlış | Doğru |
|---|---|---|
| "Müşteriyi iyi anlar ve memnun eder" | Yargı, iki davranış, kanıt yok | "Görüşme sonrası müşteri ihtiyaç özetini CRM'e kaydetti ve müşteriye teyit ettirdi" |
| "Şikayetlere duyarlıdır" | Tutum | "Sorumluluğundaki bir şikayeti kök nedenine inerek çözdü ve tekrarını önleyecek adımı kaydetti" |
| "Müşteri memnuniyetini artırabilir" | Potansiyel ifadesi, geçmiş değil | "Portföyünde NPS veya memnuniyet skoru 2 dönem üst üste şube ortalamasının üstünde (otomatik)" |

**Örnek — davranışsal yetkinlik tam gösterge seti (Sürekli Öğrenme):**

| Seviye | Göstergeler | Kanıt |
|---|---|---|
| 1 Gelişmekte | Atanan zorunlu eğitimleri süresinde tamamladı (Z) | LMS/sınav kaydı (otomatik) |
| 2 Uygular | Kendi alanındaki bir mevzuat/ürün değişikliğini işine yansıttı (Z); yöneticisinin önerdiği bir öğrenme kaynağını bitirip özetini paylaştı | İş çıktısı; paylaşım kaydı |
| 3 Güçlü | Kendi belirlediği bir öğrenme hedefini 12 ayda tamamladı (Z); öğrendiğini ekiple paylaştı (sunum/yazı/atölye) (Z); öğrendiğini uygulayıp ölçülebilir sonuç aldı | Hedef + tamamlama kanıtı; materyal + 360 teyidi; çıktı |
| 4 Rol model | Ekibi/birimi için öğrenme programı veya kılavuz tasarladı (Z); en az 2 kişiye mentorluk yaptı | Program dokümanı; mentorluk kaydı |
| 5 Kültür taşıyıcı | Kurum çapında öğrenme pratiği kurdu veya dış toplulukta içerik üretti (Z); üst doğrulama | Program kaydı; yayın/konuşma; alan uzmanı |

**Çıkış kriteri:** Tüm aktif yetkinliklerde seviye × 3–5 gösterge; kontrol listesi ≥ %90; geri eşleme ≥ %80.

### 1.7 Kanıt kuralları ve otomatik kanıt (4.–6. hafta)

**Ne yapılır:** Kanıt türleri, kabul kuralları, geçerlilik, otomatik kanıt kuralları ve "yaptım" formu kesinleştirilir; sistem verisi sahipleriyle veri sözleşmesi yapılır.

**Adımlar**
1. Kanıt türü listesini (05 §3.1, 06 §4) kuruma uyarlayın; her tür için doğrulayıcı rolü yazın.
2. Her otomatik göstergenin kuralını tanımlayın: KPI kodu, karşılaştırma, eşik, dönem sayısı; lisans kodu; yetki kodu + minimum limit; denetim: bulgu yok.
3. Veri sahipleriyle (Satış yönetimi, Krediler, Operasyon, Uyum, Teftiş, Müşteri deneyimi) **veri sözleşmesi**: alan, format, sıklık, sahip, kalite sorumlusu.
4. "Yaptım" formunu 5 çalışanla test edin: 5 dakikada doldurulabiliyor mu, hangi alan anlaşılmıyor?
5. Kanıt kalitesi kılavuzunu yazın (yöneticiler için 1 sayfa): kabul / ek bilgi / red örnekleri.

**Yapılması gerekenler**
- Kanıt geçerliliğini (24 ay) ve bayatlama uyarısını (60 gün önce) tüm göstergelere varsayılan yapın; mevzuat becerilerinde 12 ay düşünün.
- Kanıt dosyalarında müşteri verisi olmaması kuralını yazın ve örnekle anlatın (maskeleme).
- Reddin gerekçesiz olamayacağını sistemde zorlayın.

**Kaçınılması gerekenler**
- Her gösterge için 3 kanıt istemek: yük patlar; varsayılan 1.
- "Yöneticim bilir" cümlesini kanıt saymak: gözlem notu tarihli ve somut olmalı.
- KPI tanımlarını ve dönemlerini netleştirmeden kural yazmak: "çapraz satış" üç raporda üç farklı hesaplanır.

**Örnek — kanıt kalitesi kılavuzu satırları:**

| Kanıt | Karar | Gerekçe |
|---|---|---|
| "2026 Mart'ta X firması için konsolide mali analiz hazırladım; tahsis ilk seferde onayladı (dosya no 4587)" | Kabul | Somut, tarihli, doğrulanabilir |
| "Mali analizde iyiyim, yöneticim de bilir" | Red | Kanıt değil beyan |
| "Birçok dosya hazırladım" | Ek bilgi | Hangi dosya, ne zaman, sonuç? |
| Gözlem notu: "15 Mayıs ortak müşteri görüşmesinde ihtiyaç analizini yapılandırılmış sorularla yürüttü, 3 ürün önerisi müşteri tarafından kabul edildi" | Kabul | Yönetici gözlemi, tarihli, sonuçlu |

**Çıkış kriteri:** Kanıt türü tablosu, otomatik kural listesi, veri sözleşmeleri imzalı, form testi geçmiş, kanıt kalitesi kılavuzu yayında.

### 1.8 Katalizör bağları (6. hafta)

**Ne yapılır:** Her teknik beceri için 1–3 davranışsal katalizör, ağırlık (toplam 1) ve isteğe bağlı eşik kuralı.

**Adımlar:** (1) Çalıştaylardan gelen katalizör önerilerini toplayın; (2) İK, her teknik beceri için en fazla 3 katalizör seçer; (3) ağırlıkları 0,2'lik adımlarla verin (0,6/0,4; 0,5/0,3/0,2); (4) seviye 4–5 için eşik kuralı yalnız güçlü gerekçeyle ("Süreç İyileştirme seviye 4 için Süreç Odaklılık ≥ 3"); (5) tüm bağları "hipotez" olarak işaretleyin; 2. döngüde veriyle doğrulanacak.

**Yapılması gerekenler:** Her davranışsal yetkinliğin en az 2 teknik beceriyi beslediğini kontrol edin; beslemiyorsa 1.3'e dönün.
**Kaçınılması gerekenler:** Her beceriye aynı 3 katalizörü yazmak (model bilgi taşımaz); eşik kuralını her yere koymak (seviye verilemez hale gelir).

**Örnek:** Dış Ticaret İşlemleri ← Sürekli Öğrenme 0,4 (mevzuat sık değişir), Kalite/Detay (teknik göstergede) yerine Analitik Düşünme 0,3, Müşteri Odaklılık 0,3.

### 1.9 Onay, yayın ve sürümleme (7. hafta)

**Adımlar:** (1) Son kalite taraması (kontrol listesi, mükerrer, sınır cümleleri); (2) onay zinciri (İK → müdür/GMY → kurul); (3) v1.0 "Aktif"; (4) sürüm notu ve değişiklik kuralı duyurusu; (5) kütüphane özet kitapçığı (çalışanlar için 10 sayfa: aileler, seviye ölçeği, örnek göstergeler, kanıt ilkesi).

**Kaçınılması gerekenler:** Onaysız beceriyle döngü açmak; döngü içinde "küçük düzeltme" adıyla anlam değiştirmek.

**İP1 genel çıkış kriteri:** Davranışsal sözlük v1.0 (göstergeli), şube teknik kütüphanesi v1.0, GM 1. dalga kütüphanesi v1.0, kanıt kuralları, katalizör bağları; tümü sistemde "Aktif"; özet kitapçık yayında; İP2 sahibi kapıyı onaylamış.

**İP1 riskleri:** Gösterge kalitesi (önlem: geri eşleme ve kontrol listesi zorunlu); yönetici zamanı (önlem: 45+60 dk sabit format); standardizasyon darboğazı (önlem: dalgalar, departman başına 2 saat bütçe, benzer beceri önerisi); şube eşiklerinin gerçekçi olmaması (önlem: simülasyon ve kuru test).

## İP2 · Rol profilleri ve hedef seviyeler (3 hafta; İP1 ile örtüşür)

**Amaç:** Her rol için gereken yetkinlikler, hedef seviye, ağırlık, zorunluluk, lisans gereği; şube sınıfı istisnaları; kariyer yolları.

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler | Örnek |
|---|---|---|---|---|
| 2.1 | Rol listesini doğrulama | HRIS'teki unvanları rol ailesi + kademe olarak sadeleştirin; aynı işi yapan farklı unvanları tek role bağlayın | Her unvanı ayrı rol yapmak (yüzlerce profil) | "Uzman", "Uzman Yardımcısı", "Kıdemli Uzman" → Rol ailesi: Uzman; kademe 1–3 |
| 2.2 | Otomatik bağlar | Çekirdek davranışsal → tüm roller; liderlik → yönetici bayraklı roller | Elle girmek | Sistem kuralı |
| 2.3 | Teknik seçim ve hedef | Yönetici + İK, rol başına 45 dk: "bu rolde beklenen" seviye; kademe +1 kuralı | "İdeal" seviye; her şeyi 4 yapmak | Satınalma Uzmanı: Tedarikçi Değerlendirme 3, Sözleşme Yönetimi 2, SAP MM 3 |
| 2.4 | Ağırlık ve zorunluluk | Ağırlık 1–3; zorunlu = işe alım/terfi eşiği (ilk döngülerde yalnız raporlanır) | Her beceriyi zorunlu yapmak | Zorunlu: MASAK/KYC ≥ 2 tüm şube rolleri |
| 2.5 | Lisans gereği (E8) | Uyum ile rol–lisans matrisi; sistemde `zorunlu_lisans_kodları` | Lisansı "beceri" olarak yazmak | Özel Bankacılık: SPK Düzey 3 veya Türev |
| 2.6 | Şube sınıfı istisnaları | Kurumsal şube +1; segment GMY onayı | Her şube için ayrı profil | Ticari Satış: mali analiz 4 (ticari şube), 3 (KOBİ şubesi) |
| 2.7 | Kariyer yolları | Rol başına 1–3 "sonraki rol"; beceri komşuluğu (E1) hesabıyla kontrol | Yalnızca dikey yollar | KOBİ Satış → Ticari Satış; Müşteri İlişkileri → Bireysel Satış |
| 2.8 | Tutarlılık raporu | Aynı rol farklı birimde farklı hedef → gerekçe veya düzeltme; satır > 30 → sadeleştir | Raporu okumadan onaylamak | 3 departmanda "Proje Yönetimi" hedefi 2/4/5 → kademeyle hizalandı |
| 2.9 | Onay | Üst yönetici / GMY; profil v1.0; profilsiz pozisyon listesi sıfır | Pozisyonları profilsiz bırakıp "sonra bağlarız" demek | Kapı: profilsiz pozisyon = 0 |

**Hedef seviye belirlemenin pratik kuralı:** "Bu rolde 2 yıldır çalışan, işini beklendiği gibi yapan biri hangi seviyededir?" Cevap hedeftir. "En iyi çalışanımız hangi seviyede?" sorusu hedef değil, mentor adayı verir.

**Çıkış kriteri:** Tüm Ocak dalgası pozisyonları profile bağlı; kişi başı ≤ 30 satır; tutarsızlık raporu kapalı; lisans matrisi Uyum onaylı.

## İP3 · Veri hazırlığı (3 hafta)

**Amaç:** Organizasyon, kişi, atama, KPI, lisans, yetki, denetim ve devralınan davranışsal verinin temiz ve zamanında yüklenmesi.

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler |
|---|---|---|---|
| 3.1 | Veri sözleşmeleri | Her veri için sahip, alanlar, format, sıklık, kalite sorumlusu (07 §4 şemaları) | "BT halleder" belirsizliği |
| 3.2 | Organizasyon ve kişi | HRIS dışa aktarma; birim ağacı, şube sınıfı, pozisyon, yönetici sicili, İK iş ortağı, alan uzmanı | Yönetici sicili boş kayıtlar |
| 3.3 | Doğrulama turu | Sistem doğrulama raporu; hatalı satır işlenmez; 2–3 tur planlayın | İlk yüklemede sıfır hata beklemek |
| 3.4 | KPI, lisans, yetki | Son 12 ay KPI (kişi × dönem × KPI × hedef); lisans bitiş tarihleriyle; yetki kademeleri | Dönem tanımı tutarsız KPI (ay/çeyrek karışık) |
| 3.5 | Devralınan davranışsal | 3'lü ölçek → 2/3/4; eşleme tablosu; "referans, taban değil" işareti | Devralınan puanı "mutabık" gibi göstermek |
| 3.6 | KVKK | Veri envanteri, aydınlatma metni, saklama süresi, erişim logu | Müşteri verisi içeren alanları yüklemek |

**Örnek — doğrulama raporunda en sık 5 hata ve çözümü:** yönetici sicili eşleşmiyor (HRIS'te ayrılmış yönetici) → güncel atama; şube sınıfı boş → Şube Bankacılığı listesi; aynı sicil iki pozisyonda → birincil atama işareti; KPI kodu tanımsız → KPI sözlüğü; lisans bitiş tarihi geçmiş → "süresi dolmuş" durumu (hata değil).

**Çıkış kriteri:** Doğrulama hata oranı < %1; tüm Ocak dalgası kişileri yöneticili ve profilli; otomatik kanıtlar üretilmiş.

## İP4 · Sistem kurulumu ve prova (Sprint 1–5; 8 hafta)

**Amaç:** Yazılımın döngü açılışı için gereken modüllerle hazır olması; prova döngüsü.

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler |
|---|---|---|---|
| 4.1 | Kabul kriterleri | Her sprint için "bitti" tanımı; seviye hesaplama kuralları birim testli | "Çalışıyor gibi" kabul |
| 4.2 | Konfigürasyon | Seviye ölçeği, kanıt türleri, eşikler, roller/yetkiler, bildirim şablonları İK tarafından girilir (kod değil ayar) | Kuralları koda gömmek |
| 4.3 | Yetki matrisi testi | Her rolün (çalışan, yönetici, küratör, İK iş ortağı, alan uzmanı, üst yönetim) ne gördüğü test senaryolarıyla doğrulanır | 360 anonimliğini test etmemek |
| 4.4 | Prova döngüsü | Test ortamı, 2 bölge gerçek verisi, uçtan uca; sonuçlar silinir | Prova sonuçlarını paylaşmak |
| 4.5 | Yük testi | 1 dalga (~2.100 kişi) eşzamanlı; 30.000 360 bildirimi | Yük testini atlayıp dalga 1'de keşfetmek |
| 4.6 | Mobil | Kanıt ekleme, 360, onay akışları telefonda test | Masaüstü varsayımı |

**Çıkış kriteri:** Sprint 1–5 kabul testleri geçmiş; prova uçtan uca tamamlanmış; kritik hata sıfır; Go/No-Go listesi hazır.

## İP5 · Değerlendirme döngüsü işletimi (13 hafta / dalga; Ocak–Nisan)

**Amaç:** Her çalışan için kanıtlanmış ve mutabık seviyelerin belirlenmesi.

| Aşama | Süre | Yapılması gerekenler | Kaçınılması gerekenler | Örnek |
|---|---|---|---|---|
| Açılış | 1. gün | Kanıt kasasını 1 hafta önce "yalnız kanıt ekleme" modunda açın; açılış e-postası + mobil bildirim; yardım masası | Tüm dalgaları aynı gün açmak | Dalga 1: 5 bölge + hazır GM departmanları |
| Öz-beyan + kanıt | 3 hafta | Otomatik kanıtlar önceden dolu; eksik gösterge listesi görünür; haftalık tamamlanma raporu birim bazında; < %70 olan birime İK iş ortağı araması | Çalışana "puan ver" dili | "Hedef seviyeye kadar 14 göstergeden 9'u kanıtlı" |
| 360 | 2 hafta (paralel) | Yönetici 3–5 + çalışan 1–2 değerlendirici; kişi başı ≤ 8 talep; 2 hatırlatma; danışma sorusu (E3) | Form > 12 dk; < 3 yanıtla rapor | Yanıt oranı hedefi ≥ %75 |
| Yönetici doğrulaması | 3 hafta | Toplu ekran; "ek bilgi" 5 gün; red gerekçesi zorunlu; yönetici yük panosu (E4) izlenir; eşik aşımında İK iş ortağı desteği | "Hak ediyor ama kanıt yok" diye seviye vermek | Şube müdürü: 14 kişi × ~70 karar; yarısı otomatik |
| Seviye 5 doğrulama | 1 hafta | Bölge/departman müdürü + alan uzmanı kuyruğu; onaysız 5 yok | Kuyruğu izlemeyip mutabakatı geciktirmek | Segment başına 2–3 uzman |
| Mutabakat | 2 hafta | Görüşme kılavuzu; fark ≥ 2 veya reddedilen zorunlu kanıt → zorunlu görüşme; görüşme notu; çalışan onayı 5 gün | "Sen 3'sün" cümlesi; sayı pazarlığı | "Bu gösterge için hangi kanıt eksik, nasıl tamamlanır?" |
| İtiraz | 1 hafta | İK iş ortağı + üst yönetici; 10 iş günü; gerekçeli karar; kanıtsız yükseltme yok | İtirazı yöneticinin kendisinin değerlendirmesi | İtiraz oranı > %10 → kalibrasyon notu |

**Haftalık izleme panosu (İK iş ortağı):** aşama tamamlanma (birim), kanıt kabul/red oranı, 360 yanıt oranı, yönetici yükü, itiraz sayısı, yardım masası talep ve kapanış süresi.

**Çıkış kriteri:** Tamamlanma ≥ %90; mutabık satır ≥ %85; onaysız mutabık ≤ %5; itiraz ≤ %10.

## İP6 · Kalibrasyon ve potansiyel (3 hafta; Mart–Nisan)

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler |
|---|---|---|---|
| 6.1 | Şube/servis kademesi | Yönetici kendi bayraklarını görür ve gerekçeli düzeltir | Bu kademeyi atlamak |
| 6.2 | Bölge/departman kademesi | Bölge müdürü + İK iş ortağı; pano: dağılım, cömertlik endeksi, KPI–seviye uyumsuzluğu, devralınan sapması, onaysız mutabık, itiraz, gizli uzman bayrağı; her bayrak karara bağlanır (koru / düşür / kanıt görevi) | Zorunlu dağılım; seviye yükseltme; oturumun "ceza" algılanması |
| 6.3 | Merkez kademesi | Segment GMY'leri + İK; bölgeler arası dağılım; eşik revizyon önerileri (uygulama döngü sonunda) | Döngü içinde eşik değiştirmek |
| 6.4 | Potansiyel | Yönetici kanıtlı potansiyel göstergelerini doğrular; sistem uzmanlık/liderlik puanı ve güven düzeyi; İK dağılımı kalibre eder | Çalışana "yüksek/düşük potansiyel" etiketi göstermek; tek yöneticinin puanıyla yedek kararı |
| 6.5 | Kilit | İK anlık görüntü alır; sonrası düzeltme kaydıyla | Kilitten sonra "ufak düzeltme" |

**Örnek — kalibrasyon kararı kaydı:** "Şube 112, Bireysel Satış, A. K.: Portföy Derinleştirme mutabık 4; KPI son 2 dönem hedefin %78'i; yönetici kanıtı 'çok çalışkan'. Karar: Kanıt görevi aç; seviye 3'e düşürülmedi, 1 ay içinde kanıt gelmezse 3." Gerekçe yazılı, çalışana yönetici iletir.

**Çıkış kriteri:** Bayraklı kayıtların %100'ü karara bağlı; cömertlik ±0,5 içinde yönetici ≥ %80; potansiyel güven düzeyi Orta+ ≥ %70.

## İP7 · Gelişim planları (4 hafta; Mayıs)

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler | Örnek |
|---|---|---|---|---|
| 7.1 | Öncelik | Sistem açık × ağırlık × kritiklik; ilk 3–5; katalizör düşükse önce katalizör | 10 maddelik planlar | "SAP MM 2→3 için önce Sürekli Öğrenme 1→2" |
| 7.2 | Eylem | Eksik gösterge = yapılacak iş; 70-20-10 türü; bitiş; başarı kanıtı | "Eğitime gidecek" ile biten plan | "Q3'te 2 konsolide tablolu dosyayı bağımsız hazırlayacak (gösterge 3.1)" |
| 7.3 | Mentor | Seviye ≥ 4 ve danışılma yüksek kişiler; mentor başına ≤ 3 | Mentoru zorla atamak | Bölge içi eşleştirme |
| 7.4 | Kariyer hedefi | İstek beyanındaki rol; en yakın 3 rol (E1) ve geçiş açığı | Kariyer hedefi olmayan plan | KOBİ Satış → Ticari Satış: 3 beceride 1 seviye açık |
| 7.5 | Onay ve kaynak | Yönetici planı onaylar ve "iş" taahhüt eder (görev, proje, rotasyon) | Yöneticinin iş vermediği plan | Ticari dosyaya ortak çalışma görevi |
| 7.6 | İzleme | Çeyrek kontrol; ilerleme %; ara döngüde yeniden kanıt | Yılda bir bakılan plan | Temmuz ara döngüsü |

**Çıkış kriteri:** Plan oranı ≥ %80; her plan satırı bir göstergeye bağlı; mentor eşleşmesi kritik becerilerde ≥ %50.

## İP8 · Analitik, kritik rol, yedekleme, işe alım (6 hafta; Mayıs–Haziran)

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler |
|---|---|---|---|
| 8.1 | Haritalar | Kurum, GM, bölge, şube sınıfı, segment ısı haritaları; güçlü/gelişim alanları; devralınan vs kanıtlanmış karşılaştırması | Birimleri sıralayıp yayımlamak |
| 8.2 | Ölçüm kalitesi (E10) | Gösterge ayırt ediciliği, kappa, KPI–seviye yakınsama, 360 yanıt; revizyon listesi | Kaliteyi ölçmeden 2. döngüye girmek |
| 8.3 | Kritik beceri/rol | Delphi ile puanlama; skor; onay; bus factor 1 beceriler için bilgi aktarım planı | Her müdürün kendi rollerini kritik yapması; kritik rol > %15 |
| 8.4 | Yedekleme | Aday havuzu (açık + potansiyel + komşuluk); hazırlık teyidi; yedek derinliği raporu; sahip risk kaydı | İsim listesi yayımlamak; tek kişiyi 3 role aday yazmak |
| 8.5 | İşe alım | Rol profilinden iş tanımı ve mülakat kılavuzu; aday puan kartı; build/buy önerileri | "Yapabilirim" cevabına puan vermek |
| 8.6 | Üst yönetim sunumu | Risk dili: yedeksiz kritik rol, bus factor 1 beceriler, gelişim alanları; yatırım önerisi | 60 slaytlık harita gösterisi |

**Çıkış kriteri:** Kritik rol/beceri listesi onaylı; her kritik rol için ≥ 1 aday; bilgi aktarım planları açılmış; mülakat kılavuzları aktif işe alımlarda kullanımda.

## İP9 · Değişim yönetimi, eğitim ve iletişim (yatay; sürekli)

| # | Adım | Yapılması gerekenler | Kaçınılması gerekenler |
|---|---|---|---|
| 9.1 | Paydaş haritası | 10 §8 tablosu: endişe → mesaj → kanal; sponsor, GMY, bölge müdürü, şube müdürü, departman müdürü, çalışan, İK iş ortağı | Tek tip toplu e-posta |
| 9.2 | Mesaj omurgası | Üç cümle her yerde aynı: gelişim amaçlı ve ücretten ayrık; devralınan seviye referans, taban değil; ilk yıl kalibrasyon yılı | "Yeni performans sistemi" ifadesi |
| 9.3 | Eğitimler | İK iş ortakları 1 gün; yöneticiler 90 dk çerçeve eğitimi (vaka + rol oyunu + 5 soruluk test, ≥ 4/5); çalışanlar 15 dk video + kılavuz; küratörler 1 saat | Slayt anlatımıyla yetinmek; eğitimsiz bölgeyi açmak (< %95) |
| 9.4 | Yardım masası ve SSS | Açılış ayında İK + BT; SSS canlı güncellenir; ilk 3 gün saatlik izleme | Soruları e-postada biriktirmek |
| 9.5 | Direnç izleme | Tamamlanma, itiraz, adalet anketi; düşük birime ziyaret | Direnci "ikna" ile çözmeye çalışmak; yapısal cevap (kanıt, süreç) vermemek |
| 9.6 | Kazanımları duyurma | İlk haritalar ve mentor eşleşmeleri yöneticilere hızlıca geri verilir; başarı hikâyeleri | Sonuçları İK'da tutmak |

**Çıkış kriteri:** Eğitim tamamlama ≥ %95 (yöneticiler), çerçeve testi ≥ 4/5; adalet anketi ≥ 3,8; SSS yayında.

## İP10 · Döngü kapanışı ve sürekli iyileştirme (3 hafta; Haziran)

| # | Adım | Yapılması gerekenler |
|---|---|---|
| 10.1 | Döngü raporu | Dağılımlar, kalite metrikleri, devralınan karşılaştırması, yönetici tutarlılığı, adalet anketi, yük istatistikleri |
| 10.2 | Revizyon listesi | Gösterge (ayırt etmeyenler), eşik (yığılma), katalizör (ilk sinyaller), süreç (süreler, formlar); önceliklendirilmiş |
| 10.3 | Kütüphane v1.1 | Değişiklikler sürüm kuralıyla; 2. döngü yeni sürümle açılır |
| 10.4 | Faz 2 kararları | E6, E7, E9; HRIS bağlantısı; performans + 9-kutu; ücret/terfi bağlantısı (kurul) |
| 10.5 | Dersler | 1 sayfa "ne işe yaradı, ne yaramadı"; 2. döngü takvimi |

**Kaçınılması gerekenler:** Raporu "başarı" diliyle yazmak; revizyonları döngü ortasında uygulamak; ilk döngü sonuçlarını kesin hüküm gibi kullanmak.

---

# D. Şablonlar ve kontrol listeleri

## D.1 İş paketi kapı kontrol listesi (genel)

- [ ] Çıkış kriterleri sayısal olarak sağlandı (kanıt: rapor/ekran görüntüsü)
- [ ] Bir sonraki paketin sahibi kapıyı onayladı
- [ ] Riskler güncellendi
- [ ] Değişiklik talepleri kaydedildi (uygulanmadı)
- [ ] Paydaş iletişimi yapıldı

## D.2 Çalıştay gündemi — davranışsal kart sıralama (2 saat)

0–10 amaç ve kurallar · 10–40 bireysel ayırma (zorunlu/önemli/gereksiz) · 40–70 grup uzlaşısı · 70–95 ilk 10 sıralama ve gerekçe · 95–110 sınır cümleleri · 110–120 kapanış ve sonraki adım.

## D.3 Çalıştay gündemi — şube rol tasarımı (3 saat)

0–15 ölçek ve gösterge kuralları · 15–45 BEI bulguları (üst vs orta dilim davranışları) · 45–90 C/D/E katmanı beceri seti (12–18) · 90–150 en kritik 6 beceri için gösterge yazımı · 150–170 kanıt türleri ve otomatik kural adayları · 170–180 kapanış; kalan göstergeler panel üyelerine ödev.

## D.4 İş analizi görüşme formu (küratör)

1. Servisin ana işleri (sıklıkla) · 2. Her iş için gereken bilgi/beceri · 3. Hata olursa etkisi · 4. "Çok iyi" olan ne farklı yapıyor · 5. Sıfırdan seviye 3'e süre · 6. Bugün bağımsız yapabilen kişi sayısı · 7. Başka serviste kullanım · 8. Hızlandıran davranış (katalizör) · 9. 3 yıl sonra önemi.

## D.5 Yönetici doğrulama karar kılavuzu (1 sayfa)

Kabul: somut, tarihli, doğrulanabilir, göstergenin seviyesinde · Ek bilgi: ne/ne zaman/sonuç eksik · Red: beyan, yargı, başka seviyeye ait, müşteri verisi içeriyor (maskelenmeli) · Her red gerekçeli · "Hak ediyor ama kanıt yok" → kanıt görevi.

## D.6 Haftalık durum raporu

Tamamlananlar · Gelecek hafta · Kapı durumu (İP bazında yüzde) · İlk 5 risk (olasılık × etki, sahibi, tetik) · Karar ihtiyacı · Kütüphane / profil / veri / sprint tamamlanma yüzdeleri.

## D.7 Go / No-Go listesi (29 Aralık)

- [ ] Davranışsal sözlük ve şube teknik kütüphanesi Aktif
- [ ] Ocak dalgası pozisyonlarının tamamı rol profiline bağlı
- [ ] Üretim verisi yüklü, doğrulama temiz, otomatik kanıtlar üretilmiş
- [ ] Sprint 1–5 kabul testleri ve seviye hesaplama testleri yeşil
- [ ] Prova tamamlandı, kritik hata sıfır
- [ ] İK iş ortakları ve dalga 1 yöneticileri eğitimli (≥ %95), çerçeve testi geçmiş
- [ ] Duyuru, SSS, yardım masası hazır
- [ ] Yedekleme/geri alma planı; bildirim altyapısı yük testinden geçmiş

## D.8 En sık 12 hata ve karşılığı (uygulayıcı için cep listesi)

| Hata | Karşılık |
|---|---|
| Önce yetkinlik listesi yazmak, sonra yapı | 1.1 ve 1.2 önce |
| 15+ çekirdek yetkinlik | Ayırt edicilik puanıyla kes |
| Tutumları yetkinlik yapmak | Davranış testi: gözlenebilir mi? |
| Araç adlarını beceri yapmak | Ortak havuz, "… ile … yapma" |
| "Yapabilir" göstergeleri | Geçmiş zaman, tek davranış, kanıt |
| Her hedefi 4 yapmak | "2 yıldır beklendiği gibi yapan kişi" kuralı |
| KPI'yı tek başına seviye 4 kanıtı saymak | Kalite göstergesi eşliği |
| "Hak ediyor ama kanıt yok" diye seviye vermek | Kanıt görevi |
| Döngü içinde eşik/gösterge değiştirmek | Sürüm kuralı; döngü sonu |
| Kalibrasyonda seviye yükseltmek / dağılım dayatmak | Sadece kanıt sorgulanır |
| Potansiyel etiketini açıklamak | Gelişim önerisi dili |
| Haritayı sıralama olarak yayımlamak | Gelişim alanı dili, önce yöneticiler |
