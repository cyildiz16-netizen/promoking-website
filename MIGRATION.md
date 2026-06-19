# PROMOKING — Wix → Netlify Migrasyon Hazırlık Raporu

**Tarih:** 18.06.2026 · **Durum:** Hazırlık tamam, redirect'ler HENÜZ AKTİF DEĞİL.
**Hedef:** Domain Netlify'a geçtiğinde eski Wix linkleri ve SEO değeri kopmadan, sorunsuz bir kesişim (cutover).

---

## 1. Mevcut Wix URL yapısı (canlı siteden doğrulandı)

Domain bugün hâlâ Wix'i sunuyor. Aşağıdaki slug'lar canlı ana sayfa ve arama
sonuçlarından **gerçek olarak** çıkarıldı (varsayım değil):

| Wix URL | Sayfa (etiket) | İçerik |
|---|---|---|
| `/` | Ana Sayfa | Hero + kategori kartları + hakkımızda özeti |
| `/services` | Ürünler | PVC&Kauçuk / Plastik&3D / Ofis&Fuar kartları |
| `/projects` | Üretim | Üretim örnekleri + "çalışmalarımız" |
| `/about-us` | Hakkımızda | Marka hikayesi |
| `/studio` | (Eski Hakkımızda) | Wix şablonundan kalma ikinci "About" sayfası |
| `/contact` | İletişim / Teklif Al | İletişim |
| `/terms-and-conditions` | Şartlar (menüde "Sektörler" etiketli) | Terms & Conditions |

**Kritik gözlemler:**
- Wix `www.` ile yayında (`https://www.promoking.com.tr`). Yeni site canonical'ı
  **çıplak** alan adı. Geçişte mutlaka **www → çıplak** birleştirme gerekir.
- Wix slug'ları sezgisel değil (`/studio`, `/projects`). Bu yüzden 301 redirect
  şart: aksi halde eski indeksli linkler 404 verir, SEO değeri kaybolur.
- Wix menüsünde mislink'ler var (footer'da "Hakkımızda" → `/contact`). Bunlar
  yeni sitede zaten düzgün; taşımaya gerek yok.
- **Doğrulama notu:** Tam liste için kesişimden önce Wix panelinden
  (SEO → Sitemap) veya `www.promoking.com.tr/sitemap.xml` ile teyit edin.
  Blog/ürün detay sayfası tespit edilmedi (site ~5-7 sayfa).

---

## 2. Yeni Netlify URL yapısı

URL normalizasyonu önceki fazda tamamlandı; `promoking-` öneki kaldırıldı:

| Sayfa | Yeni URL |
|---|---|
| Ana Sayfa | `/` (index.html) |
| Ürünler (hub) | `/urunler.html` |
| Üretim | `/uretim.html` |
| Referanslar | `/referanslar.html` |
| Hakkımızda | `/hakkimizda.html` |
| İletişim | `/iletisim.html` |
| Kategori sayfaları | `/kalemler.html`, `/ajanda-defterler.html`, `/termos-matara.html`, `/teknolojik-urunler.html`, `/otel-bar.html`, `/kurumsal-hediye-setleri.html`, `/pvc-urunler.html`, `/kaucuk-urunler.html`, `/plastik-urunler.html`, `/tekstil-urunleri.html` |

---

## 3. Redirect stratejisi

**İlke:** Her eski Wix URL'i, en yakın yeni sayfaya **301 (kalıcı)** ile taşınır.
301 seçilir çünkü taşıma kalıcıdır ve link/SEO değerinin büyük kısmını aktarır.

### Redirect eşleme tablosu

| # | Eski (Wix) | Yeni (Netlify) | Tip | Gerekçe |
|---|---|---|---|---|
| 1 | `https://www.promoking.com.tr/*` | `https://promoking.com.tr/:splat` | 301! | Host birleştirme (www → çıplak) |
| 2 | `/services` | `/urunler.html` | 301 | Ürünler aynı niyet |
| 3 | `/projects` | `/uretim.html` | 301 | Wix nav etiketi "Üretim" idi |
| 4 | `/about-us` | `/hakkimizda.html` | 301 | Hakkımızda |
| 5 | `/studio` | `/hakkimizda.html` | 301 | Eski About → tek Hakkımızda |
| 6 | `/contact` | `/iletisim.html` | 301 | İletişim |
| 7 | `/terms-and-conditions` | `/` | 301 | Yeni sitede Şartlar yok (bkz. not) |

**Kararı sana bırakılan noktalar:**
- **`/projects`** Üretim'e mi yoksa Referanslar'a mı? Wix içeriği ikisinin karışımı.
  Nav etiketi "Üretim" olduğu için `/uretim.html` seçtim. Referanslar'a çevirmek
  istersen tek satır değişir.
- **`/terms-and-conditions`** şu an ana sayfaya gidiyor. Şartlar/Gizlilik sayfasını
  yeni sitede yeniden oluşturursan (KVKK için önerilir), hedefi oraya çevir.

---

## 4. Dağıtım (deployment) notları — kesişim sırası

1. **Önce hazırlık:** `_redirects.template` dosyasını `_redirects` olarak yeniden
   adlandır, site köküne koy. (Zip'in tamamını Netlify'a klasör olarak sürükle-bırak.)
2. **Netlify domain ayarı:** `promoking.com.tr` (çıplak) primary domain; `www`
   alias olarak eklenip otomatik çıplak'a yönlendirilir.
3. **DNS kesişimi:** Domain DNS kayıtlarını Wix'ten Netlify'a çevir. Bu AN itibarıyla
   `_redirects` canlı olmalı — yukarıdaki adımlar bundan ÖNCE tamamlanmış olsun.
4. **HTTPS:** Netlify Let's Encrypt sertifikası otomatik; www + çıplak ikisini de kapsar.
5. **Kesişim sonrası:** Eski Wix sitesini hemen silme; 1-2 hafta yedek olarak dursun.

---

## 5. SEO koruma — doğrulama (tamamlandı ✅)

| Kontrol | Durum |
|---|---|
| 16 sayfanın canonical'ı çıplak alan + doğru slug | ✅ |
| Hiçbir dosyada `www.` sızıntısı yok | ✅ |
| `sitemap.xml` → 16 URL, hepsi çıplak alan, yeni slug'lar | ✅ |
| `robots.txt` → çıplak alan sitemap referansı, `Allow: /` | ✅ |
| Tüm iç linkler kırıksız (0 kırık) | ✅ |

**Kesişimden sonra yapılacaklar (manuel, panel işi):**
- Google Search Console'da **çıplak alanı** doğrula (gerekirse www'i de ekle).
- Yeni `sitemap.xml`'i GSC'ye gönder.
- İlk birkaç gün "Coverage / Pages" raporundan eski Wix URL'lerinin 301 verdiğini izle.
- Wix'in eski `google-site-verification` meta'sı yeni sitede gerekmez (kaldırıldı).
