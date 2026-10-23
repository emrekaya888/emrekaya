# 03 · Açık Sorular ve Karar Kaydı

Her soru için **önerilen varsayılan** yazıldı. Karar verilince "Karar" sütunu doldurulur ve tasarım dokümanları güncellenir.

| # | Konu | Soru | Önerilen varsayılan | Karar |
|---|---|---|---|---|
| S1 | Ölçek ve kaynak | Kaç departman / servis / çalışan var? Mevcut bir İK sistemi (HRIS, bordro) var mı; organizasyon ve kişi verisi oradan mı gelecek? | Excel ile ilk yükleme, sonra düzenli CSV içe aktarma; API entegrasyonu 2. faz | 100+ departman, daha fazla servis. HRIS var; veri bağlantısı sonraya, şimdilik entegrasyona girilmeyecek (Excel/CSV ile yükleme). |
| S2 | Davranışsal ölçek | Davranışsal yetkinlikler teknikle aynı 1–5 sayısal ölçeği mi kullansın? Seviye adları farklı olsun mu? | Aynı 1–5 sayı (katalizör analizi için şart), adlar farklı: Gelişmekte / Uygular / Güçlü / Rol model / Kültür taşıyıcı | Kabul: aynı 1–5 sayı, farklı seviye adları. |
| S3 | Değerlendirme kaynakları | Öz + yönetici yeterli mi? Akran/360 eklenecek mi (hangi yetkinlikler için)? Seviye 4–5 için üst doğrulama olsun mu? | Öz + yönetici zorunlu; 360 sadece davranışsal ve sadece yönetici rolleri için; 4–5 için üst yönetici doğrulaması | 360 olacak. Seviye 5 için üst doğrulama. |
| S4 | Mutabakat ve itiraz | Anlaşmazlıkta nihai karar mercii kim? Fark kaç seviye olunca görüşme zorunlu? | Üst yönetici karar verir, İK gözlemci; kritik rollerde kalibrasyon komitesi; fark ≥ 2 → zorunlu görüşme | İK + üst yönetici birlikte. |
| S5 | Ücret/terfi bağlantısı | Değerlendirme sonuçları ücret, prim veya terfiye bağlanacak mı? Ne zaman? | İlk 2 döngü gelişim amaçlı ve ayrık; terfide "zorunlu beceri eşiği" 3. döngüden itibaren | Ayrık tutulacak. |
| S6 | Hedef seviye düzeyi | Hedefler rol bazlı mı, pozisyon bazlı istisna olsun mu? Kademe (Uzman / Kıdemli / Baş) ayrımı var mı? | Rol bazlı + pozisyon istisnası; kademeler ayrı rol olarak tanımlanır | |
| S7 | Kritiklik | Kritik beceri/rol puanlamasını kim yapar? Eşik ve ağırlıklar? Kaç kritik rol bekleniyor? | Departman müdürü + İK birlikte; varsayılan ağırlıklar `02` dokümanında; kritik rol sayısı toplam rollerin %10–15'i | |
| S8 | Teknoloji | Web uygulaması mı, mobil de mi? Bulut mu kurum içi sunucu mu? SSO var mı (Microsoft 365 / Google)? Kullanıcı sayısı? Tercih edilen teknoloji var mı? | Web (mobil uyumlu); bulut; SSO varsa Entra ID; stack önerisi: TypeScript + React + PostgreSQL (karar sonrası netleşir) | Web + mobil. Stack kararı bekliyor (bkz. S17). |
| S9 | Eğitim kataloğu | Mevcut bir LMS / eğitim kataloğu var mı? Plan eylemleri buna bağlanacak mı? | Sistem içinde basit katalog; LMS varsa 2. fazda bağlantı | Eğitim/LMS şimdilik kapsam dışı. |
| S10 | KVKK ve gizlilik | Değerlendirme verisi kaç yıl saklanacak? Akran girdileri anonim mi? Çalışan kendi verisini dışa aktarabilsin mi? | 5 yıl saklama; akran anonim; çalışan kendi profilini PDF alabilir | |
| S11 | Potansiyel / 9-kutu | Performans puanı başka bir sistemden gelecek mi? 9-kutu isteniyor mu? | 9-kutu istenir; performans puanı İK tarafından elle girilir (1–5) | Potansiyel bu sistemde ölçülecek ve değerlendirmeye eklenecek. Performans sonra; 9-kutu ayrıca. |
| S12 | Teknik beceri toplama | Şablon + çalıştay yeterli mi? Her servis için kaç beceri sınırı? Onay zinciri? | Şablon + 1 saatlik çalıştay/servis; 8–20 beceri; yönetici → İK → müdür onayı | |
| S13 | Döngü sıklığı | Yıllık ana + 6 aylık ara döngü uygun mu? İşe girişte 90 gün değerlendirmesi olsun mu? | Evet / Evet | |
| S14 | Dil | Sadece Türkçe mi, İngilizce de gerekli mi? | Türkçe; metinler çok dile hazır tasarlanır | |
| S15 | Mentorluk | Mentor eşleştirme sistemde resmi bir süreç olsun mu? Mentor başına limit? | Evet; mentor başına en fazla 3 menti | |
| S16 | Yetkinlik envanteri araması | Yöneticiler başka servislerdeki kişilerin beceri seviyelerini arayabilsin mi (proje kadrolama)? | Evet, sadece "seviye ≥ 3" bilgisiyle, puan detayı olmadan | |

| S17 | Teknoloji yığını | Kurumda zorunlu bir teknoloji var mı (.NET, Java, belirli veritabanı)? Barındırma kurum içi mi bulut mu? | Zorunluluk yoksa: TypeScript (Next.js) + PostgreSQL; mobil için PWA, gerekirse sonra native | Kısıt yok → TypeScript (Next.js) + PostgreSQL, PWA (bkz. 07). |
| S18 | Çalışan ve kullanıcı sayısı | Toplam çalışan, yönetici ve İK kullanıcı sayısı? 360 için ortalama kaç değerlendirici? | Tasarım 10.000+ çalışan için ölçeklenir; 360'ta kişi başı 4–6 değerlendirici | 6.400 çalışan, 600 yönetici. |
| S19 | Organizasyon derinliği | Departman üstünde Direktörlük/Genel Müdür Yardımcılığı katmanı var mı? | Org yapısı serbest derinlikte ağaç olarak modellenir | |
| S20 | Potansiyel türü | Potansiyel tek puan mı, yoksa Uzmanlık / Liderlik potansiyeli ayrı mı raporlansın? | İki ayrı tür + genel puan (bkz. 05 dokümanı) | Uzmanlık ve liderlik potansiyeli ayrı. |
| S21 | Kanıt eşiği | Bir seviye "sahip" sayılmak için göstergelerin yüzde kaçı kanıtlı olmalı? Kanıt kaç ay geçerli? | %70 (zorunlu göstergeler %100); kanıt 24 ay geçerli | %70 ve 24 ay kabul. |
| S22 | 360 kapsamı | 360 sadece davranışsal yetkinlikler için mi, teknik beceriler için de mi? Değerlendirici seçimini kim yapar? | Davranışsal: herkes; teknik: sadece iç müşteri/akran gözlemi "gördüm/görmedim" düzeyinde; değerlendiriciyi yönetici seçer, çalışan 1–2 ekler | |
| S23 | Beceri toplama kanalı | 100+ departman için Excel yerine uygulama içi "Beceri Toplama" modülü ilk teslim olsun mu? | Evet, uygulamanın ilk modülü toplama portalı olsun | Tüm sistem birlikte geliştirilecek; portal modüllerden biri. |

| S24 | Şube ağı büyüklüğü | Kaç bölge müdürlüğü ve kaç şube var? Şube sınıfları (büyük/orta/küçük) tanımlı mı? | Hedef seviyeler şube sınıfına göre istisna alır | 15 bölge, 450 şube. Şube sınıfları segment bazlı: Özel Bankacılık, KOBİ, Ticari, Kurumsal. |
| S25 | Şube rol ve kademeleri | Portföy rollerinin resmi kademe adları (Yetkili / Yönetici / Kıdemli …)? Gişe ve MİY kademeleri? | 06 dokümanındaki örnek kademeler | Gişe = Bireysel Satış Temsilcisi; MİY = Müşteri İlişkileri; portföyler = Bireysel Satış, KOBİ Satış, Ticari Satış, Kurumsal Satış. Kademe adları S25b. |
| S26 | Fonksiyonel hat ve İK iş ortağı | Portföy yöneticileri bölge segment yöneticilerine fonksiyonel bağlı mı? Her bölgede İK iş ortağı var mı? | Evet / bölge başına 1 İK iş ortağı | Şube müdürleri bölge müdürüne bağlı; portföyler fonksiyonel bağlı değil. Her bölgenin merkezden bir İK iş ortağı var. |
| S27 | Sistem verisi erişimi | Satış/CRM KPI, kredi tahsis geri dönüşü, şikayet, teftiş bulgusu, lisans ve yetki limiti verileri CSV ile alınabilir mi? Hangi sıklıkta? | Aylık CSV; entegrasyon 2. faz | Alınabilir. |
| S28 | Mevcut davranışsal değerlendirme | Mevcut soft skill yetkinlik listesi ve son dönem sonuçları paylaşılabilir mi? Hangi ölçekte? Takvimi? | Yeni sözlüğe eşlenir, devralınan dönem olarak içe aktarılır | 3'lü ölçek: iyi olabilirsin / iyisin / çok iyisin. Eşleme S34. |
| S29 | Şube becerileri için eşik sahibi | KPI göstergelerinin seviye eşiklerini segment GMY'leri mi belirler? | Evet, İK kolaylaştırır | Evet. |
| S30 | Pilot kapsamı | Pilot: 2 bölge (~60 şube) + 3 GM departmanı uygun mu? | Evet | Pilot yok; tümü birlikte (prova döngüsü + dalgalı açılış). |

| S25b | Kademe adları | Rol aileleri içindeki kademe adları (Yetkili / Yönetici / Kıdemli; Temsilci / Kıdemli Temsilci)? | 06 §2 tablosundaki öneri | |
| S31 | Özel bankacılık ve bizbize | Özel bankacılık portföyünün resmi rol adı nedir? Bizbize bankacılık Bireysel Satış içinde mi ayrı rol mü? | Özel bankacılık: "Özel Bankacılık Satış"; bizbize: Bireysel Satış alt türü | |
| S32 | Kurumsal şube ekipleri | Kurumsal şubelerde hangi ekipler var (sadece Kurumsal Satış + Müşteri İlişkileri mi)? | Kurumsal Satış + Müşteri İlişkileri + BST | |
| S33 | Açılış takvimi | İlk döngü hangi ay açılacak? Mevcut davranışsal değerlendirme takvimiyle çakışıyor mu? | Mevcut takvimle hizalanır; 3 dalga, 2'şer hafta | Ocak 2027. Akış: 08 dokümanı |
| S34 | 3'lü ölçek eşlemesi | İyi olabilirsin → 2, İyisin → 3, Çok iyisin → 4 eşlemesi uygun mu? Devralınan seviyenin "taban olmadığı" çalışana duyurulacak mı? | Evet / Evet | |
| S35 | Alan uzmanları | Seviye 5 teknik doğrulaması için segment GM departmanları (Bireysel, KOBİ, Ticari, Kurumsal, Özel) uzman atayabilir mi? | Segment başına 2–3 uzman | |

| S36 | v1.1 eklemeleri | 01 §9'daki on ekleme (E1–E10) ve faz atamaları uygun mu? Özellikle Faz 2 olanlar (gelişim görevleri pazarı, değerlendirme merkezi, stratejik beceri planı) | Ocak eklemeleri kabul; Faz 2 eklemeleri ilk döngü sonunda karar | |
| S37 | Danışma sorusu | 360 formundaki "kime sorarsınız" sorusu (E3) KVKK aydınlatma metnine eklenecek; sonuç kişiye puan olarak yansımayacak. Uygun mu? | Evet | |
| S38 | Yönetici tutarlılık göstergesi | Yönetici tutarlılığının L7 liderlik göstergesi olarak otomatik puanlanması (E5) yöneticilere önceden duyurulacak. Uygun mu? | Evet, ilk döngüde "bilgilendirme amaçlı", 2. döngüde gösterge | |

| S39 | Kapsam küçültme | Sade sürüm (v0) önce İK Grup Müdürlüğü'nün 5 müdürlüğünde; 360, potansiyel, otomatik kanıt, yedekleme ve işe alım v0 dışı; halkalar halinde genişleme | 13 dokümanı | Karar: Evet (23.10.2026) |

## Karar kaydı

| Tarih | # | Karar | Veren | Not |
|---|---|---|---|---|
| 2026-10-19 | S1 | 100+ departman; HRIS bağlantısı sonraya | Emre Kaya | Excel/CSV ile başlangıç |
| 2026-10-19 | S2 | Aynı 1–5 ölçek, farklı adlar | Emre Kaya | |
| 2026-10-19 | S3 | 360 var; seviye 5 üst doğrulama | Emre Kaya | |
| 2026-10-19 | S4 | İtirazda İK + üst yönetici | Emre Kaya | |
| 2026-10-19 | S5 | Ücret/terfiden ayrık | Emre Kaya | |
| 2026-10-19 | S8 | Web + mobil | Emre Kaya | Stack S17'de |
| 2026-10-19 | S9 | Eğitim kapsam dışı | Emre Kaya | |
| 2026-10-19 | S11 | Potansiyel ölçülecek; performans ve 9-kutu sonra | Emre Kaya | |
| 2026-10-19 | S17 | Teknoloji kısıtı yok | Emre Kaya | TS/Next.js/PostgreSQL/PWA |
| 2026-10-19 | S18 | 6.400 çalışan, 600 yönetici | Emre Kaya | |
| 2026-10-19 | S20 | Uzmanlık ve liderlik potansiyeli ayrı | Emre Kaya | |
| 2026-10-19 | S21 | %70 / 24 ay | Emre Kaya | |
| 2026-10-19 | S23 | Tüm sistem | Emre Kaya | |
| 2026-10-19 | – | Şube ağı (bölge → şube → portföy ekipleri) aynı yapıya dahil; ortak şube teknik beceri seti; mevcut davranışsal değerlendirme devralınır | Emre Kaya | 06 dokümanı yazıldı |
| 2026-10-20 | S24 | 15 bölge, 450 şube; sınıflar Özel/KOBİ/Ticari/Kurumsal | Emre Kaya | |
| 2026-10-20 | S25 | Resmi rol adları alındı | Emre Kaya | Kademe adları bekliyor |
| 2026-10-20 | S26 | Tek hat (şube müdürü); bölge İK iş ortağı var | Emre Kaya | Fonksiyonel hat kaldırıldı |
| 2026-10-20 | S27 | Sistem verisi CSV ile alınabilir | Emre Kaya | |
| 2026-10-20 | S28 | Mevcut davranışsal 3'lü ölçek | Emre Kaya | Eşleme önerisi S34 |
| 2026-10-20 | S29 | KPI eşiklerini segment GMY belirler | Emre Kaya | |
| 2026-10-20 | S30 | Pilot yok, tek seferde | Emre Kaya | Prova döngüsü + 3 dalga |
| 2026-10-20 | S33 | Açılış Ocak 2027 | Emre Kaya | 08 uygulama akışı yazıldı |
| 2026-10-20 | S25b, S31, S32 | Rol kademeleri şimdilik detaylandırılmayacak; varsayılanlar kullanılır | Emre Kaya | |
| 2026-10-23 | S39 | Kapsam küçültüldü: önce İK Grup Müdürlüğü için sade sürüm (v0), öğrenimle genişleme; S30 ve S33 bu kararla değişti | Emre Kaya | 13 dokümanı |
| 2026-10-23 | – | Uygulama geliştirme (sprint 1) tamamlandı | Claude | 07 |
| 2026-10-20 | – | Araştırma kaynaklı v1.1 eklemeleri (E1–E10) tasarıma işlendi; onay S36–S38 | Claude (öneri) | 01 §9 |
| 2026-10-19 | – | Teknik ve davranışsal tüm seviyelerde davranış göstergesi; tüm puanlar kanıtla ("yaptım/bildim/sahibim") | Emre Kaya | 05 dokümanı yazıldı |
