# Yetkinlik Yönetim Sistemi (YYS)

Kurumun teknik beceri ve davranışsal yetkinliklerini **tespit, değerlendirme, mutabakat, gelişim planlama, ölçümleme, kritik rol/yetkinlik ve yedekleme** süreçleriyle uçtan uca yöneten uygulama.

Kapsam: Genel Müdürlük departmanları (100+) ve şube ağı (bölge → şube → portföy ekipleri); 6.400 çalışan, 600 yönetici.

**Güncel kapsam (23.10.2026):** önce İK Grup Müdürlüğü için sade sürüm (v0), bkz. `docs/13-sade-surum-ik-grup.md`; 01–12 hedef tasarımdır.

Tasarım dokümanları `docs/` altında, uygulama `app/` altındadır. Sprint 1 (organizasyon, kişi, rol/pozisyon, yetki, CSV içe aktarma) ve sprint 2 (yetkinlik kütüphanesi) tamamlanmıştır; sonraki sprintler 13 numaralı dokümandaki v0 planını izler.

## Uygulamayı çalıştırma

```bash
cd app
cp .env.example .env            # DATABASE_URL ve SESSION_SECRET
npm install
npm run db:push                 # şemayı PostgreSQL'e uygular
npm run db:seed                 # İK admin (admin@banka.local / Admin123!) ve örnek organizasyon
npm run db:seed:library         # seviye tanımları, kanıt türleri ve 3 örnek yetkinlik (göstergeli)
npm run dev                     # http://localhost:3000
npm test                        # iş kuralı ve içe aktarma testleri
```

PostgreSQL 16 gerekir. Küçük kurulumlar için **Kurulum** sayfasından birim, rol, pozisyon, kişi ve giriş hesabı elle eklenip çıkarılabilir; toplu yükleme için "İçe aktarma" sayfası (sıra: organizasyon → roller → pozisyonlar → kişiler).

| Doküman | İçerik |
|---|---|
| [docs/YYS-Tasarim-Dokumani.pdf](docs/YYS-Tasarim-Dokumani.pdf) | **Tüm dokümanların tek PDF sürümü** (kapak, içindekiler, 00–12 ve Ek A) |
| [docs/YYS-Proje-Yonetim-Modeli.pdf](docs/YYS-Proje-Yonetim-Modeli.pdf) | **Proje yönetim modeli ve uygulama kılavuzunun ayrı PDF sürümü** (34 sayfa) |
| [docs/Yetkinlik-Yonetimi-Ogrenme-Raporu.pdf](docs/Yetkinlik-Yonetimi-Ogrenme-Raporu.pdf) | **Öğrenme raporunun ayrı PDF sürümü** (24 sayfa) |
| [docs/01-yapi-tasarimi.md](docs/01-yapi-tasarimi.md) | Kavramsal çerçeve, modüller, seviye ölçeği, süreç akışları, metrikler, kritik rol/yedekleme, işe alım bağlantısı, yol haritası |
| [docs/02-veri-modeli.md](docs/02-veri-modeli.md) | Varlıklar, alanlar, ilişkiler, durum makineleri, hesaplama formülleri |
| [docs/03-acik-sorular-ve-kararlar.md](docs/03-acik-sorular-ve-kararlar.md) | Karar gerektiren konular, önerilen varsayılanlar, karar kaydı |
| [docs/04-davranissal-yetkinlik-onerisi.md](docs/04-davranissal-yetkinlik-onerisi.md) | Ekibin seçeceği davranışsal yetkinlikler için aday sözlük ve seviye çıpaları |
| [docs/05-kanit-gosterge-ve-potansiyel-modeli.md](docs/05-kanit-gosterge-ve-potansiyel-modeli.md) | Davranış göstergesi yapısı, kanıt modeli ("yaptım" ilkesi), seviye hesaplama, 360 tasarımı, potansiyel modeli |
| [docs/06-sube-agi-yapisi.md](docs/06-sube-agi-yapisi.md) | Bölge → şube → portföy ekipleri; ortak şube teknik beceri seti, segment becerileri, hedef matrisi, bankacılık kanıt türleri, çift hat değerlendirme, üç kademeli kalibrasyon, ölçek hesabı |
| [docs/07-teknik-mimari.md](docs/07-teknik-mimari.md) | Teknoloji yığını, kod yapısı, yetkilendirme, içe aktarma, güvenlik, teslim planı |
| [docs/09-surecler.md](docs/09-surecler.md) | Süreç kitabı: 19 süreç; her biri için tetikleyici, adımlar (kim ne yapar), kurallar, dikkat noktaları, çıktı ve ölçüt |
| [docs/13-sade-surum-ik-grup.md](docs/13-sade-surum-ik-grup.md) | **Sade sürüm (v0) kapsamı:** İK Grup Müdürlüğü ile başlangıç; ne var/ne yok, sadeleştirilmiş kütüphane ve döngü, sprintler, takvim, öğrenim ölçütleri ve genişleme kriteri |
| [docs/12-proje-yonetim-modeli.md](docs/12-proje-yonetim-modeli.md) | Proje yönetim modeli ve uygulama kılavuzu: yönetici özeti, yönetişim, RACI, kalite kapıları; İP0–İP10 iş paketleri, her adımda yapılacaklar, kaçınılacaklar ve örnekler; şablonlar ve kontrol listeleri |
| [docs/11-ogrenme-raporu.md](docs/11-ogrenme-raporu.md) | Öğrenme raporu: yetkinlik yönetiminin kuramı, araştırma dayanakları, dünya örnekleri, tuzaklar, güncel sektör raporları (WEF, Deloitte, LinkedIn, Gartner, Gallup, Mercer, Bersin, McKinsey, CIPD), ek yöntemler ve araştırma kanıtı, tasarımın ilkelere eşlemesi; sözlük, kaynakça, sınama soruları |
| [docs/10-yontem-kilavuzu.md](docs/10-yontem-kilavuzu.md) | Danışman yöntem kılavuzu: yetkinlik seçim yöntemi, teknik beceri tespit yöntemi, BARS gösterge geliştirme, anket ve form tasarımları (örnek maddelerle), veri toplama planı, KPI eşik yöntemi, değerlendirici hataları ve eğitimi, psikometrik kontroller, iletişim, KVKK |
| [docs/08-uygulama-akisi.md](docs/08-uygulama-akisi.md) | Ocak 2027 açılışına giden adım adım uygulama akışı: her adımda yapılacaklar, dikkat edilecekler, çıktı ve çıkış kriteri; sprint takvimi; döngü işletimi |
| [docs/sablonlar/teknik-beceri-toplama-sablonu.md](docs/sablonlar/teknik-beceri-toplama-sablonu.md) | Müdür ve yöneticilerden teknik beceri toplamak için şablon, çalıştay akışı ve kalite kriterleri |
| [docs/sablonlar/teknik-beceri-toplama.csv](docs/sablonlar/teknik-beceri-toplama.csv) | Aynı şablonun Excel'e açılabilir CSV sürümü |
