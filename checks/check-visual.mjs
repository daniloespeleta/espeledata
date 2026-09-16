// Portões determinísticos. Rodam ANTES da revisão por LLM.
// Uso: node checks/check-visual.mjs <URL_DA_PREVIA> [pasta_de_saida] [pt|en]
// Ex.: node checks/check-visual.mjs https://deploy-preview-12--espeledata.netlify.app/ runs/pt pt
//      node checks/check-visual.mjs https://deploy-preview-12--espeledata.netlify.app/en/ runs/en en
// Saída: <pasta>/report.json, screenshots 390 e 1440. Exit code 1 se houver bloqueio.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.argv[2];
const out = process.argv[3] || `runs/${new Date().toISOString().replace(/[:.]/g, '-')}`;
if (!url) { console.error('Informe a URL da prévia.'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

const here = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.join(here, '..', 'content', 'relatos.json'), 'utf8'));
const lang = process.argv[4] || 'pt';
const pick = (o) => (typeof o === 'string' ? o : o[lang]);
const content = { secao: { titulo: pick(raw.secao.titulo), intro: pick(raw.secao.intro) }, relatos: raw.relatos.map(r => ({ titulo: pick(r.titulo), corpo: pick(r.corpo), fecho: pick(r.fecho) })) };
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'rules.json'), 'utf8'));

const norm = (s) => s.normalize('NFC').replace(/[ \s]+/g, ' ').trim();
const report = { url, date: new Date().toISOString(), viewports: {}, blockers: [], warnings: [] };

const browser = await chromium.launch();
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(out, `full-${width}.png`), fullPage: true });

  const text = norm(await page.evaluate(() => document.body.innerText));
  const v = { dashes: [], forbidden: [], missing_literal: [], hidden_on_load: [], horizontal_scroll: false, old_content: [] };

  // 1. Travessão e meia-risca no texto visível
  for (const ch of cfg.forbidden_chars) {
    let i = text.indexOf(ch);
    while (i !== -1) { v.dashes.push(text.slice(Math.max(0, i - 40), i + 40)); i = text.indexOf(ch, i + 1); }
  }
  // 2. Vocabulário proibido
  for (const w of cfg.forbidden_words) {
    if (new RegExp(`\\b${w}`, 'i').test(text)) v.forbidden.push(w);
  }
  // 3. Conteúdo literal dos relatos
  const fields = [content.secao.titulo, content.secao.intro,
    ...content.relatos.flatMap(r => [r.titulo, r.corpo, r.fecho])];
  // innerText aplica text-transform (ex.: uppercase), por isso a comparação ignora caixa
  for (const f of fields) if (!text.toLowerCase().includes(norm(f).toLowerCase())) v.missing_literal.push(f.slice(0, 80));
  // 4. Regra dos 10 segundos: títulos e frases finais visíveis sem clicar
  const mustSee = content.relatos.flatMap(r => [r.titulo, r.fecho]);
  v.hidden_on_load = await page.evaluate((needles) => {
    const bad = [];
    const all = [...document.querySelectorAll('body *')];
    for (const n of needles) {
      const el = all.filter(e => e.childElementCount === 0 || [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()))
        .find(e => e.textContent.replace(/\s+/g, ' ').trim().includes(n));
      if (!el) { bad.push(`${n} (não encontrado)`); continue; }
      const r = el.getBoundingClientRect();
      const visible = el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : (r.width > 0 && r.height > 0);
      const collapsed = el.closest('details:not([open]), [aria-hidden="true"], [hidden]') && !el.closest('summary');
      if (!visible || r.width === 0 || r.height === 0 || collapsed) bad.push(n);
    }
    return bad;
  }, mustSee);
  // 5. Rolagem horizontal
  v.horizontal_scroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  // 6. Conteúdo antigo que não pode sobrar
  for (const old of cfg.old_content) if (text.toLowerCase().includes(old.toLowerCase())) v.old_content.push(old);

  report.viewports[width] = v;
  if (v.dashes.length) report.blockers.push(`[${width}] travessão ou meia-risca no texto: ${v.dashes.length}`);
  if (v.forbidden.length) report.blockers.push(`[${width}] vocabulário proibido: ${v.forbidden.join(', ')}`);
  if (v.missing_literal.length) report.blockers.push(`[${width}] texto dos relatos ausente ou alterado: ${v.missing_literal.length}`);
  if (v.hidden_on_load.length) report.blockers.push(`[${width}] títulos ou frases finais escondidos: ${v.hidden_on_load.length}`);
  if (v.horizontal_scroll) report.blockers.push(`[${width}] rolagem horizontal`);
  if (v.old_content.length) report.blockers.push(`[${width}] conteúdo antigo presente: ${v.old_content.join(', ')}`);
  await page.close();
}
await browser.close();

report.status = report.blockers.length ? 'BLOQUEADO' : 'APROVADO_NOS_PORTOES';
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
console.log(report.status); report.blockers.forEach(b => console.log(' - ' + b));
process.exit(report.blockers.length ? 1 : 0);
