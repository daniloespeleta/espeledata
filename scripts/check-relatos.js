/* ============================================================
 * scripts/check-relatos.js  —  portão de conteúdo sobre o _deploy/
 * ------------------------------------------------------------
 * Roda depois de node build.js. Verifica, em PT (/) e EN (/en/):
 *  1. todo campo de content/relatos.json aparece literal no HTML final;
 *  2. títulos e frases finais não estão dentro de hidden, aria-hidden ou <details>;
 *  3. conteúdo antigo listado em checks/rules.json não sobrou em nenhuma página;
 *  4. palavras proibidas não aparecem na copy.
 * Travessão já é barrado pelo validate-i18n.js. Pure Node built-ins.
 *   node scripts/check-relatos.js
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, '_deploy');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'relatos.json'), 'utf8'));
const rules = JSON.parse(fs.readFileSync(path.join(root, 'checks', 'rules.json'), 'utf8'));

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').trim();

const fails = [];
for (const [lang, file] of [['pt', 'index.html'], ['en', 'en/index.html']]) {
  const p = path.join(out, file);
  if (!fs.existsSync(p)) { fails.push(`${file} não existe. Rode node build.js antes.`); continue; }
  const html = fs.readFileSync(p, 'utf8');
  const t = norm(text(html));
  const s = data.secao;
  const fields = [s.titulo, s.intro, ...data.relatos.flatMap((r) => [r.titulo, r.corpo, r.fecho])].map((f) => f[lang]);
  for (const f of fields) if (!t.includes(norm(f))) fails.push(`[${lang}] texto ausente ou alterado: "${f.slice(0, 60)}..."`);

  const sec = html.match(/<section id="trajetoria"[\s\S]*?<\/section>/);
  if (!sec) fails.push(`[${lang}] seção #trajetoria (Relatos) não encontrada`);
  else if (/<details|\shidden[\s>=]|aria-hidden="true"/.test(sec[0].replace(/<span class="chev" aria-hidden="true">[^<]*<\/span>/g, ''))) {
    fails.push(`[${lang}] a seção Relatos usa hidden, aria-hidden ou <details>: títulos e frases finais precisam ficar visíveis sem clique`);
  }
}

const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.html')) pages.push(p); } })(out);
for (const p of pages) {
  const t = text(fs.readFileSync(p, 'utf8')).toLowerCase();
  const rel = path.relative(out, p);
  for (const old of rules.old_content) if (t.includes(old.toLowerCase())) fails.push(`${rel}: conteúdo antigo "${old}"`);
  for (const w of rules.forbidden_words) if (t.includes(w.toLowerCase())) fails.push(`${rel}: palavra proibida "${w}"`);
}

if (fails.length) { console.log(`RELATOS GATE: FAIL (${fails.length})`); fails.forEach((f) => console.log(' - ' + f)); process.exit(1); }
console.log(`RELATOS GATE: PASS, ${pages.length} páginas verificadas`);
