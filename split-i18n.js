/* ============================================================
 * split-i18n.js  —  deploy-time bilingual split (no framework, no deps)
 * ------------------------------------------------------------
 * Reads the single bilingual source pages (PT+EN in one DOM via .pt/.en)
 * and writes, per page, a PT-only file at <out>/<page> and an EN-only file
 * at <out>/en/<page>. Also regenerates <out>/sitemap.xml with hreflang.
 *
 * Usage:  node split-i18n.js <srcDir> <outDir>
 * Called by deploy.ps1. Pure Node built-ins only.
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = 'https://espeledata.com';
const srcDir = process.argv[2] || '.';
const outDir = process.argv[3] || '_deploy';

// Pages that carry bilingual .pt/.en content
const PAGES = [
  'index.html', 'portfolio.html', 'contact.html', 'leea.html', 'notas.html',
  'case-fenix.html', 'case-espeledata.html', 'case-abrindo-caminhos.html', 'case-boa-leitura.html',
  'case-lifecycle-lint.html', 'case-segment-brief.html', 'case-lentes.html',
  'case-sql-01.html', 'case-sql-02.html', 'case-sql-03.html', 'case-sql-04.html', 'case-sql-05.html',
  '404.html', 'obrigado.html',
];
// Pages included in the sitemap (indexable content only)
const INDEXABLE = new Set([
  'index.html', 'portfolio.html', 'contact.html', 'leea.html', 'notas.html',
  'case-fenix.html', 'case-espeledata.html', 'case-abrindo-caminhos.html', 'case-boa-leitura.html',
  'case-lifecycle-lint.html', 'case-segment-brief.html', 'case-lentes.html',
  'case-sql-01.html', 'case-sql-02.html', 'case-sql-03.html', 'case-sql-04.html', 'case-sql-05.html',
]);

/* ---- EN <title>/description translations, applied only to the /en/ output ----
   Each entry is [exact PT string in the head, EN replacement]. Matched by exact
   string, so SVG <title> elements and body copy are never touched. Dash-free. */
const EN_META = {
  'index.html': [
    ["Danilo Espeleta, CRM &amp; Lifecycle Marketing em São Paulo. 8+ anos em jornadas, automação multicanal, segmentação e análise que viram receita.",
     "Danilo Espeleta, CRM &amp; Lifecycle Marketing in São Paulo. 8+ years in journeys, multichannel automation, segmentation and analysis that turn data into revenue."],
    ["Estratégia de CRM, automação e ciclo de vida: cases reais e conceituais de segmentação, jornada e captação.",
     "CRM strategy, automation and lifecycle: real and conceptual cases of segmentation, journey and fundraising."],
  ],
  'portfolio.html': [
    ["Portfólio · Danilo Espeleta", "Portfolio · Danilo Espeleta"],
    ["Portfólio de Danilo Espeleta: projetos de CRM e Lifecycle, ferramentas de código aberto para jornada de cliente, cases de estratégia social e casos de SQL.",
     "Danilo Espeleta's portfolio: CRM and Lifecycle projects, open source tools for customer journeys, social strategy cases and SQL for marketing cases."],
    ["Projetos de CRM &amp; Lifecycle, cases de estratégia e SQL aplicado a marketing.",
     "CRM &amp; Lifecycle projects, strategy cases and SQL applied to marketing."],
  ],
  'contact.html': [
    ["Contato · Danilo Espeleta", "Contact · Danilo Espeleta"],
    ["Fale com Danilo Espeleta, CRM &amp; Lifecycle Marketing em São Paulo. E-mail, WhatsApp, LinkedIn ou mensagem direta.",
     "Get in touch with Danilo Espeleta, CRM &amp; Lifecycle Marketing in São Paulo. Email, WhatsApp, LinkedIn or a direct message."],
    ["Fale com Danilo Espeleta, CRM &amp; Lifecycle Marketing em São Paulo.",
     "Get in touch with Danilo Espeleta, CRM &amp; Lifecycle Marketing in São Paulo."],
  ],
  'leea.html': [
    ["Leea · IA aplicada a CRM e Lifecycle | Danilo Espeleta", "Leea · AI applied to CRM and Lifecycle | Danilo Espeleta"],
    ["Prática autoral de Danilo Espeleta para diagnosticar uma transição de CRM e Lifecycle, organizar evidências e especificar como medir a próxima decisão.",
     "Danilo Espeleta's author-led practice for diagnosing a CRM and Lifecycle transition, organizing evidence and specifying how to measure the next decision."],
    ["Leea · Prática de IA aplicada a CRM e Lifecycle", "Leea · Author-led applied AI practice for CRM and Lifecycle"],
  ],
  'case-fenix.html': [
    ["CRM turnaround na Fênix Educação: base de 50K+ leads limpa e segmentada do zero, elevando a abertura de ~2% para ~25%, com +35% de CTR e +20% em matrículas.",
     "CRM turnaround at Fênix Educação: a 50K+ lead base cleaned and segmented from scratch, lifting open rate from ~2% to ~25%, with +35% CTR and +20% enrollment."],
  ],
  'case-espeledata.html': [
    ["Case espeledata.com · Danilo Espeleta", "espeledata.com case · Danilo Espeleta"],
    ["Case do espeledata.com: site bilíngue sem framework, com separação de idioma no build e validador de CI que reprova o deploy por regra de escrita.",
     "The espeledata.com case: a bilingual site with no framework, build time language splitting and a CI validator that fails the deploy on writing rules."],
    ["Site bilíngue sem framework nem dependência, onde a regra editorial é asserção de CI.",
     "A bilingual site with no framework and no dependencies, where the editorial rule is a CI assertion."],
  ],
  'case-abrindo-caminhos.html': [
    ["Case de CRM &amp; Lifecycle Marketing: segmentação por condição, jornada do apoiador em cinco estágios e framework de KPIs para captação no terceiro setor.",
     "CRM &amp; Lifecycle Marketing case: condition-based segmentation, a five-stage supporter journey and a KPI framework for fundraising in the nonprofit sector."],
  ],
  'case-boa-leitura.html': [
    ["Case de prospecção híbrida e Lifecycle: projeto social de incentivo à leitura desenhado como motor de prospecção de parceiros e captação de recursos.",
     "Hybrid prospecting and Lifecycle case: a reading-incentive social project designed as an engine for partner prospecting and fundraising."],
    ["Funil de Defensores em cinco estágios, calendário literário como motor de cadência e nicho de convidados como canal de alavancagem.",
     "A five-stage Defenders funnel, a literary calendar as a cadence engine and a guest niche as a leverage channel."],
  ],
  'case-sql-01.html': [
    ["SQL 01 · Filtros e Qualificação · Danilo Espeleta", "SQL 01 · Filters and Qualification · Danilo Espeleta"],
    ["Case de SQL: filtros de qualificação que isolam decisores com score acima de 85 em ~5.000 leads/mês, gerando 450 SQLs e +22% na conversão de reuniões.",
     "SQL case: qualification filters that isolate decision-makers with a score above 85 across ~5,000 leads/month, generating 450 SQLs and +22% meeting conversion."],
  ],
  'case-sql-02.html': [
    ["SQL 02 · Lógica de Precedência · Danilo Espeleta", "SQL 02 · Precedence Logic · Danilo Espeleta"],
    ["Query SQL com lógica booleana e parênteses para resgatar leads de alto escalão inativos há 30+ dias: precedência correta que abriu 15 oportunidades.",
     "SQL query with boolean logic and parentheses to recover senior-level leads inactive for 30+ days: correct precedence that opened 15 opportunities."],
  ],
  'case-sql-03.html': [
    ["SQL 03 · Visão 360° Customer Success · Danilo Espeleta", "SQL 03 · 360° Customer Success View · Danilo Espeleta"],
    ["Case de SQL: LEFT JOIN + IS NULL para identificar clientes cadastrados sem pedidos, reduzindo o tempo de ativação em 15 dias e protegendo o LTV.",
     "SQL case: LEFT JOIN + IS NULL to identify registered customers without orders, cutting activation time by 15 days and protecting LTV."],
  ],
  'case-sql-04.html': [
    ["SQL 04 · Agregação de Funil · Danilo Espeleta", "SQL 04 · Funnel Aggregation · Danilo Espeleta"],
    ["Análise volumétrica do funil de vendas com COUNT e GROUP BY: 1.200 leads na entrada, gargalo em Proposta Enviada e automação para destravar a receita.",
     "Volumetric sales-funnel analysis with COUNT and GROUP BY: 1,200 leads at the top, a bottleneck at Proposal Sent and automation to unlock revenue."],
  ],
  'case-sql-05.html': [
    ["SQL 05 · Ticket Médio por Segmento · Danilo Espeleta", "SQL 05 · Average Ticket by Segment · Danilo Espeleta"],
    ["Case SQL 05: AVG() e GROUP BY para calcular o ticket médio por setor e direcionar o investimento de mídia paga ao segmento mais rentável.",
     "SQL case 05: AVG() and GROUP BY to compute the average ticket by sector and steer paid-media investment toward the most profitable segment."],
  ],
  'case-lifecycle-lint.html': [
    ["Case lifecycle-lint · Danilo Espeleta", "lifecycle-lint case · Danilo Espeleta"],
    ["Linter que lê jornadas de CRM em YAML e acusa o defeito que só existe na interseção entre réguas ativas. Doze regras, diagnóstico sem modelo.", "A linter that reads CRM journeys in YAML and flags the defect that only exists where active flows overlap. Twelve rules, no model in the diagnosis."],
    ["Doze regras sobre jornadas declaradas em YAML, com exit code que barra o merge.", "Twelve rules over journeys declared in YAML, with an exit code that blocks the merge."],
  ],
  'case-segment-brief.html': [
    ["Case segment-brief · Danilo Espeleta", "segment-brief case · Danilo Espeleta"],
    ["Agente que lê eventos de produto e devolve a jornada de lifecycle em YAML, com roteador e validador em código e limite de duas rodadas de correção.", "An agent that reads product events and returns a lifecycle journey in YAML, with routing and validation in code and a two round correction limit."],
    ["Roteador determinístico na entrada, agente no meio, validador na saída.", "A deterministic router at the entrance, an agent in the middle, a validator at the exit."],
  ],
  'case-lentes.html': [
    ["Case lentes · Danilo Espeleta", "lentes case · Danilo Espeleta"],
    ["Biblioteca de lentes de leitura para CRM, versionadas, com harness que mede regressão quando o prompt ou o modelo muda. Cinco lentes, 25 casos em CI.", "A library of reading lenses for CRM, versioned, with a harness that measures regression when the prompt or the model changes. Five lenses, 25 cases in CI."],
    ["Prompt versionado, com asserções verificáveis e placar de regressão em CI.", "Versioned prompts, with verifiable assertions and a regression scoreboard in CI."],
  ],
  'notas.html': [
    ["Notas sobre CRM, retenção e dados · Danilo Espeleta", "Notes on CRM, retention and data · Danilo Espeleta"],
    ["Notas de Danilo Espeleta sobre CRM, retenção, dados de jornada e leitura de linguagem. Texto curto, com data e palavras-chave.",
     "Notes by Danilo Espeleta on CRM, retention, journey data and language reading. Short pieces, with a date and keywords."],
    ["Notas sobre CRM, retenção e leitura de linguagem.",
     "Notes on CRM, retention and language reading."],
  ],
  'obrigado.html': [
    ["Mensagem enviada · Danilo Espeleta", "Message sent · Danilo Espeleta"],
  ],
};

/* ---- shared accessibility strings, applied to every EN output ----
   aria-label/alt/placeholder cannot hold .pt/.en spans, so they stay Portuguese
   in the source and get translated here, in one place, for all pages. Matched
   as whole attribute values so body copy is never touched. */
const EN_ATTRS = [
  ['aria-label="Principal"', 'aria-label="Main"'],
  ['aria-label="Menu"', 'aria-label="Menu"'],
  ['aria-label="Fechar menu"', 'aria-label="Close menu"'],
  ['aria-label="Números"', 'aria-label="Numbers"'],
  ['aria-label="Números do método"', 'aria-label="Method numbers"'],
  ['aria-label="Competências"', 'aria-label="Skills"'],
  ['aria-label="Navegação entre cases"', 'aria-label="Case navigation"'],
  ['aria-label="Fechamento"', 'aria-label="Closing"'],
  ['aria-label="Rodapé"', 'aria-label="Footer"'],
  ['aria-label="Escopo da oferta"', 'aria-label="Offer scope"'],
  ['placeholder="Não preencha este campo:"', 'placeholder="Do not fill this field:"'],
  ['Não preencha este campo:', 'Do not fill this field:'],
  ['>Selecione</option>', '>Select</option>'],
  ['>CRM ativo com histórico e timestamps</option>', '>Active CRM with history and timestamps</option>'],
  ['>CRM ativo com timestamps incompletos</option>', '>Active CRM with incomplete timestamps</option>'],
  ['>Ainda não sei</option>', '>I do not know yet</option>'],
  ['>Sem CRM ou histórico utilizável</option>', '>No CRM or usable history</option>'],
  ['>Sou responsável ou sponsor</option>', '>I am the owner or sponsor</option>'],
  ['>Opero o CRM</option>', '>I operate the CRM</option>'],
  ['>Sou owner de dados</option>', '>I am the data owner</option>'],
  ['>Outro papel</option>', '>Another role</option>'],
  ['alt="Retrato de Danilo Espeleta, especialista em CRM e Lifecycle Marketing"',
   'alt="Portrait of Danilo Espeleta, CRM and Lifecycle Marketing specialist"'],
];

/* ---- balanced removal of every element carrying `lang` as a class TOKEN ----
   Matches class="en", class="step en", class="a en b". Does NOT match
   class="lang-en" (single token "lang-en"), so <body class="lang-pt"> and the
   language CSS are left alone. Token matching, not exact-string matching: a
   compound class like class="step en" used to slip through and leak the whole
   opposite language into the output. */
function removeLangElements(html, lang) {
  const attrRe = /class="([^"]*)"/g;
  const hasToken = (v) => v.split(/\s+/).includes(lang);
  let s = html;
  let idx = 0;
  while (true) {
    // find the next class attribute (at or after idx) whose token list has `lang`
    attrRe.lastIndex = idx;
    let m, pos = -1;
    while ((m = attrRe.exec(s)) !== null) {
      if (hasToken(m[1])) { pos = m.index; break; }
    }
    if (pos === -1) break;
    const needleLen = m[0].length;
    const tagStart = s.lastIndexOf('<', pos);
    if (tagStart === -1) { idx = pos + needleLen; continue; }
    const nameM = /^<([a-zA-Z][\w-]*)/.exec(s.slice(tagStart));
    if (!nameM) { idx = pos + needleLen; continue; }
    const tag = nameM[1];
    const openEnd = s.indexOf('>', tagStart);
    if (openEnd === -1 || pos > openEnd) { idx = pos + needleLen; continue; }
    const closeTag = `</${tag}>`;
    const openRe = new RegExp('<' + tag + '(\\s|>|/)', 'g');
    let depth = 1, scan = openEnd + 1, end = -1;
    while (scan < s.length) {
      const nc = s.indexOf(closeTag, scan);
      if (nc === -1) break;
      openRe.lastIndex = scan;
      let opens = 0, mo;
      while ((mo = openRe.exec(s)) !== null) { if (mo.index >= nc) break; opens++; }
      depth += opens - 1;
      if (depth === 0) { end = nc + closeTag.length; break; }
      scan = nc + closeTag.length;
    }
    if (end === -1) { idx = pos + needleLen; continue; } // unbalanced: skip
    s = s.slice(0, tagStart) + s.slice(end);
    idx = tagStart;
  }
  return s;
}

/* ---- head SEO normalization ---- */
function normalizeHead(h, { lang, ptUrl, enUrl }) {
  const selfUrl = lang === 'pt' ? SITE + ptUrl : SITE + enUrl;
  h = h.replace(/\s*<link rel="canonical"[^>]*>/g, '');
  h = h.replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/g, '');
  h = h.replace(/\s*<meta property="og:url"[^>]*>/g, '');
  h = h.replace(/\s*<meta property="og:locale"[^>]*>/g, '');
  const block =
    `<link rel="canonical" href="${selfUrl}">\n` +
    `<link rel="alternate" hreflang="pt-BR" href="${SITE}${ptUrl}">\n` +
    `<link rel="alternate" hreflang="en" href="${SITE}${enUrl}">\n` +
    `<link rel="alternate" hreflang="x-default" href="${SITE}${ptUrl}">\n` +
    `<meta property="og:url" content="${selfUrl}">\n` +
    `<meta property="og:locale" content="${lang === 'pt' ? 'pt_BR' : 'en_US'}">`;
  
  // Try to insert after theme-color meta tag first
  if (/(<meta name="theme-color"[^>]*>)/.test(h)) {
    h = h.replace(/(<meta name="theme-color"[^>]*>)/, `$1\n${block}`);
  } else {
    // Fallback: insert before </head> if theme-color doesn't exist
    h = h.replace(/(<\/head>)/, `${block}\n$1`);
  }
  
  if (!/property="og:image"/.test(h)) {
    const img =
      `<meta property="og:image" content="${SITE}/og-cover.png">\n` +
      `<meta property="og:image:width" content="1200">\n` +
      `<meta property="og:image:height" content="630">\n` +
      `<meta name="twitter:card" content="summary_large_image">\n` +
      `<meta name="twitter:image" content="${SITE}/og-cover.png">`;
    h = h.replace(/(<meta property="og:locale"[^>]*>)/, `$1\n${img}`);
  }
  return h;
}

/* ---- convert the PT/EN toggle buttons into cross-language links ---- */
function rewriteToggle(h, { lang, ptUrl, enUrl }) {
  const btnPair = /<button type="button" data-lang="pt"[^>]*>PT<\/button>\s*<button type="button" data-lang="en"[^>]*>EN<\/button>/g;
  const ptA = `<a class="lang-alt" href="${ptUrl}" data-base="${ptUrl}" hreflang="pt-BR"${lang === 'pt' ? ' aria-current="true"' : ''}>PT</a>`;
  const enA = `<a class="lang-alt" href="${enUrl}" data-base="${enUrl}" hreflang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a>`;
  return h.replace(btnPair, ptA + enA);
}

/* ---- strip the language JS + language CSS hiding rules ---- */
function stripLangMechanics(h) {
  // full-page language block. Leea measurement may sit before mobile sidebar and must survive.
  h = h.replace(/\/\* ---- language[\s\S]*?(?=\/\* ---- (?:Leea|mobile sidebar))/, '');
  // tiny 404/obrigado language IIFE
  h = h.replace(/<script>\(function\(\)\{var s=null;[\s\S]*?\}\)\(\);<\/script>/, '');
  // CSS rules that hide the opposite language (no longer needed; opposite lang is gone)
  h = h.replace(/\.lang-(pt|en) \.(en|pt)\{display:none[^}]*\}\s*/g, '');
  return h;
}

/* ---- root-absolute shared assets so /en/ pages resolve them ---- */
function absolutizeAssets(h) {
  h = h.replace(/href="favicon\.svg"/g, 'href="/favicon.svg"');
  h = h.replace(/href="CV\//g, 'href="/CV/');
  h = h.replace(/src="assets\//g, 'src="/assets/');
  return h;
}

/* ---- append toggle CSS + hash-preserving script (only if toggle present) ---- */
function appendToggleSupport(h) {
  if (!/class="lang-alt"/.test(h)) return h;
  const css =
    '\n.lang-switch a{background:none;color:var(--gray);cursor:pointer;font-family:var(--mono);font-size:.65rem;font-weight:500;letter-spacing:.1em;padding:.4rem .7rem;text-decoration:none;display:inline-block}' +
    '\n.lang-switch a+a{border-left:1px solid var(--border)}' +
    '\n.lang-switch a[aria-current="true"]{background:var(--cyan);color:#00232b}\n';
  h = h.replace(/<\/style>/, css + '</style>');
  const js = '\n<script>document.querySelectorAll("a.lang-alt").forEach(function(a){a.addEventListener("click",function(){if(location.hash)a.setAttribute("href",a.getAttribute("data-base")+location.hash)})});<\/script>';
  h = h.replace(/<\/body>/, js + '</body>');
  return h;
}

/* ---- build one language output for one page ---- */
function build(file, src, lang) {
  const ptPath = file === 'index.html' ? '' : file.replace(/.html$/, '');
  const ptUrl = '/' + ptPath;                 // '/', '/portfolio', ...
  const enUrl = '/en/' + ptPath;              // '/en/', '/en/portfolio', ...

  let h = removeLangElements(src, lang === 'pt' ? 'en' : 'pt');
  h = h.replace(/<html lang="[^"]*"/, `<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"`);
  h = h.replace(/<body class="lang-pt">/, `<body class="lang-${lang}">`);
  h = stripLangMechanics(h);
  h = rewriteToggle(h, { lang, ptUrl, enUrl });
  h = normalizeHead(h, { lang, ptUrl, enUrl });
  h = absolutizeAssets(h);

  if (lang === 'en') {
    // translate <title> + meta/og/twitter descriptions (exact-string, head only)
    const meta = EN_META[file];
    if (meta) for (const [pt, en] of meta) h = h.split(pt).join(en);
    // translate shared accessibility strings (aria-label/alt/placeholder)
    for (const [pt, en] of EN_ATTRS) h = h.split(pt).join(en);
    // nav/sidebar résumé link -> EN PDF (the CV section keeps both cards)
    h = h.replace(/class="cv-link" href="\/CV\/DE-Curriculo\.pdf"/g, 'class="cv-link" href="/CV/DE-Resume.pdf"');
    // contact form success page -> EN
    h = h.replace(/action="\/obrigado\.html"/g, 'action="/en/obrigado"');
    // index JSON-LD url -> EN
    if (file === 'index.html') h = h.replace(/"url": "https:\/\/espeledata\.com\/"/, '"url": "https://espeledata.com/en/"');
    // 404 / obrigado use absolute internal links -> keep them inside /en/
    if (file === '404.html' || file === 'obrigado.html') {
      h = h.replace(/href="\/"/g, 'href="/en/"');
      h = h.replace(/href="\/([a-z0-9-]+\.html)"/g, 'href="/en/$1"');
    }
  }

  // PT: mesma URL sem extensao usada no lado EN (o bloco acima ja reescreveu o EN)
  h = h.split("action=\"/obrigado.html\"").join("action=\"/obrigado\"");

  h = appendToggleSupport(h);
  return h;
}

/* ---- sitemap with hreflang alternates ---- */
function buildSitemap(lastmod) {
  const rows = [];
  for (const file of PAGES) {
    if (!INDEXABLE.has(file)) continue;
    const ptPath = file === 'index.html' ? '' : file.replace(/.html$/, '');
    const ptUrl = SITE + '/' + ptPath;
    const enUrl = SITE + '/en/' + ptPath;
    for (const loc of [ptUrl, enUrl]) {
      rows.push(
        '  <url>\n' +
        `    <loc>${loc}</loc>\n` +
        `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptUrl}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${ptUrl}"/>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        '  </url>'
      );
    }
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    rows.join('\n') + '\n</urlset>\n';
}

/* ---- run ---- */
const lastmod = process.argv[4] || '2026-07-21';
fs.mkdirSync(path.join(outDir, 'en'), { recursive: true });
let count = 0;
for (const file of PAGES) {
  const srcPath = path.join(srcDir, file);
  if (!fs.existsSync(srcPath)) { console.error('MISSING: ' + file); continue; }
  const src = fs.readFileSync(srcPath, 'utf8');
  fs.writeFileSync(path.join(outDir, file), build(file, src, 'pt'));
  fs.writeFileSync(path.join(outDir, 'en', file), build(file, src, 'en'));
  count++;
}
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemap(lastmod));
console.log(`split-i18n: ${count} pages -> PT (root) + EN (/en/), sitemap regenerated`);
