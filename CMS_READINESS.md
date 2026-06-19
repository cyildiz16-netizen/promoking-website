# PROMOKING — CMS Readiness & İçerik Yönetimi Rehberi

**Tarih:** 18.06.2026
**Mimari:** JSON-güdümlü statik site. Tek doğruluk kaynağı `/data/*.json`.
Sayfalar **build-time** (deploy öncesi) `node generate.js` ile JSON'dan üretilir →
yayınlanan HTML **gerçek statik kartlar** içerir (SEO-güvenli). Tarayıcı tarafı
arama/filtre yalnızca progressive enhancement'tır.

---

## 1. Hangi dosyalar CMS ile yönetilecek?

| Veri | Dosya | Ne yönetir |
|---|---|---|
| Ürünler | `/data/products.json` | 387 ürün, kategori, görsel, açıklama, SEO, durum |
| Kategoriler | `/data/categories.json` | Kategori adları, sayfalar, sıralama |
| Referanslar | `/data/references.json` | Müşteri/marka logoları ve sektörleri |
| Blog | `/data/blog.json` | Blog yazıları |
| Kataloglar | `/data/catalogs.json` | Dijital katalog / flipbook bağlantıları |

İleride **Decap CMS** (eski adı Netlify CMS) tam olarak bu 5 dosyayı düzenleyecek.
Bu aşamada admin paneli **kurulmadı**; yapı buna hazır.

---

## 2. KRİTİK: Deploy öncesi tek komut

Herhangi bir `/data/*.json` dosyasını değiştirdikten sonra, **deploy etmeden önce**
proje kök dizininde şunu çalıştır:

```bash
node generate.js
```

Bu komut JSON'lardan kategori, referans, blog ve katalog sayfalarındaki statik
kartları yeniden üretir. **Çalıştırmazsan değişikliklerin sayfalara yansımaz.**
(Tasarıma, navigasyona, head/SEO etiketlerine dokunmaz — yalnızca `GEN:*` marker'ları
arasını günceller.)

Akış her zaman: **1) JSON'u düzenle → 2) `node generate.js` → 3) Netlify'a deploy.**

> Gereksinim: Bilgisayarında Node.js kurulu olmalı (nodejs.org). İleride git-tabanlı
> Netlify dağıtımına geçilirse, `node generate.js` Netlify "build command" olarak
> ayarlanıp otomatik çalışır ve bu manuel adım ortadan kalkar.

---

## 3. Bir ürün nasıl EKLENİR?

`/data/products.json` içindeki `products` dizisine yeni bir kayıt ekle:

```json
{
  "id": "kalemler-037",
  "code": "YK-100",
  "name_tr": "YK-100 Metal Kalem",
  "name_en": "YK-100 Metal Pen",
  "category": "Kalemler",
  "categorySlug": "kalemler",
  "image": "images/kalemler/YK-100.jpg",
  "description_tr": "YK-100 Metal Kalem, Promoking'in Kalemler kategorisindeki kurumsal promosyon ürünüdür.",
  "description_en": "YK-100 Metal Pen is a corporate promotional product in Promoking's Pens category.",
  "tags": ["metal","kalem","kalemler"],
  "active": true,
  "featured": false,
  "sortOrder": 370,
  "seoTitle_tr": "YK-100 Metal Kalem | Kalemler | Promoking",
  "seoTitle_en": "YK-100 Metal Pen | Pens | Promoking",
  "seoDescription_tr": "YK-100 Metal Kalem — Kalemler. Logo baskılı üretim ve hızlı teklif.",
  "seoDescription_en": "YK-100 Metal Pen — Pens. Custom logo printing and fast quotes.",
  "whatsappMessage_tr": "Merhaba, YK-100 Metal Kalem ürünü hakkında teklif almak istiyorum. (Kod: YK-100 · Kategori: Kalemler)",
  "whatsappMessage_en": "Hello, I'd like to request a quote for YK-100 Metal Pen. (Code: YK-100 · Category: Pens)",
  "search": "yk-100 metal kalem yk-100"
}
```

Kurallar:
- Görseli `images/<categorySlug>/` altına koy ve `image` yolunu eşleştir.
- `categorySlug` mevcut bir kategori olmalı (categories.json'daki slug'lardan biri).
- Kodu olmayan ürün için `code` ve `whatsappMessage`'daki `(Kod: …)` kısmını boş bırak — geçerlidir.
- Sonra `node generate.js` çalıştır.

## 4. Bir ürün nasıl GİZLENİR?

İlgili ürünün `"active": true` değerini `"active": false` yap, `node generate.js` çalıştır.
Pasif ürünler **hiçbir sayfada görünmez** ve sayaçlara dahil edilmez. (Silmeye gerek yok.)

## 5. Bir ürün nasıl ÖNE ÇIKARILIR (featured)?

İlgili ürünün `"featured": false` değerini `"featured": true` yap, `node generate.js` çalıştır.
`featured: true` olan ürünler, kendi kategori sayfasının **en başına** taşınır (kart tasarımı
ve grid aynı kalır — sadece sıralama değişir). Birden fazla featured ürün varsa kendi
aralarında `sortOrder`'a göre sıralanır.

## 6. Görsel / ad / kod / kategori değişikliği

Sadece JSON kaydındaki ilgili alanı düzenle (`image`, `name_tr/en`, `code`, `categorySlug`),
`node generate.js` çalıştır. **HTML kartlarını elle düzenleme — onlar JSON'dan üretiliyor.**

## 7. Blog yazısı nasıl EKLENİR?

`/data/blog.json` içindeki `posts` dizisine yeni kayıt ekle (`slug`, `title_tr/en`, `date`,
`category`, `excerpt_tr/en`, `content_tr/en`, `featuredImage`, `active`, `featured`, SEO alanları).
`active: true` yap, `node generate.js` çalıştır. Yazı `blog.html` listesine eklenir ve
`blog-detay.html?slug=<slug>` adresinden okunur.
(Not: Blog şu an ana navigasyonda değildir — bilinçli. Hazır olunca eklenecek.)

## 8. Referanslar nasıl GÜNCELLENİR?

`/data/references.json` içindeki kaydı düzenle. Gerçek logo için dosyayı
`images/references/` altına koy ve `"logo": "images/references/dosya.png"` yaz; logosuz
referanslar için `"logo": null` bırak ve `"initials"` (ör. "MSK") baş harfleri görünür.
`active`/`featured`/`sortOrder` ile görünürlük ve sırayı yönet. `node generate.js` çalıştır.

## 9. Katalog nasıl yayınlanır?

`/data/catalogs.json` kaydında `flipbookUrl` veya `pdfUrl` doldur ve `"active": true` yap.
`node generate.js` çalıştır; `katalog.html`'de "Kataloğu Aç" butonu görünür. (Katalog da
şu an navigasyonda değildir.)

---

## 10. İleride Decap CMS kurulumu (özet, şimdi yapılmıyor)

Decap CMS bu yapı üzerine sorunsuz oturur:
1. Git-tabanlı Netlify dağıtımına geçilir (sürükle-bırak yerine GitHub repo).
2. `/admin/` altında Decap arayüzü + `config.yml` eklenir; collection'lar `/data/*.json`
   dosyalarını "files/list" olarak işaret eder.
3. Netlify build command: `node generate.js`.
4. Akış: Decap'te düzenle → git'e commit → Netlify build (`node generate.js`) → statik HTML
   yeniden üretilip yayınlanır. Manuel adım kalmaz, SEO-güvenli statik çıktı korunur.

Örnek collection eşlemesi (referans, ileride config.yml içine):
`products → /data/products.json`, `blog → /data/blog.json`,
`references → /data/references.json`, `catalogs → /data/catalogs.json`.
