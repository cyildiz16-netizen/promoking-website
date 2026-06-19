# PROMOKING — Faz 2 · B2B Dönüşüm Optimizasyonu Raporu

**Tarih:** 18.06.2026 · **Kapsam:** Tasarım/kimlik/navigasyon DEĞİŞMEDİ. Yalnızca
lead kalitesi ve teklif dönüşümü iyileştirildi. Fiyat/e-ticaret eklenmedi.

---

## 1. Ürün-farkında teklif akışı (387 ürün)

Her ürün kartındaki **"Teklif Al"** butonu artık ürün bağlamını iletişim sayfasına taşır:

```
iletisim.html?urun=<KOD>&ad=<AD>&kategori=<KATEGORI>
```

Örnek: `iletisim.html?urun=FK-3600&ad=FK-3600%20Fosforlu%20Kalem&kategori=Kalemler`

- Kodu olan ürünler: kod + ad + kategori taşınır.
- Kodu olmayan 17 ürün (PVC/kauçuk/plastik): ad + kategori taşınır, `urun=` boş kalır.
- Değerler URL-encode'lu; "Otel & Bar" gibi `&` içeren kategoriler query string'i bozmaz.

## 2. Formu otomatik doldurma (sürtünmesiz)

İletişim sayfası URL'de ürün bilgisi varsa:
- **"Talep Edilen Ürün"** alanı otomatik görünür ve dolar (`Ad — Kod: XXX`). Normalde
  gizlidir; yani ürünsüz gelindiğinde form görünümü hiç değişmez (tasarım korunur).
- **"Ürün Grubu"** seçimi kategoriye göre otomatik seçilir.
- Alan salt-okunur (readonly) ama form gönderiminde Netlify'a kaydedilir → satış ekibi
  hangi ürün için talep geldiğini birebir görür (lead kalitesi).
- Form yumuşak biçimde görünüme kaydırılır.

> **Not (lead kalitesi):** "Ürün Grubu" select'i eskiden yalnızca 4 grup içeriyordu ve
> kalemler/ajanda/termos/teknolojik/otel-bar için karşılığı yoktu. Gerçek katalogla
> (10 kategori) hizalandı. Bu bir tasarım değişikliği değil; veri doğruluğu düzeltmesidir.

## 3. WhatsApp optimizasyonu (kart + form)

Her kartın WhatsApp butonu artık ürün adı + kodu + kategorisini taşıyan hazır mesaj açar:

> `Merhaba, FK-3600 Fosforlu Kalem ürünü hakkında teklif almak istiyorum. (Kod: FK-3600 · Kategori: Kalemler)`

İletişim formundaki "WhatsApp ile Gönder" de, ürün bağlamıyla gelindiyse mesaja
**"Talep Edilen Ürün"** satırını ekler.

## 4. İletişim sayfası — sürtünme azaltma

Tasarım korunarak: ürün bağlamı otomatik taşınır (kullanıcı tekrar yazmaz), doğru ürün
grubu önceden seçilir, talep edilen ürün üstte teyit edilir (güven). Zorunlu alanlar
değiştirilmedi (Ad Soyad, Telefon, Ürün Grubu, KVKK).

---

# Doğrulama Raporu

| Test | Sonuç |
|---|---|
| 387 kartın "Teklif Al" linki `?urun=&ad=&kategori=` taşıyor | ✅ 387/387 |
| Kart WhatsApp linkleri ad+kod+kategori içeriyor | ✅ |
| Kodsuz ürünler: ad+kategori taşınıyor, urun boş | ✅ (17/17) |
| `&` içeren kategori ("Otel & Bar") query'yi bozmuyor | ✅ |
| Form: "Talep Edilen Ürün" alanı eklendi + gönderilir | ✅ |
| Form: "Ürün Grubu" 10 kategoriyle hizalandı | ✅ |
| Otomatik doldurma mantığı (decode + eşleme) — 4 senaryo | ✅ |
| Kauçuk/PVC → "PVC & Kauçuk Ürünler" eşlemesi | ✅ |
| `<form>` ve `<script>` etiket dengesi | ✅ (1/1, 4/4) |
| Ürünsüz erişimde form görünümü değişmiyor | ✅ (alan display:none) |
| Tüm iç linkler kırıksız | ✅ (0 kırık) |

**Tarayıcıda son göz testi (deploy öncesi öneri):** Bir kategori sayfasında "Teklif Al"a
tıkla → iletişim sayfasında ürün alanının dolduğunu ve ürün grubunun seçili geldiğini gör.
