/* ============================================================
 * scripts/render-relatos.js  —  gera a seção Relatos a partir do JSON
 * ------------------------------------------------------------
 * O texto dos relatos vive em content/relatos.json (PT e EN).
 * Este script escreve o HTML bilíngue (spans .pt / .en) entre os
 * marcadores <!-- RELATOS:START --> e <!-- RELATOS:END --> do index.html.
 * Nenhum agente digita texto de relato no HTML: só edita CSS e layout.
 *
 *   node scripts/render-relatos.js                       atualiza o bloco entre marcadores
 *   node scripts/render-relatos.js --check               falha se o HTML divergir do JSON (usar no CI)
 *   node scripts/render-relatos.js --replace-trajetoria  1ª vez: troca a <section id="trajetoria"> pelo bloco
 *   node scripts/render-relatos.js --rename-menu         troca o rótulo do menu Trajetória/Journey por Relatos/Stories
 *
 * O id da seção continua "trajetoria" para não quebrar links nem o
 * validate-site-structure.js. Pure Node built-ins.
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'relatos.json'), 'utf8'));
const args = new Set(process.argv.slice(2));
const START = '<!-- RELATOS:START -->';
const END = '<!-- RELATOS:END -->';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bi = (f) => `<span class="pt">${esc(f.pt)}</span><span class="en" lang="en">${esc(f.en)}</span>`;

function render() {
  const s = data.secao;
  const items = data.relatos.map((r) => `
      <article class="relato" id="relato-${r.n}">
        <p class="relato-meta"><span class="relato-n">${r.n}</span> · ${bi(r.empresa)} · ${bi(r.cargo)} · ${bi(r.periodo)}</p>
        <h3 class="relato-title">${bi(r.titulo)}</h3>
        <p class="relato-body">${bi(r.corpo)}</p>
        <p class="relato-fecho">${bi(r.fecho)}</p>
      </article>`).join('\n');
  return `${START}
  <section id="trajetoria" class="relatos" aria-labelledby="relatos-title">
    <p class="kicker">${bi(s.eyebrow)}</p>
    <h2 class="section-title" id="relatos-title">${bi(s.titulo)}</h2>
    <p class="section-sub">${bi(s.intro)}</p>
    <div class="relatos-list">
${items}
    </div>
  </section>
  ${END}`;
}

let html = fs.readFileSync(htmlPath, 'utf8');
const block = render();
const hasMarkers = html.includes(START) && html.includes(END);

if (args.has('--check')) {
  if (!hasMarkers) { console.log('RELATOS CHECK: marcadores ausentes no index.html'); process.exit(1); }
  const current = html.slice(html.indexOf(START), html.indexOf(END) + END.length);
  if (current !== block) { console.log('RELATOS CHECK: FAIL, o HTML diverge de content/relatos.json. Rode node scripts/render-relatos.js'); process.exit(1); }
  console.log('RELATOS CHECK: PASS, HTML idêntico ao JSON');
  process.exit(0);
}

if (hasMarkers) {
  html = html.slice(0, html.indexOf(START)) + block + html.slice(html.indexOf(END) + END.length);
} else if (args.has('--replace-trajetoria')) {
  const i = html.indexOf('<section id="trajetoria"');
  if (i === -1) { console.log('Seção #trajetoria não encontrada.'); process.exit(1); }
  const j = html.indexOf('</section>', i);
  html = html.slice(0, i) + block + html.slice(j + '</section>'.length);
} else {
  console.log('Marcadores ausentes. Na primeira vez, use --replace-trajetoria.');
  process.exit(1);
}

if (args.has('--rename-menu')) {
  const re = /(<a href="#trajetoria"[^>]*>)<span class="pt">Trajetória<\/span><span class="en" lang="en">Journey<\/span>/g;
  const n = (html.match(re) || []).length;
  html = html.replace(re, `$1${bi(data.menu && { pt: data.menu.pt, en: data.menu.en })}`);
  console.log(`Menu: ${n} rótulo(s) renomeado(s).`);
}

fs.writeFileSync(htmlPath, html);
console.log(`render-relatos: ${data.relatos.length} relatos escritos no index.html`);
