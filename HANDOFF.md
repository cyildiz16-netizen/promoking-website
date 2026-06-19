# PROMOKING WEB SİTESİ — DEVAM DOSYASI (HANDOFF)

Bu zip, Promoking promosyon ürünleri sitesinin **eksiksiz son halidir**. Yeni bir
sohbette devam etmek için bu dosyayı yükleyip aşağıdaki promptu yapıştırabilirsin.

---

## YENİ SOHBET İÇİN DEVAM PROMPTU

Promoking adlı promosyon ürünleri firmasının web sitesi üzerinde çalışıyorum. Kodlama
bilmiyorum; tüm değişiklikleri sen yapıp dosyaları bana hazır veriyorsun. İletişim Türkçe.
Ekteki zip sitenin güncel halidir.

**Marka:** Magenta #C4176F → açık pembe #E85AA1; koyu zemin #111; fontlar Sora (başlık) +
Inter (gövde); slogan "Manufactured to Matter." İletişim: bilgi@promokingtr.com,
+90 530 899 59 95, WhatsApp wa.me/905308995995. Site bilingual (TR/EN): `data-en`
attribute + JS dil toggle + localStorage (`pk_lang`), mobilde hamburger menü.

**Ana navigasyon (DEĞİŞTİRİLMEYECEK, 6 öğe):** Ana Sayfa, Ürünler, Üretim, Referanslar,
Hakkımızda, İletişim.

**Ürünler bölümü** bir **kategori hub'ıdır** (urunler.html); her kategori ayrı
sayfaya gider. E-ticaret değil, kurumsal **lead-gen** — fiyat YOK. Her ürün kartı: görsel +
ad + ürün kodu + "Teklif Al" (iletişime gider) + WhatsApp. Sayfalarda koyu kategori
banner'ı, arama kutusu, sticky WhatsApp. Premium/Avrupa B2B estetiği, mobil uyumlu.
Görseller base64 DEĞİL; `images/{kategori}/` altında ayrı dosyalar (performans için).

**Kurallar:** Proboss ürün kodları referans olarak görünür kalır; in-house ürünlere yeni
kod/Promoking kodlama sistemi EKLENMEZ (kodsuz gösterilir). Ürünler "bizim/tedarikçi" diye
ayrılmaz — tek birleşik katalog. Ürün olmayan görseller atlanır.

---

## PAKET İÇERİĞİ

### Ana sayfalar (5)
- promoking-mockup.html — Ana sayfa
- uretim.html — Üretim
- referanslar.html — Referanslar (22 marka)
- hakkimizda.html — Hakkımızda
- iletisim.html — İletişim (Netlify form + WhatsApp)

### Ürünler bölümü (yeni tasarım)
- urunler.html — **KATEGORİ HUB**
- Kategori sayfaları (9 dolu + 1 placeholder), toplam ~387 ürün:
  - kalemler.html (36) · ajanda-defterler.html (100) · termos-matara.html (47)
  - teknolojik-urunler.html (102) · otel-bar.html (32) · kurumsal-hediye-setleri.html (54)
  - pvc-urunler.html (4) · kaucuk-urunler.html (6) · plastik-urunler.html (6) → in-house, kodsuz
  - tekstil-urunleri.html → **placeholder (hazırlanıyor)**, kaynak bekliyor
- images/ — tüm ürün görselleri (640px beyaz kare, kategori klasörleri)

### _kaynak/ (gelecekte yeniden üretim için)
- catalog_local.json — çekilmiş tüm ürün verisi (ad, kod, görsel yolu)
- build_catalog.py — hub + kategori sayfalarını üreten script

## KATEGORİ KAYNAK EŞLEŞMESİ
- kalemler ← proboss/plastik-kalemler
- ajanda-defterler ← proboss tarihli-ajandalar + defterler + organizerler
- termos-matara ← proboss/termoslar
- teknolojik-urunler ← proboss teknolojik-urunler + powerbank
- kurumsal-hediye-setleri ← proboss/luks-hediyelik-setler
- otel-bar ← kardeş firma manufacturerplastic.com (otel-bar koleksiyonu)
- pvc / kaucuk / plastik ← mevcut Promoking in-house ürünleri
- tekstil ← (henüz kaynak yok)

## NETLIFY KURULUMU
Zip içeriğinin TAMAMINI (tüm .html + images/ klasörü) Netlify'a klasör olarak sürükle-bırak
yap. Tek seferde tüm site yayında olur. (HANDOFF.md ve _kaynak/ yüklenmese de olur.)

## SIRADAKİ OLASI İŞLER
- Tekstil kategorisini doldurmak (kaynak bekliyor)
- SEO/meta açıklamaları, Open Graph, favicon
- (İsteğe bağlı) proboss kategorilerinde daha fazla ürün / sayfalama

---

## FAZ 3 — JSON-GÜDÜMLÜ MİMARİ (build-time pre-render)

**Mimari:** Tek doğruluk kaynağı `/data/*.json`. Deploy öncesi `node generate.js`
çalıştırılır; JSON'dan **gerçek statik HTML kartları** üretilir (SEO-güvenli).
Tarayıcı tarafı arama/filtre (`filterProd`) yalnızca progressive enhancement.

**İŞ AKIŞI (her değişiklikte):** 1) `/data/*.json` düzenle → 2) `node generate.js` → 3) Netlify'a deploy.
> Deploy etmeden önce `node generate.js` ÇALIŞTIRILMALI; yoksa değişiklik sayfalara yansımaz.

**Veri katmanı (`/data/`):**
- `products.json` — 387 ürün, tam şema (id, code, name_tr/en, category, categorySlug, image,
  description_tr/en, tags, active, featured, sortOrder, seo*_tr/en, whatsappMessage_tr/en, search).
- `categories.json` (10) · `references.json` (22) · `blog.json` (3 placeholder) · `catalogs.json` (1, pasif).
- Kök `products.json` KALDIRILDI (canonical artık `/data/products.json`).

**Üretici:** `generate.js` (Node). 9 kategori sayfasında `<!-- GEN:PRODUCTS:* -->`, referanslar.html'de
`GEN:REFS`, blog.html'de `GEN:BLOG`, katalog.html'de `GEN:CATALOG` marker'ları arasını doldurur.
Banner ürün sayacını günceller. tekstil-urunleri.html'de pcGrid yok → atlanır (0 ürün, "yakında").

**Yeni sayfalar (navigasyona EKLENMEDİ — bilinçli):**
- `blog.html` — yazı listesi (statik, üretilen). `katalog.html` — katalog listesi/boş-durum (statik).
- `blog-detay.html` — tek yazı; `?slug` ile `data/blog.json`'dan RUNTIME render; `noindex,follow`,
  sitemap'te değil, noscript fallback'li.
- Sitemap: 16 → **18** (blog.html, katalog.html eklendi; detay/yazılar eklenmedi).

**Referanslar:** referanslar.html artık `references.json`'dan üretiliyor; 6 gerçek base64 logo
`images/references/`'e ayrıldı, gerisi metin-baş-harf placeholder (logo:null).

**Doğrulama (hepsi yeşil):** 19 sayfa · 387/387 aktif ürün render · 10 kategori · 22/22 referans ·
0 kırık görsel/link/JSON-referansı · 387 paramlı Teklif Al + 387 WhatsApp linki · sitemap 18 URL.

**Detaylı içerik yönetimi:** bkz. `CMS_READINESS.md` (ürün ekle/gizle/öne çıkar, blog, referans, Decap CMS hazırlığı).
