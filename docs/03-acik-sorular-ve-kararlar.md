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

| S17 | Teknoloji yığını | Kurumda zorunlu bir teknoloji var mı (.NET, Java, belirli veritabanı)? Barındırma kurum içi mi bulut mu? | Zorunluluk yoksa: TypeScript (Next.js) + PostgreSQL; mobil için PWA, gerekirse sonra native | |
| S18 | Çalışan ve kullanıcı sayısı | Toplam çalışan, yönetici ve İK kullanıcı sayısı? 360 için ortalama kaç değerlendirici? | Tasarım 10.000+ çalışan için ölçeklenir; 360'ta kişi başı 4–6 değerlendirici | |
| S19 | Organizasyon derinliği | Departman üstünde Direktörlük/Genel Müdür Yardımcılığı katmanı var mı? | Org yapısı serbest derinlikte ağaç olarak modellenir | |
| S20 | Potansiyel türü | Potansiyel tek puan mı, yoksa Uzmanlık / Liderlik potansiyeli ayrı mı raporlansın? | İki ayrı tür + genel puan (bkz. 05 dokümanı) | |
| S21 | Kanıt eşiği | Bir seviye "sahip" sayılmak için göstergelerin yüzde kaçı kanıtlı olmalı? Kanıt kaç ay geçerli? | %70 (zorunlu göstergeler %100); kanıt 24 ay geçerli | |
| S22 | 360 kapsamı | 360 sadece davranışsal yetkinlikler için mi, teknik beceriler için de mi? Değerlendirici seçimini kim yapar? | Davranışsal: herkes; teknik: sadece iç müşteri/akran gözlemi "gördüm/görmedim" düzeyinde; değerlendiriciyi yönetici seçer, çalışan 1–2 ekler | |
| S23 | Beceri toplama kanalı | 100+ departman için Excel yerine uygulama içi "Beceri Toplama" modülü ilk teslim olsun mu? | Evet, uygulamanın ilk modülü toplama portalı olsun | |

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
| 2026-10-19 | – | Teknik ve davranışsal tüm seviyelerde davranış göstergesi; tüm puanlar kanıtla ("yaptım/bildim/sahibim") | Emre Kaya | 05 dokümanı yazıldı |
