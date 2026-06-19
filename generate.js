#!/usr/bin/env node
/* ===========================================================================
 * PROMOKING — Statik sayfa üretici (build-time pre-render)
 * ---------------------------------------------------------------------------
 * Tek doğruluk kaynağı: /data/*.json
 * Çalıştırma:  node generate.js
 * Ne yapar: /data içindeki JSON'lardan, sayfalardaki GEN:* marker'ları arasına
 *           GERÇEK statik HTML üretir (SEO-güvenli). Tasarıma dokunmaz.
 * Deploy öncesi MUTLAKA çalıştırın.
 * ======================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');

const read = p => fs.readFileSync(p, 'utf8');
const readJSON = f => JSON.parse(read(path.join(DATA, f)));

// --- yardımcılar ---
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const att = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
// Python urllib.quote ile birebir uyum için ( ) ' ! * ayrıca kodlanır
const q = s => encodeURIComponent(String(s == null ? '' : s))
  .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

const WA = 'https://wa.me/905308995995?text=';
const WASVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.494 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>';

function replaceBetween(html, startMark, endMark, inner) {
  const s = html.indexOf(startMark), e = html.indexOf(endMark);
  if (s === -1 || e === -1) return { html, ok: false };
  const before = html.slice(0, s + startMark.length);
  const after = html.slice(e);
  return { html: before + '\n' + inner + '\n' + after, ok: true };
}

// --- ürün kartı (mevcut tasarımla birebir) ---
function productCard(p) {
  const wa = WA + q(p.whatsappMessage_tr);
  const contact = 'iletisim.html?urun=' + q(p.code || '') + '&ad=' + q(p.name_tr) + '&kategori=' + q(p.category);
  const codeDiv = p.code
    ? `<div class="pc-code">${esc(p.code)}</div>`
    : `<div class="pc-code" style="min-height:8px"></div>`;
  return `  <div class="pc" data-s="${att(p.search || '')}">
    <a class="pc-img" href="${wa}" target="_blank" rel="noopener"><img src="${p.image}" alt="${att(p.name_tr)}" loading="lazy"></a>
    <div class="pc-body"><div class="pc-name" data-en="${att(p.name_en)}">${esc(p.name_tr)}</div>${codeDiv}
      <div class="pc-actions"><a class="pc-quote" href="${contact}" data-en="Get a Quote">Teklif Al</a>
      <a class="pc-wa" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${WASVG}</a></div>
    </div></div>`;
}

// --- referans kartı (mevcut tasarımla birebir) ---
function refCard(r) {
  const logo = r.logo
    ? `      <img class="ref-logo-img" src="${att(r.logo)}" alt="${att(r.companyName)}">`
    : `      <div class="ref-logo-ph">${esc(r.initials || '')}</div>`;
  return `    <div class="ref-card" data-cat="${att(r.dataCat || '')}">
${logo}
      <div class="ref-name">${esc(r.companyName)}</div>
      <div class="ref-sector" data-en="${att(r.sector_en || r.sector)}">${esc(r.sector)}</div>
      <div class="ref-bar"></div>
    </div>`;
}

// --- blog kartı (liste) ---
function blogCard(p) {
  return `    <a class="blog-card" href="blog-detay.html?slug=${q(p.slug)}">
      <div class="blog-card-meta"><span class="blog-cat">${esc(p.category)}</span><span class="blog-date">${esc(p.date)}</span></div>
      <h3 class="blog-card-title" data-en="${att(p.title_en)}">${esc(p.title_tr)}</h3>
      <p class="blog-card-ex" data-en="${att(p.excerpt_en)}">${esc(p.excerpt_tr)}</p>
      <span class="blog-card-more" data-en="Read →">Devamını oku →</span>
    </a>`;
}

// --- katalog kartı ---
function catalogCard(c) {
  const link = c.flipbookUrl || c.pdfUrl || '';
  const btn = link
    ? `<a class="btn-mg" href="${att(link)}" target="_blank" rel="noopener" data-en="Open Catalog ↗">Kataloğu Aç ↗</a>`
    : `<span class="kat-soon" data-en="Coming soon">Yakında</span>`;
  return `    <div class="kat-card">
      <h3 class="kat-title" data-en="${att(c.title_en)}">${esc(c.title_tr)}</h3>
      <p class="kat-desc" data-en="${att(c.description_en)}">${esc(c.description_tr)}</p>
      ${btn}
    </div>`;
}

let report = [];
function log(s) { report.push(s); console.log(s); }

// ============================ ÜRÜN KATEGORİLERİ ============================
const products = readJSON('products.json').products;
const cats = readJSON('categories.json').categories;
let totalRendered = 0;
for (const c of cats) {
  const file = path.join(ROOT, c.page);
  if (!fs.existsSync(file)) continue;
  let html = read(file);
  if (html.indexOf('GEN:PRODUCTS:START') === -1) { log(`atlandı (marker yok): ${c.page}`); continue; }
  const list = products
    .filter(p => p.categorySlug === c.slug && p.active)
    .sort((a, b) => ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) || (a.sortOrder - b.sortOrder));
  const cards = list.map(productCard).join('\n');
  const r = replaceBetween(html, '<!-- GEN:PRODUCTS:START -->', '<!-- GEN:PRODUCTS:END -->', cards);
  html = r.html;
  // banner sayacını güncelle
  html = html.replace(/(<div class="bcount" data-en=")\d+( products"><strong>)\d+(<\/strong> ürün<\/div>)/,
    `$1${list.length}$2${list.length}$3`);
  fs.writeFileSync(file, html);
  totalRendered += list.length;
  log(`✓ ${c.page}: ${list.length} aktif ürün render edildi`);
}
log(`Toplam render edilen ürün: ${totalRendered}`);

// ============================== REFERANSLAR ===============================
(() => {
  const file = path.join(ROOT, 'referanslar.html');
  if (!fs.existsSync(file)) return;
  let html = read(file);
  if (html.indexOf('GEN:REFS:START') === -1) { log('referanslar: marker yok, atlandı'); return; }
  const refs = readJSON('references.json').references.filter(r => r.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const r = replaceBetween(html, '<!-- GEN:REFS:START -->', '<!-- GEN:REFS:END -->', refs.map(refCard).join('\n\n'));
  fs.writeFileSync(file, r.html);
  log(`✓ referanslar.html: ${refs.length} aktif referans render edildi`);
})();

// ================================= BLOG ===================================
(() => {
  const file = path.join(ROOT, 'blog.html');
  if (!fs.existsSync(file)) { log('blog.html yok, atlandı'); return; }
  let html = read(file);
  const posts = readJSON('blog.json').posts
    .filter(p => p.active)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const r = replaceBetween(html, '<!-- GEN:BLOG:START -->', '<!-- GEN:BLOG:END -->', posts.map(blogCard).join('\n'));
  if (r.ok) { fs.writeFileSync(file, r.html); log(`✓ blog.html: ${posts.length} aktif yazı listelendi`); }
})();

// ================================ KATALOG =================================
(() => {
  const file = path.join(ROOT, 'katalog.html');
  if (!fs.existsSync(file)) { log('katalog.html yok, atlandı'); return; }
  let html = read(file);
  const all = readJSON('catalogs.json').catalogs.filter(c => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const inner = all.length
    ? all.map(catalogCard).join('\n')
    : `    <div class="kat-card kat-empty"><h3 data-en="Digital catalog coming soon">Dijital katalog yakında</h3><p data-en="Our printable / flipbook catalog will be published here soon." >Yazdırılabilir / flipbook kataloğumuz yakında burada yayınlanacak.</p></div>`;
  const r = replaceBetween(html, '<!-- GEN:CATALOG:START -->', '<!-- GEN:CATALOG:END -->', inner);
  if (r.ok) { fs.writeFileSync(file, r.html); log(`✓ katalog.html: ${all.length} aktif katalog listelendi`); }
})();

log('\nBitti. Deploy etmeden önce bu script çalıştırılmış olmalı.');
