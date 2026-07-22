/* ============================================================
 * scripts/validate-i18n.js  —  CI guard for the bilingual split
 * ------------------------------------------------------------
 * Validates the built _deploy/ output: one language per URL,
 * correct <html lang>, canonical, hreflang, og:locale, no
 * opposite-language leak, single <h1>, stripped language JS/CSS,
 * absolute shared assets, per-language CV/form, zero em/en dashes,
 * and a bilingual sitemap.
 *
 * Run AFTER `node build.js`.  Exits 1 on any failure (fails CI).
 * Pure Node built-ins.
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = 'https://espeledata.com';
const root = process.cwd();
const out = path.join(root, '_deploy');

const PAGES = [
  'index.html', 'portfolio.html', 'contact.html',
  'case-fenix.html', 'case-abrindo-caminhos.html', 'case-boa-leitura.html',
  'case-sql-01.html', 'case-sql-02.html', 'case-sql-03.html', 'case-sql-04.html', 'case-sql-05.html',
  '404.html', 'obrigado.html',
];

// leak canaries: phrases that must never appear in the other language's file
const PT_ONLY = ['Leio linguagem antes de dado', 'veio das Letras', 'Ver portfólio', 'Fale comigo', 'Início', 'Página não encontrada'];
const EN_ONLY = ['I read language before data', 'came out of language', 'View portfolio', 'Get in touch', 'Page not found'];

const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); };

if (!fs.existsSync(out)) {
  console.error('FAIL: _deploy/ not found. Run `node build.js` first.');
  process.exit(1);
}

let checked = 0;
for (const file of PAGES) {
  for (const lang of ['pt', 'en']) {
    const p = lang === 'pt' ? path.join(out, file) : path.join(out, 'en', file);
    const tag = `[${lang}/${file}]`;
    if (!fs.existsSync(p)) { problems.push(`${tag} missing output file`); continue; }
    const h = fs.readFileSync(p, 'utf8');
    checked++;

    const ptPath = file === 'index.html' ? '' : file;
    const selfUrl = SITE + '/' + (lang === 'en' ? 'en/' : '') + ptPath;

    // one language in the DOM
    const enSpans = (h.match(/class="en"/g) || []).length;
    const ptSpans = (h.match(/class="pt"/g) || []).length;
    if (lang === 'pt') ok(enSpans === 0, `${tag} ${enSpans} leftover class="en" elements`);
    if (lang === 'en') ok(ptSpans === 0, `${tag} ${ptSpans} leftover class="pt" elements`);

    // no opposite-language text leak
    (lang === 'pt' ? EN_ONLY : PT_ONLY).forEach(s => ok(!h.includes(s), `${tag} leaked ${lang === 'pt' ? 'EN' : 'PT'} phrase: "${s}"`));

    // lang + head SEO
    ok(new RegExp(`<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"`).test(h), `${tag} wrong <html lang>`);
    ok(h.includes(`<body class="lang-${lang}">`), `${tag} wrong <body class>`);
    ok(h.includes(`<link rel="canonical" href="${selfUrl}">`), `${tag} canonical != ${selfUrl}`);
    ok(h.includes(`hreflang="pt-BR" href="${SITE}/${ptPath}"`), `${tag} hreflang pt-BR missing`);
    ok(h.includes(`hreflang="en" href="${SITE}/en/${ptPath}"`), `${tag} hreflang en missing`);
    ok(h.includes(`hreflang="x-default" href="${SITE}/${ptPath}"`), `${tag} x-default missing`);
    ok(h.includes(`<meta property="og:url" content="${selfUrl}">`), `${tag} og:url wrong`);
    ok(h.includes(`<meta property="og:locale" content="${lang === 'pt' ? 'pt_BR' : 'en_US'}">`), `${tag} og:locale wrong`);

    // structure / hygiene
    ok((h.match(/<h1[\s>]/g) || []).length <= 1, `${tag} more than one <h1>`);
    ok(!/\.lang-(pt|en) \.(en|pt)\{display:none/.test(h), `${tag} language-hide CSS still present`);
    ok(!/data-lang="(pt|en)"/.test(h), `${tag} old toggle buttons still present`);
    ok(!/function setLang/.test(h), `${tag} language JS (setLang) still present`);

    // zero em-dash / en-dash (voice rule)
    const dashes = (h.match(/—|–/g) || []).length;
    ok(dashes === 0, `${tag} contains ${dashes} em/en dash(es)`);

    // shared assets must be root-absolute (so /en/ pages resolve them)
    ok(!/href="favicon\.svg"/.test(h), `${tag} favicon not absolute`);
    ok(!/href="CV\//.test(h), `${tag} CV link not absolute`);
    ok(!/src="assets\//.test(h), `${tag} asset src not absolute`);

    // toggle points at the sibling URL
    if (/class="lang-alt"/.test(h)) {
      ok(h.includes(`href="/${ptPath}" data-base="/${ptPath}" hreflang="pt-BR"`), `${tag} PT toggle link wrong`);
      ok(h.includes(`href="/en/${ptPath}" data-base="/en/${ptPath}" hreflang="en"`), `${tag} EN toggle link wrong`);
    }

    // per-language details
    if (lang === 'en' && file === 'contact.html') ok(h.includes('action="/en/obrigado.html"'), `${tag} contact form action not EN`);
    if (lang === 'pt' && file === 'contact.html') ok(h.includes('action="/obrigado.html"'), `${tag} contact form action not PT`);

    // nested-span integrity (balanced remover) on the hero
    if (file === 'index.html' && lang === 'pt') ok(h.includes('<span class="accent">A jornada nasce daí.</span>'), `${tag} PT hero accent span corrupted`);
    if (file === 'index.html' && lang === 'en') ok(h.includes('<span class="accent">The journey starts there.</span>'), `${tag} EN hero accent span corrupted`);
  }
}

// sitemap
const smPath = path.join(out, 'sitemap.xml');
if (!fs.existsSync(smPath)) problems.push('sitemap.xml missing');
else {
  const sm = fs.readFileSync(smPath, 'utf8');
  ok(sm.includes(`<loc>${SITE}/</loc>`), 'sitemap missing PT home');
  ok(sm.includes(`<loc>${SITE}/en/</loc>`), 'sitemap missing EN home');
  ok(sm.includes('xmlns:xhtml'), 'sitemap missing xhtml namespace');
}

if (problems.length) {
  console.error(`i18n validation FAILED (${problems.length} problem(s), ${checked} outputs checked):`);
  problems.forEach(p => console.error('  ✗ ' + p));
  process.exit(1);
}
console.log(`i18n validation PASSED — ${checked} outputs (13 pages x PT/EN) + sitemap all valid.`);
