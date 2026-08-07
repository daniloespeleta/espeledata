# Estudo técnico e editorial do espeledata.com

Base: leitura integral de `index.html`, `portfolio.html`, `contact.html`, `case-fenix.html`, `case-abrindo-caminhos.html`, `case-sql-01.html`, `leea.html`, `split-i18n.js`, `scripts/validate-i18n.js` e `build.js`. Todos os números abaixo vêm direto do código-fonte, sem estimativa. Onde o valor é um `clamp()`, ele está transcrito inteiro.

Site sem framework, HTML+CSS+JS inline por página, com tokens `:root` repetidos em cada arquivo (mesmos valores em todos):

```
--bg:#0a0a0a; --bg2:#111113; --bg3:#17171a;
--cyan:#00d4ff; --coral:#ff5a47;
--white:#f0f0ee; --gray:#a3a39d; --gray2:#888882;
--border:rgba(255,255,255,0.08);
--sans:'Barlow',system-ui,sans-serif;
--cond:'Barlow Condensed',var(--sans);
--mono:'JetBrains Mono',Consolas,monospace;
--max:1100px (páginas home/leea) ou 960px (páginas de case)
```

`body` não define `font-size`: a base é o 16px padrão do navegador, `font-weight:300`, `line-height:1.7`, cor `--white`.

---

## 1. Escala tipográfica, com números reais

### 1.1 Títulos grandes (display)

| Papel | Seletor / página | Família | Peso | font-size | line-height | letter-spacing | transform | Cor |
|---|---|---|---|---|---|---|---|---|
| H1 hero, home | `.hero h1` (index.html) | `--cond` | 800 | `clamp(2.6rem,6vw,4.4rem)` | 1 | normal | uppercase | white, `.accent` cyan |
| H1 hero, leea | `.leea-hero h1` (leea.html) | `--cond` | 800 | `clamp(2.8rem,7vw,5rem)` | .96 | normal | uppercase | white, `.accent` cyan |
| H1 página interna, hero-band | `.hero-title` (contact.html) | `--cond` | 800 | `clamp(4rem,11vw,8rem)` | .88 | normal | uppercase | white, `.accent` cyan |
| H1 página interna, header simples | `.page-title` (portfolio.html) | `--cond` | 800 | `clamp(3rem,7vw,5rem)` | .92 | normal | uppercase | white, `.accent` cyan |
| H1 de case | `.case-title` (todos os `case-*.html`) | `--cond` | 800 | `clamp(2.6rem,6.5vw,4.2rem)` | .95 | normal | uppercase | white, `.accent` = cor do case |
| Section title (H2 padrão) | `.section-title` (index.html, leea.html) | `--cond` | 800 | `clamp(2.2rem,5vw,3.4rem)` | .98 | normal | uppercase | white, `.accent` cyan |
| H2 de bloco de case | `.block h2` (case-*.html) | `--cond` | 700 | `clamp(1.5rem,3vw,2.1rem)` | 1.1 | normal | uppercase | white, `.accent` = cor do case |
| Manifesto title (H2 alternativo) | `.manifesto-title` (index.html) | `--sans` | 300 | `clamp(1.85rem,4.2vw,3.1rem)` | 1.24 | -.01em | none | white, `<b>` em bold |
| Closing punch | `.closing-punch` (index.html) | `--cond` | 800 | `clamp(2.2rem,6vw,4rem)` | 1 | normal | uppercase | white, `.accent` cyan |

Achado: não existe um H1 único no site. Há três alturas de H1 muito diferentes conforme o tipo de página, o maior sendo o de `contact.html` (até 8rem/128px em telas largas), quase o dobro do H1 da home (até 4.4rem/70.4px). Isso é proposital (contact.html usa uma "hero-band" de impacto), mas é uma das maiores variações de escala do site.

### 1.2 Subtítulos e texto de introdução (lead)

| Papel | Seletor / página | Família | Peso | font-size | line-height | max-width | Cor |
|---|---|---|---|---|---|---|---|
| Hero sub, home | `.hero-sub` (index.html) | `--sans` | 300 (herdado) | `1.02rem` (16.3px) | 1.7 (herdado) | `48ch` | gray |
| Hero sub, leea | `.hero-sub` (leea.html) | `--sans` | 300 | `1.02rem` | 1.7 | `56ch` | gray |
| Section sub | `.section-sub` (index.html, leea.html) | `--sans` | 300 | 1rem (16px, sem override) | 1.7 | 580px / 640px | gray |
| Page sub | `.page-sub` (portfolio.html) | `--sans` | 300 | `.98rem` (15.7px) | 1.8 | 560px | gray |
| Case sub | `.case-sub` (case-*.html) | `--sans` | 300 | `1rem` (16px) | 1.8 | `60ch` | gray |
| Contact desc | `.contact-desc` (contact.html) | `--sans` | 300 | `.95rem` (15.2px) | 1.9 | `52ch` | gray |
| Closing lead | `.closing-lead` (index.html) | `--sans` | 300 | `clamp(1.05rem,2.2vw,1.4rem)` | 1.5 | `34ch` | gray |

### 1.3 Corpo de parágrafo (o texto de conteúdo real)

| Papel | Seletor / página | font-size | Observação |
|---|---|---|---|
| Parágrafo "About" | `.about-copy p` (index.html) | 1rem = 16px (sem override, herdado do body) | Maior corpo de texto contínuo do site |
| Parágrafo "Manifesto" | `.manifesto-body p` (index.html) | 1rem = 16px | idem |
| Parágrafo de case (`.prose p`) | case-*.html | 1rem = 16px | idem |
| **Narrativa dentro dos mini-cards de case** | `.mini-card p` (case-fenix, case-abrindo-caminhos, case-sql-01) | **`.86rem` = 13.76px** | É onde o raciocínio central de cada case é contado (Problema/Decisão/Execução/Aprendizado). Menor que o corpo padrão. |
| Texto de nota metodológica | `.note-bar p` (case-fenix.html) | `.86rem` = 13.76px | O parágrafo que explica "como os números foram medidos" |
| Texto de takeaway | `.takeaway p` (case-abrindo-caminhos.html) | `.85rem` = 13.6px | |
| Texto de stage (jornada numerada) | `.stages p` (case-abrindo-caminhos.html) | `.88rem` = 14.08px | |
| Texto de insight-box (citação/raciocínio central) | `.insight-box p` (todos os case) | `.98rem` = 15.68px, itálico | |
| Card desc, home | `.case-desc` (index.html) | `.87rem` = 13.92px | |
| Card desc, portfólio | `.card-desc` (portfolio.html) | `.86rem` = 13.76px | |

Achado central: o corpo de parágrafo "puro" (`.about-copy p`, `.manifesto-body p`, `.prose p`) está de fato em 16px, tamanho correto. Mas a maior parte do conteúdo explicativo real dos cases, o que carrega o raciocínio (mini-cards, note-bar, takeaways, cards de resumo) roda entre **13.6px e 14.1px**, abaixo do que se espera de texto de leitura confortável (recomendação usual é 16px mínimo para corpo). É aqui que a reclamação de "texto pequeno" do dono do site se confirma com número: quase todo o conteúdo argumentativo dos cases é secundarizado tipograficamente, tratado como legenda quando na prática é o texto principal da página.

### 1.4 Kicker, meta, legenda, rótulo (o andar mono)

| Papel | Seletor | font-size | letter-spacing | Cor |
|---|---|---|---|---|
| Kicker (padrão) | `.kicker` | `.68rem` = 10.88px | .2em | cyan |
| Kicker leea (variante sans) | `.kicker-leea` | 1.05rem = 16.8px | normal | white |
| Case tag | `.case-tag` | `.68rem` = 10.88px | .18em | accent-2 |
| Block label | `.block-label` | `.65rem` = 10.4px | .18em | accent-2 |
| Nav links | `.nav-links a` | `.68rem` = 10.88px | .1em | gray |
| Sidebar links | `.sidebar a` | `.78rem` = 12.48px | .12em | gray |
| Brand role | `.brand-role` | `.6rem` = 9.6px | .12em | cyan |
| Meta pill (case) | `.meta-pills li` | `.62rem` = 9.92px | .08em | gray |
| Metric label | `.metric-label` (case) | `.62rem` = 9.92px | .08em | gray |
| Stat label, home/leea | `.stat-cell .lbl` | `.6rem` = 9.6px | .1em | gray |
| Tl-period (timeline) | `.tl-period` | `.62rem` = 9.92px | .1em | cyan |
| Cert org | `.cert-org` | `.6rem` = 9.6px | .1em | cyan |
| Case kicker (card) | `.case-kicker` | `.6rem` = 9.6px | .14em | accent |
| Case meta (card) | `.case-meta` | `.6rem` = 9.6px | .06em | gray2 |
| Card num (portfólio) | `.card-num` | `.6rem` = 9.6px | .14em | accent |
| CV flag / note | `.cv-flag` / `.cv-note` | `.6rem` / `.62rem` | .14em / .06em | cyan / gray2 |
| Contact label | `.contact-label` | `.6rem` = 9.6px | .14em | cyan |
| Footer info | `.footer-info` | `.62rem` = 9.92px | .06em | gray2 |
| SVG caption | `.svg-caption` | `.62rem` = 9.92px | .1em | gray2 |
| Compare / ep note (leea) | `.compare-note` / `.ep-note` | `.6rem` = 9.6px | .04em | gray2 |
| Stat source (case) | `.stat-src` | `.6rem` = 9.6px | normal | gray2 |
| Tier badge (leea) | `.tier-badge` | **`.58rem` = 9.28px** | .12em | escuro sobre cyan |
| Label de campo de formulário | `.field-group label` (contact.html) | **`.58rem` = 9.28px** | .12em | cyan |
| Card tag (portfólio) | `.card-tag` | **`.56rem` = 8.96px** | .08em | cyan |
| Soon badge (portfólio) | `.soon-badge` | **`.56rem` = 8.96px** | .12em | gray2 |
| Filter count (portfólio) | `.filter-btn .count` | `.58rem` = 9.28px | herdado | herdado, opacidade .75 |

### 1.5 Chip, botão, número de destaque

| Papel | Seletor | font-size | Peso |
|---|---|---|---|
| Skill chip (mobile) | `.skill-chips li` | `.72rem` = 11.52px | normal |
| Skill chip (desktop, ampliado) | `.about-side .skill-chips li` | `.8rem` = 12.8px | normal |
| Artifact chip (leea) | `.artifact-chips li` | `.68rem` = 10.88px | normal |
| Texto de botão | `.btn` | `.7rem` = 11.2px | 500 |
| Botão de submit (form) | `.submit-btn` | 1rem = 16px, `--cond` 700 | 700 |
| Número grande (stat/metric) | `.stat-cell .num`, `.metric-num` | `clamp(2rem,4vw,2.8rem)` / `2.2rem` fixo | 800 |
| Número grande (case-abrindo, stat-row) | `.stat-num` | `2.4rem` fixo | 800 |

### 1.6 Resumo: o que está abaixo de 0.8rem (12.8px)

Praticamente toda a camada "mono" do site (kickers, labels, metas, legendas, badges, rodapé) roda abaixo de 0.8rem, isso é decisão de projeto (contraste hierárquico entre texto de leitura e texto de sistema/interface). O problema não é essa camada, é que **texto de leitura real** também cai nessa faixa em vários lugares:

- `.mini-card p` (narrativa dos cases, o texto mais importante de cada case): **13.76px**
- `.card-desc` / `.case-desc` (resumos de card no portfólio e na home): **13.76–13.92px**
- `.note-bar p`, `.takeaway p`, `.stages p`: **13.6–14.1px**

**Menor fonte do site inteiro: `0.56rem` (8.96px)**, usada em dois lugares: `.card-tag` (as etiquetas tipo "WHERE", "GROUP BY" nos cards SQL do portfólio) e `.soon-badge` (selo "em breve") em `portfolio.html`, linhas 114 e 118 do CSS. Logo atrás vêm `.field-group label` em `contact.html` e `.tier-badge` em `leea.html`, ambos em `0.58rem` (9.28px), o rótulo de campo de formulário sendo um caso sensível porque é instrução funcional, não decoração.

As "notas de rodapé minúsculas" que o dono citou batem com dado real: `.footer-info` roda em `.62rem` (9.92px), e as notas de fonte/metodologia dentro dos cases (`.stat-src`, `.compare-note`, `.ep-note`, `.svg-caption`) ficam entre `.6rem` e `.62rem` (9.6–9.9px), a faixa mais baixa de todo texto que carrega informação (não é só decoração de rótulo, é citação de fonte e ressalva de dado ilustrativo).

---

## 2. Espaçamento e ritmo

### 2.1 Largura útil e padding de section

- `--max:1100px` nas páginas "home" (index.html, leea.html); `--max:960px` nas páginas de case (case-*.html); portfolio.html e contact.html também usam `1100px`.
- `main section{max-width:var(--max);margin:0 auto;padding:clamp(3.5rem,8vw,6rem) 1.5rem}` (index.html, leea.html): padding vertical de section entre 56px e 96px, padding horizontal fixo de 24px.
- Páginas de case usam `.case-wrap{max-width:var(--max);margin:0 auto;padding:7.5rem 1.5rem 3rem}`: 120px no topo (compensando o nav fixo), 24px nas laterais, 48px embaixo.
- `portfolio.html`: `.page-header{padding:8rem 1.5rem 2.5rem}` (128px no topo).
- `contact.html`: `.contact-body{padding:4.5rem 1.5rem 6rem}` (72px topo, 96px base), com o hero-band acima tendo seu próprio `padding:3.4rem 0` (54.4px).

### 2.2 Ritmo vertical entre título e corpo

- Kicker → título: `.kicker{margin-bottom:1rem}` (16px).
- Título → subtítulo: `.section-sub{margin-top:1rem}` (16px); `.case-sub{margin-top:1.3rem}` (20.8px); `.hero-sub{margin-top:1.4rem}` (22.4px) / `1.5rem` em leea.
- Subtítulo → bloco de conteúdo: varia de `1.4rem` (about-copy, dentro do grid) a `2.6rem` (timeline, cases-grid, cv-grid), passando por `2rem`/`2.2rem`/`2.4rem` conforme a section. Não há um valor único: cada bloco define seu próprio `margin-top`, de 22.4px a 41.6px.
- Entre parágrafos de um mesmo bloco: `.about-copy p{margin-bottom:1.1rem}` (17.6px); `.manifesto-body p{margin-bottom:1.2rem}` (19.2px); `.prose p{margin-bottom:1.05rem}` (16.8px).
- Bloco de case a bloco de case: `.block{margin:3.2rem 0}` (51.2px).

### 2.3 Divisor entre seções

`.divider{height:1px;background:var(--border);max-width:var(--max);margin:0 auto}`: 1px de altura, cor `rgba(255,255,255,0.08)`, presente entre quase toda section de index.html e leea.html. Nas páginas de case não há `.divider`, os blocos se sucedem só com o `margin:3.2rem 0` do `.block`.

### 2.4 Gaps de grid (visão geral, detalhado na seção 3)

Grids com `gap:1px` sobre fundo `--border` (o "efeito grade" que simula bordas finas entre células): `.stats-grid`, `.certs-grid`, `.cards-grid` (portfólio), `.grid-2/3/4` (case), `.metrics-strip`, `.dates-grid`, `.stat-row`, `.takeaways`, `.agents-grid`, `.glossary-grid`, `.case-nav`. Grids com gap "de verdade" (espaço em branco, não linha): `.cases-grid{gap:1.4rem}`, `.cv-grid{gap:1.4rem}`, `.contact-grid{gap:.9rem}`, `.about-grid{gap:clamp(2.5rem,6vw,5rem)}`, `.hero-grid{gap:clamp(2rem,5vw,4rem)}`, `.tiers-grid{gap:1.4rem}`.

### 2.5 Medida de linha (largura de parágrafo)

| Seletor | max-width | Página |
|---|---|---|
| `.closing-lead` | `34ch` | index.html |
| `og-cover` intro | `20ch` | og-cover.html (fora do escopo pedido, citado à parte) |
| `.hero-sub` | `48ch` | index.html |
| `.contact-desc` | `52ch` | contact.html |
| `.hero-sub` | `56ch` | leea.html |
| `.manifesto-body` | `56ch` | index.html |
| `.case-sub` | `60ch` | todos os case |
| `.limits-not-list` | `60ch` | leea.html |
| `.ep-intro` | `60ch` | leea.html |
| `.stages p` | `62ch` | case-abrindo-caminhos.html |
| `.prose p` | `70ch` | todos os case |
| `.insight-box p` | `70ch` | todos os case |
| `.theory-note`, `.quote-block` | `70ch` | leea.html |
| `.limits-block` | `74ch` | leea.html |

Em fonte de 16px, isso equivale a algo entre ~34 e ~74 caracteres por linha útil, a maior parte do corpo argumentativo (`.prose p`, `.insight-box p`) fica em 70ch, um pouco acima da faixa clássica de conforto de leitura (45–75 caracteres), mas ainda dentro do aceitável. A medida de linha não é o problema do site, o tamanho de fonte é.

### 2.6 Breakpoints usados e o que muda

| Breakpoint | Onde aparece | O que muda |
|---|---|---|
| `max-width:640px` | case-*.html | `.grid-2`, `.grid-3` viram 1 coluna; `.takeaways` e `.case-nav` viram 1 coluna; `.map-list` empilha e mostra seta via `::before` |
| `max-width:700px` | index.html | `.cv-grid` vira 1 coluna |
| `max-width:760px` | index.html, leea.html | `.stats-grid` vira 2 colunas |
| `min-width:760px` | case-*.html | `.grid-4` vira 4 colunas (é 2 por padrão) |
| `max-width:820px` | case-*.html, leea.html (`.state-map-wrap`) | nav vira mobile (mesmo padrão do 900px nas outras páginas); mapa de estados empilha |
| `max-width:900px` | index.html, portfolio.html, contact.html | nav desktop → menu mobile (`.brand-role` some, `.nav-links`/`.lang-switch` somem, `.menu-btn` aparece); `.hero-grid`, `.about-grid`, `.contact-body`, `.tiers-grid` viram 1 coluna |
| `min-width:901px` | index.html | `.about-side` ganha altura 100%, chips do painel de skills aumentam de `.72rem` para `.8rem` |

O breakpoint de nav mobile não é consistente entre famílias de página: `900px` nas páginas "home-like" (index, portfolio, contact) contra `820px` nas páginas de case. É uma pequena divergência sistêmica entre o template de case e o resto do site.

---

## 3. Ocupação de tela e diagramação

### 3.1 Grids reais por seção

| Seção | Seletor | `grid-template-columns` | Breakpoint |
|---|---|---|---|
| Hero, home | `.hero-grid` | `1.15fr .85fr` | 1 col abaixo de 900px |
| Stats band (home/leea) | `.stats-grid` | `repeat(4,1fr)` | 2 col abaixo de 760px |
| About (home) | `.about-grid` | `1fr 1fr` | 1 col abaixo de 900px |
| Certificações | `.certs-grid` | `repeat(auto-fill,minmax(230px,1fr))` | fluido |
| Cases em destaque (home) | `.cases-grid` | `repeat(3,1fr)` | 1 col abaixo de 900px |
| CV download | `.cv-grid` | `1fr 1fr` | 1 col abaixo de 700px |
| Contato, itens de endereço | `.contact-grid` | `repeat(auto-fit,minmax(240px,1fr))` | fluido |
| Portfólio, grade de cards | `.cards-grid` | `repeat(auto-fill,minmax(300px,1fr))` | fluido |
| Contato, corpo 2 colunas | `.contact-body` | `1fr 1fr` | 1 col abaixo de 900px |
| Case, métricas | `.metrics-strip` | `repeat(auto-fit,minmax(150px,1fr))` | fluido |
| Case, mini-cards | `.grid-2` / `.grid-3` / `.grid-4` | `repeat(2,1fr)` / `repeat(3,1fr)` / `repeat(2,1fr)→repeat(4,1fr)@760` | 1 col abaixo de 640 (2 e 3) |
| Case, datas | `.dates-grid` | `repeat(auto-fit,minmax(160px,1fr))` | fluido |
| Case, stats de apoio | `.stat-row` | `repeat(auto-fit,minmax(180px,1fr))` | fluido |
| Case, takeaways finais | `.takeaways` | `repeat(2,1fr)` | 1 col abaixo de 640 |
| Leea, glossário | `.glossary-grid` | `repeat(auto-fill,minmax(260px,1fr))` | fluido |
| Leea, agentes | `.agents-grid` | `repeat(auto-fill,minmax(260px,1fr))` | fluido |
| Leea, oferta | `.tiers-grid` | `repeat(3,1fr)` | 1 col abaixo de 900px |
| Leea, mapa de estados | `.state-map-wrap` | `340px 1fr` | 1 col abaixo de 820px |

### 3.2 Como a hero divide a tela

- **Home (index.html)**: grid de 2 colunas assimétrico `1.15fr .85fr`, texto ligeiramente mais largo que a imagem. Coluna da esquerda: kicker especial (`.kicker-leea`) com efeito de "digitação" letra a letra em `DURAÇÃO`, H1, hero-sub (48ch), linha mono com palavra rotativa (`dado → segmento/jornada/conversão/retenção/receita`, troca a cada 2.2s), dois CTAs. Coluna da direita: retrato circular-retangular (`aspect-ratio:340/415`) com moldura cyan deslocada (`.hero-frame{inset:-12px 12px 12px -12px}`) e fallback para monograma "DE" se a imagem falhar. Fundo: canvas `#net` com rede de partículas animada em cyan (`opacity:.55`), desligada se `prefers-reduced-motion` ou tela `<640px`.
- **Leea (leea.html)**: hero de 1 coluna só, `.hero-inner{max-width:720px}`, sem imagem, sem grid. Fundo: SVG estático de "sulcos" (`.hero-grooves`, 5 curvas horizontais), uma delas animada com `stroke-dashoffset` fingindo fluxo. H1 maior que o da home (ver 1.1), hero-sub com 2 parágrafos (PT + EN mantidos como blocos `<p>` separados, não spans inline como no resto do site), nota de vocabulário (`.hero-note`), 2 CTAs.
- **Contact (contact.html)**: não é grid, é uma faixa cheia (`hero-band`) com H1 gigante (até 8rem) e um `.accent-block` absoluto cobrindo 38% da largura à esquerda (`rgba(0,212,255,.06)` com borda direita cyan), decoração pura, sem conteúdo dentro.
- **Portfólio (portfolio.html)**: sem hero visual, é um `<header class="page-header">` simples: kicker, H1, page-sub, sem grid nem imagem.
- **Cases (case-*.html)**: sem hero visual, `<header class="case-hero">` com `border-top:4px solid var(--accent)`, tag, H1, sub, lista de `meta-pills`.

### 3.3 Padrões de card

| Componente | Borda | Fundo | Padding | Hover |
|---|---|---|---|---|
| `.case-card` (home) | `1px solid var(--border)` | `--bg2` | `.case-body{padding:1.8rem 1.6rem}` | `translateY(-4px)`, borda vira `rgba(0,212,255,.35)` |
| `.cv-card` (home) | `1px solid var(--border)` | `--bg2` | `1.8rem 1.6rem` | `translateY(-3px)`, borda cyan, seta `::after` desce |
| `.cert` (home) | nenhuma borda própria, é célula de grid com `gap:1px` sobre `--border` | `--bg2` | `1.2rem 1.3rem` | nenhum |
| `.card` (portfólio) | idem, célula de grid | `--bg2` | `1.9rem 1.7rem` | fundo vira `--bg3`, barra superior de 4px aparece via `::before`, seta `::after` aparece |
| `.mini-card` (case) | idem, célula de grid | `--bg2` | `1.5rem 1.3rem` | nenhum hover próprio |
| `.stat-cell` / `.metric` / `.stat` | idem, célula de grid | `--bg2` | `1.8rem 1.2rem` / `1.6rem 1.2rem` / `1.8rem 1.4rem` | nenhum |
| `.chip` (`skill-chips li`) | `1px solid var(--border)`, `.hot` fica `rgba(0,212,255,.45)` | transparente | `.62rem 1.05rem` (mobile) / `.72rem 1.2rem` (desktop) | nenhum |
| `.tier-card` (leea) | `1px solid var(--border)`, destaque `rgba(0,212,255,.5)` + `translateY(-10px)` no desktop | `--bg2` / `--bg3` no destaque | `1.8rem 1.6rem` | nenhum |

O padrão dominante no site é "grid com `gap:1px` sobre `--border`", que desenha bordas de 1px entre células sem declarar `border` em cada uma. É reaproveitado em praticamente todo agrupamento de dado curto (stats, certs, métricas, mini-cards, glossário, agentes). Cards com borda própria e hover de elevação (`.case-card`, `.cv-card`, `.tier-card`) são reservados para elementos clicáveis que levam a outra página ou ação.

### 3.4 Onde a cor de destaque aparece e com que regra

- **Cyan (`--cyan`, `#00d4ff`)** é a cor de ação e destaque padrão: links, CTA sólido, `.accent` em títulos, kickers, números de stat, estado ativo do toggle de idioma, foco de teclado (`:focus-visible`), bordas de hover.
- **Coral (`--coral`, `#ff5a47`)** aparece só como accent alternativo de case: `case-abrindo-caminhos.html` e `case-boa-leitura.html` (`--accent:#ff5a47`) e no card correspondente na home/portfólio via classe `.cc-coral`. Serve para diferenciar visualmente "case conceitual" de "projeto real" (que usa cyan). Em `leea.html`, coral só aparece nos estados de risco do mapa (`[data-state="risco"]`) e no rate-num do comparador (retenção como número estático "achatado").
- Cada página de case declara duas variáveis próprias, `--accent` e `--accent-2`, que redirecionam para cyan ou coral conforme o caso, mas o token de base nunca muda, é sempre reatribuição de `--cyan`/`--coral`.

### 3.5 Como cada página interna abre

- **contact.html**: `hero-band` cheia (largura de viewport), fundo `--bg2`, H1 gigante, `accent-block` decorativo à esquerda. É o único padrão de abertura "cheio" do site.
- **case-*.html**: `breadcrumb` mono pequeno → `case-hero` com barra superior de 4px na cor do case, tag, H1, sub, meta-pills. Sem largura cheia, já dentro do `.case-wrap` com `max-width:960px`.
- **portfolio.html**: `page-header` simples dentro do `main`, sem elemento decorativo, sem imagem, só kicker + H1 + sub.
- **index.html**: `hero` com canvas de partículas, grid 2 colunas, retrato.
- **leea.html**: `leea-hero` de 1 coluna com SVG de fundo, sem grid, sem imagem de pessoa (proposital: é uma "marca", não uma pessoa).

Três padrões de abertura distintos convivendo no site: hero-band cheia (contact), header simples (portfolio), case-hero com barra (case). A home e a leea têm um quarto padrão próprio (hero com grid/imagem vs hero de 1 coluna com SVG).

---

## 4. Estrutura de conteúdo por página

### index.html (home)
1. `hero`: kicker especial → H1 → hero-sub → linha rotativa (dado → X) → 2 CTAs → visual (retrato)
2. `stats-band`: 4 números (8+ anos, 50K+ leads, ~25% abertura, 500% crescimento)
3. divider
4. `sobre`: kicker → H2 → 3 parágrafos (about-copy) → 2 CTAs | lado: abas de competências (Estratégia/Automação/Dados/IA)
5. divider
6. `trajetoria`: kicker → H2 → sub → timeline em acordeão (5 posições, mais recente já aberta) → grade de certificações
7. divider
8. `manifesto` (id `abordagem`): kicker → título alternativo (sans, não uppercase) → 3 parágrafos → 1 CTA
9. divider
10. `cases`: kicker → H2 → sub → 3 case-cards → CTA para GitHub
11. divider
12. `cv`: kicker → H2 → sub → 2 cv-cards (PT/EN)
13. divider
14. `contato`: kicker → H2 → grade de contact-items → CTA para contact.html
15. divider
16. `closing`: lead curto → punchline grande
17. footer

Padrão comum: **kicker → H2 (section-title, com `.accent`) → sub → conteúdo**, repetido em quase toda section. Foge do padrão: `manifesto` (título não é `.section-title`, é `.manifesto-title`, sans em vez de cond, minúsculo em vez de uppercase) e `closing` (não tem kicker nem H2, só duas frases de fechamento).

### portfolio.html
1. `page-header`: kicker → H1 → sub (sem hero visual)
2. `filters`: botões de filtro (Todos/Projetos/Estratégia/SQL, com contagem) + linha de resultados (`aria-live`)
3. `cards-grid`: 8 cards (1 featured full-width, 2 estratégia, 5 SQL)
4. footer

É a página mais "utilitária" do site: sem manifesto, sem stats-band, sem CTA de contato no meio, só listagem filtrável.

### contact.html
1. `hero-band`: label → H1 gigante (variante default "Contato" ou variante "leea" trocada via JS se a URL tiver `?leea=1`)
2. `contact-body` (grid 2 col): esquerda = section-label → H2 → desc → bloco de e-mail destacado → 3 botões de link (LinkedIn/WhatsApp/GitHub); direita = section-label → formulário Netlify (nome, e-mail*, empresa, mensagem*, honeypot)
3. footer

Único ponto de personalização dinâmica de conteúdo do site: o parâmetro `?leea=1` troca o H2 e a descrição de "Entre em Contato" para "Peça sua Leitura" via JS inline, sem alterar layout.

### case-fenix.html (projeto real)
1. breadcrumb
2. case-hero: tag → H1 → sub → meta-pills (Projeto real / Educação / ~2 meses)
3. metrics-strip: 4 métricas (~25% abertura, +35% CTR, +20% matrículas, −25% custo)
4. **note-bar de metodologia** ("como os números foram medidos"), único entre os 3 cases lidos
5. block "Narrativa": grid-2 com 4 mini-cards (Problema/Decisão/Execução/Aprendizado)
6. block "Stack": meta-pills de ferramentas
7. block "Raciocínio central": insight-box (citação-síntese)
8. case-nav (anterior/próximo/todos)
9. footer

### case-abrindo-caminhos.html (case conceitual)
1. breadcrumb → case-hero (tag/H1/sub/meta-pills, sem métricas de negócio, é "case conceitual de estratégia")
2. 12 blocos numerados (01 a 12): ponto de partida (grid-4) → abordagem (map-list de/para) → segmentação (key-callout + grid-4 de 12 públicos) → arquitetura (grid-3 de frentes) → lifecycle (`<ol class="stages">` de 5 estágios com KPI-pill) → aquisição (grid-3) → canal de advocacia (stat-row com números ilustrativos: +2M alcance, 23+ embaixadores, 348K alcance/post) → ativação (grid-4 de canais + note-bar) → onboarding (key-callout + grid-3) → mensuração (grid-4 de KPIs + note-bar) → validação (stat-row com **citação de fonte real**, Instituto Ipsos, 59%) → encerramento (takeaways grid-2)
3. case-nav
4. footer

É o case mais longo e mais denso do site (783 linhas), o único que cita uma fonte externa com `<cite>`.

### case-sql-01.html (técnico curto)
1. breadcrumb → case-hero (tag/H1/sub, sem meta-pills)
2. metrics-strip: 3 métricas (5K leads/mês, −40% tempo, +22% conversão)
3. block "Contexto": 1 parágrafo
4. block "Sobre o caso": 1 parágrafo com números embutidos (450 SQLs)
5. block "Query SQL": bloco de código com syntax highlight manual (spans `.kw`/`.str`/`.num`/`.cm`)
6. block "Visualização do processo": SVG de funil desenhado à mão (base bruta 5.000 → filtro WHERE → baixo fit / 450 SQLs)
7. block "Explicação de negócio": insight-box
8. case-nav
9. footer

É o mais curto e mais "prova concreta por artefato" (mostra a query de verdade, não só o resultado).

### leea.html
1. hero (1 coluna, ver 3.2)
2. stats-band: 4 números, mas **de método**, não de resultado (6 agentes, 5 etapas, 4 camadas, 3 níveis)
3. divider → "O problema": kicker → H2 → sub → **comparador em abas** (taxa estática vs sequência de estados, com 3 "clientes ilustrativos" em ticks coloridos)
4. divider → "A virada": kicker → H2 → sub → legenda de estados → **mapa de estados clicável** (SVG + 4 botões + painel de detalhe) → **scrubber de episódios** (input range de 12 semanas)
5. divider → "O método": kicker → H2 → sub → sequência de etapas em mono → grade de glossário (6 termos) → nota teórica
6. divider → "O CICLO": kicker → H2 → sub → **acordeão `<details>`** de 5 etapas (C-I-C-L-O), cada uma com artefato de saída
7. divider → "Camadas e Agentes": kicker → H2 → sub → pilha de 4 camadas → grade de 6 agentes → quote-block
8. divider → "Oferta": kicker → H2 → sub → 3 tier-cards (1 destacado, com CTA)
9. divider → "Limites": kicker → H2 → prosa de limite + lista "o piloto não promete"
10. divider → "CTA final": kicker → H2 → sub → CTA + link de volta
11. footer

leea.html é, disparado, a página com mais componentes interativos exclusivos (comparador de abas, mapa de estados, scrubber, acordeão) e a única cujo stats-band mede o próprio framework em vez de medir resultado de cliente.

---

## 5. Menu e navegação

### 5.1 Nav desktop (varia por página)

| Página | Itens do nav desktop |
|---|---|
| index.html | Sobre · Agência Leea (cyan) · Trajetória · Portfólio · Contato · Currículo↓ |
| portfolio.html, contact.html, case-*.html | Início · Sobre · Portfólio · Contato · Currículo↓ (**sem** link para Agência Leea) |
| leea.html | Início · Sobre · Portfólio · Agência Leea (atual) · Contato (com `?leea=1`) (**sem** link de Currículo) |

Achado: o link para a "Agência Leea" só existe no nav de `index.html` (mais o `eco-badge` "Em novo ecossistema" dentro do `brand-role`) e na própria `leea.html`. Nenhuma outra página do site (portfólio, contato, cases) linka para leea.html. Isso significa que quem entra direto num case ou no portfólio não tem caminho de nav para a Leea, só via home.

### 5.2 Sidebar mobile

O sidebar de `index.html` tem um item a mais que o nav desktop: **Cases** (`#cases`), que não existe no nav desktop de nenhuma página. Fora isso, mobile e desktop listam os mesmos links. `leea.html` mantém a mesma assimetria (sem Currículo) também no sidebar.

### 5.3 Estado ativo

Marcado com `aria-current="page"` fixo no HTML de cada arquivo (não é calculado por JS): o link cuja página é a atual recebe o atributo, e o CSS `.nav-links a:hover,.nav-links a[aria-current="page"]{color:var(--cyan)}` estiliza igual a hover. É um estado estático por arquivo, então cada página "sabe" manualmente qual link marcar.

### 5.4 Toggle PT/EN, antes e depois do build

**Antes do build** (código-fonte, cada página bilíngue): dois `<button data-lang="pt|en" aria-pressed="...">`, controlados por `setLang()` inline em cada página. A função troca a classe do `<body>` entre `lang-pt`/`lang-en`, atualiza `<html lang>`, atualiza `aria-pressed`, troca o `href` dos links de currículo (`CV/DE-Curriculo.pdf` ↔ `CV/DE-Resume.pdf`) e persiste a escolha em `localStorage`. O conteúdo das duas línguas já está no mesmo DOM, em elementos com classe `.pt`/`.en`, e o CSS `.lang-pt .en{display:none}` / `.lang-en .pt{display:none}` esconde o idioma não ativo.

**Depois do build** (`split-i18n.js`, gera `_deploy/`): não existe mais JS de idioma. Cada página vira dois arquivos estáticos monolíngues (`_deploy/<page>` em PT e `_deploy/en/<page>` em EN), com os elementos do idioma oposto **fisicamente removidos** do HTML (`removeLangElements`, um removedor balanceado de tags que respeita aninhamento). Os dois botões viram dois `<a class="lang-alt">` reais, apontando um para o outro (PT → raiz, EN → `/en/`), com `hreflang` e `aria-current="true"` no idioma ativo. `scripts/validate-i18n.js` roda depois do build e falha o CI se sobrar qualquer `class="en"` no arquivo PT (ou vice-versa), se `setLang` ainda existir no HTML final, se o `<h1>` duplicar, ou se restar qualquer travessão (`—`/`–`) no arquivo, entre outras 15+ checagens.

### 5.5 O que é específico do Danilo (pessoa) vs estrutura reaproveitável

**Específico da pessoa (não reaproveitável sem edição de conteúdo):**
- `.brand-name` = "Danilo Espeleta", `.brand-role` = "CRM & Lifecycle Marketing"
- Link e card de Currículo (`CV/DE-Curriculo.pdf`, `CV/DE-Resume.pdf`)
- Item de sidebar/nav "Trajetória" (ancorado na timeline pessoal) e "Cases" (ancorado nos cases pessoais)
- JSON-LD `@type:"Person"` em index.html (nome, e-mail, LinkedIn, GitHub, endereço)
- Rodapé: nome, e-mail, LinkedIn, GitHub

**Estrutura reaproveitável (só troca o rótulo/conteúdo):**
- O componente `.site-nav` inteiro (posição fixa, blur, borda inferior)
- `.sidebar` + `.sidebar-overlay` + `.menu-btn` (mobile)
- `.lang-switch` (grupo de botões PT/EN)
- O próprio mecanismo de `aria-current="page"` por link

---

## 6. Voz e padrão editorial observado no texto real

### 6.1 Tamanho de parágrafo (contagem real)

- `.about-copy` parágrafo 1 (index.html, PT): **63 palavras** ("Especialista em CRM que veio das Letras. A ordem importa. (...) E CRM, no fim, é a operação de escutar essa linguagem em escala.")
- `.about-copy` parágrafo 3 (index.html, PT): **33 palavras**, o mais curto dos três, fecha a seção com frase de efeito.
- `.prose p` (case-abrindo-caminhos.html, seção "A abordagem"): **34 palavras**.
- Parágrafos de case tendem a ficar entre 30 e 90 palavras, quase sempre 2 a 4 frases, com pelo menos uma frase curta isolada por parágrafo (regra de voz do projeto, confirmada no texto real: "A ordem importa.", "Vive de prova.", "Não é pauta de minoria, é expectativa de maioria.").

### 6.2 Como os títulos são construídos

Padrão dominante: **frase curta declarativa + palavra ou trecho final em `.accent` (cyan)**. Cinco exemplos reais, transcritos:

1. `Leio linguagem antes de dado. **A jornada nasce daí.**` (H1 hero, index.html)
2. `Quem **sou eu**` (H2, seção Sobre, index.html)
3. `Do call center **ao lifecycle**` (H2, seção Trajetória, index.html)
4. `CRM & Lifecycle **na prática**` (H2, seção Cases, index.html)
5. `Retenção lida como **taxa estática**` (H2, seção "O problema", leea.html)

Variante nos cases, quando o título é o próprio nome do projeto sem jogo de frase: `CRM **Turnaround**` (case-fenix.html) e `Abrindo **Caminhos**` (case-abrindo-caminhos.html), o acento recai sobre parte do próprio nome, não sobre uma palavra de sentido à parte.

### 6.3 Como os cases apresentam número e prova

Estrutura do case-fenix.html, a mais concreta do site:
1. **Métricas primeiro** (`metrics-strip`), antes de qualquer explicação: ~25% abertura, +35% CTR, +20% matrículas, −25% custo.
2. **Nota de metodologia logo em seguida**, dizendo exatamente como cada número foi medido (período pré vs pós, dentro do RD Station, ~2 meses, taxa nativa sobre entregues, atribuição por origem de campanha). Isso é raro entre os 3 cases lidos, só o case-fenix (o projeto real) tem essa camada de transparência.
3. **Narrativa em 4 passos fixos**: Problema → Decisão → Execução → Aprendizado, cada um com 2-3 frases e pelo menos um termo em `<strong>`.
4. **Stack nomeada** (ferramentas reais: RD Station, Lead Scoring, Mautic, Power BI, A/B Testing).
5. **Uma frase de raciocínio central** em itálico, isolada em `insight-box`, que resume a tese do case ("CRM não é uma ferramenta. É um método.").

O case-sql-01.html reforça a prova com **artefato real**: mostra a query SQL inteira, com sintaxe colorida, e um SVG de funil com os números do funil desenhados (5.000 → 450). Nenhum dos textos fica só na alegação, sempre aponta para ferramenta, ação ou trecho de código.

### 6.4 Regras visíveis de escrita

- **Proibição de travessão**: confirmada em código, não só em CLAUDE.md. `scripts/validate-i18n.js` conta ocorrências de `—` (em-dash) e `–` (en-dash) no HTML final e falha o build se houver qualquer uma (`ok(dashes === 0, ...)`). É regra de CI, não só de estilo.
- **Uso de `−` (U+2212, sinal de menos matemático)**: aparece em métricas negativas, ex. `−30% de leads não qualificados`, `−25% de custo operacional`, `−40% de turnover`. Não é hífen comum nem en-dash, é o caractere de menos, provavelmente para escapar da checagem de travessão e ainda assim comunicar "queda".
- **Uso de `~` em aproximação**: recorrente em toda métrica que não é exata, `~2%`, `~25%`, `~2 meses`, `~5.000 leads`, `~$100 KB` (nota de tamanho de PDF). É convenção consistente para sinalizar "isso é estimativa, não número fechado".

---

## 7. O que é replicável para outra marca

### Diretamente reaproveitável, trocando só conteúdo

- **Sistema de tokens `:root`** (cores, fontes, `--max`): é a base de tudo, já pensado para ser copiado por página.
- **`.site-nav` + `.sidebar` + `.menu-btn` + `.lang-switch`**: shell de navegação completo, incluindo responsividade.
- **`.kicker` / `.section-title` / `.section-sub`**: o trio que abre quase toda seção do site.
- **`.divider`**: separador de seção.
- **Padrão de grid "linha fina" (`gap:1px` sobre `--border`)**: `.stats-grid`/`.metrics-strip`/`.certs-grid`/`.grid-2/3/4`/`.dates-grid`/`.stat-row`/`.takeaways`/`.agents-grid`/`.glossary-grid`. É o componente mais versátil do site, serve para qualquer conjunto de dados curtos em célula.
- **`.btn` / `.btn-solid` / `.btn-outline`**: sistema de botão.
- **`_template/case-shell.html`**: já existe como template dedicado (confirmado no grep, arquivo à parte com a mesma estrutura de `.case-wrap`, `.case-hero`, `.metrics-strip`, `.block`, `.prose`, `.mini-card`, `.stages`, `.code-wrap`, `.insight-box`, `.case-nav`), pronto para receber conteúdo de qualquer marca.
- **`.reveal` (scroll reveal via IntersectionObserver) e contador animado (`[data-count]`)**: mecânica de JS agnóstica de conteúdo.
- **Todo o pipeline `split-i18n.js` + `validate-i18n.js` + `build.js`**: não depende de nenhum texto do Danilo, só da lista `PAGES`/`EN_META` no topo do arquivo, que precisaria ser reescrita para as páginas da nova marca.
- **`.hero-band` + `.accent-block`** (contact.html): padrão de abertura "cheia" reaproveitável para qualquer página que precise de impacto de título sem imagem.
- **`.tier-card` / `.tiers-grid`** (leea.html): grade de planos/níveis de oferta, sem nada específico de Danilo.
- **`.ciclo-list` (`<details>` accordion)**, **`.tablist`/`.tabpanel` (abas)**, **`.tl-head`/`.tl-body` (timeline expansível)**: três padrões de "revelar conteúdo sob demanda", nenhum amarrado a texto pessoal.

### Intransferível, porque depende da identidade do Danilo

- Todo o conteúdo de `Sobre`/`Trajetória`: timeline de cargos, certificações, formação em Letras, foto/retrato, monograma "DE".
- Cases reais e conceituais como conteúdo (Fênix, Abrindo Caminhos, Boa Leitura, SQL 01-05): números, ferramentas e narrativa são histórico de carreira, não template.
- JSON-LD `Person` (nome completo, e-mail, redes) em index.html.
- Cards de Currículo (`.cv-card`) e o próprio par de PDFs.
- Rodapé com nome e contatos pessoais.
- O `eco-badge` "Em novo ecossistema" e o link cruzado home ↔ leea, que existe justamente para amarrar a marca Leea à pessoa Danilo. Numa página só de agência, sem o "hub" pessoal, essa ponte não faria sentido.

---

## 8. Diagnóstico crítico da `leea.html` atual

### 8.1 Tipografia e espaçamento: consistente com o resto do site, com pequenos desvios

`leea.html` reaproveita literalmente o mesmo CSS de `index.html` (tokens, `.kicker`, `.section-title`, `.stats-grid`, `.btn`, `.divider`, `.reveal`), então não há ruptura de escala tipográfica: os tamanhos de fonte batem com a home. Os dois desvios reais:

- **H1 da leea é maior que o H1 da home**: `clamp(2.8rem,7vw,5rem)` contra `clamp(2.6rem,6vw,4.4rem)`. Em telas largas, o topo de 5rem (80px) supera o da própria home (4.4rem/70.4px), o que é estranho para uma página que deveria se sentir "dentro" do site do Danilo, não maior que ele.
- **Padding-top do hero maior**: `clamp(8rem,15vw,10.5rem)` contra `clamp(7rem,14vw,9.5rem)` da home, porque leea.html soma uma barra de progresso de leitura (`.progress-track`, 3px) acima do nav, empurrando tudo mais para baixo. É justificável, mas é outro pequeno acúmulo de "leea é um pouco maior/mais pesada que o resto".

Fora isso, a página não é tipograficamente menor nem mais densa que o padrão, então o problema de "texto pequeno" não é mais grave aqui do que no resto do site (ver seção 1.6, que já é geral).

### 8.2 Onde o texto fica abstrato/conceitual demais

O contraste mais forte não é tipográfico, é de **prova**. Todo o resto do site (index.html e os 3 cases lidos) segue um padrão fixo: alegação → número → ferramenta nomeada → ação nomeada. `leea.html` inverte isso: alegação → framework nomeado → glossário. Evidências diretas no próprio texto:

- Três disclaimers explícitos e repetidos: *"Dado ilustrativo de demonstração, não é resultado de cliente"* (seção "O problema"), *"Dados ilustrativos de demonstração, não resultado de cliente"* (mapa de estados) e *"Trajetória ilustrativa de demonstração, não é dado de cliente real"* (scrubber de episódios). Nenhum outro texto do site precisa desse tipo de ressalva, porque os outros textos são sobre fatos reais (Fênix, LBV, Monchu). Isso por si só marca leea.html como o único conteúdo do site que é hipótese de produto, não histórico verificável.
- O stats-band da leea mostra **6 agentes, 5 etapas, 4 camadas, 3 níveis**: são contagens de partes do próprio framework, não evidência de resultado. Comparado ao stats-band da home (8+ anos, 50K+ leads, ~25% de abertura, 500% de crescimento), que são todos números de impacto medido, a leea usa o mesmo componente visual para comunicar uma coisa estruturalmente mais fraca (sumário, não prova).
- **Nenhuma ferramenta de CRM é nomeada em leea.html.** O resto do site nomeia RD Station, Mautic, HubSpot, n8n, Make, Zapier, Power BI, SQL, em quase toda seção. Leea fala em "intervenção de CRM", "canal", "camada determinística, código e dados", sempre em nível de categoria, nunca cita uma plataforma real, nem mesmo como exemplo hipotético.
- Nenhuma linha de SQL, nenhum prompt, nenhum trecho de linguagem de cliente real ou sequer fictício-mas-específico aparece na página. As "listas de sinais de linguagem" (ex.: *"Menções de continuidade, como 'vou usar de novo' ou 'na próxima vez'"*) são o item mais próximo de exemplo concreto, mas seguem sendo bullets genéricos, não uma transcrição de caso.

### 8.3 Seções que entregam conceito sem exemplo prático

- **"O método" (glossário Sulco)**: define 6 termos (Sulco, Sulco de Dados, Arquitetura de Trajetórias, Mapa de Estados, Ponto de Virada, Calibração Viva) em uma frase cada, sem nenhum exemplo de um Ponto de Virada real ou hipotético sendo identificado a partir de dado de linguagem. Compare com case-sql-01.html, que não define "SQL" em abstrato, mostra a query.
- **"Camadas e Agentes"**: nomeia 6 agentes (Leea Intake, Leea Evidence, Leea Trajetória, Leea Retention, Leea Intervention, Leea QA & Learning) com uma frase de função cada, sem nenhum exemplo de entrada/saída, sem print, sem trecho de output. Fica no nível de organograma.
- **"Oferta" / tiers**: a lista de entregáveis do Nível 2 (`problem_contract`, `episode_fact`, `decision_record`, `intervention_spec`, `measurement_record`) aparece como nomes de artefato (`artifact-chips`) sem mostrar o formato de nenhum deles. O site do Danilo, quando lista entregável, mostra o entregável (query SQL, funil SVG com número real, nota de metodologia com fórmula de cálculo).
- **"O CICLO"**: cada uma das 5 etapas (Contexto e Contrato, Identidade e Instrumentação, Coortes/Ciclos/Episódios, Leitura e Decisão, Orquestração e Otimização) tem uma frase de definição e a lista de artefato que produz, mas nenhuma etapa mostra um artefato de exemplo preenchido.

### 8.4 Resumo do diagnóstico

`leea.html` não erra em tamanho de fonte nem em ritmo de espaçamento, herda corretamente o sistema do site. Erra em **densidade de aparato interativo sem lastro de prova**: é a página com mais widgets exclusivos do site inteiro (comparador de abas, mapa de estados clicável, scrubber de episódios, acordeão de 5 passos) para descrever um método que, ao contrário de todo o resto do portfólio, não tem nenhum caso real, nenhuma ferramenta nomeada e nenhum artefato de exemplo mostrado por trás. O site do Danilo convence com número, ferramenta e ação; leea.html, no estado atual, convence com diagrama e vocabulário.
