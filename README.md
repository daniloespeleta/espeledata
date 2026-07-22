# espeledata.com

[![i18n validation](https://github.com/daniloespeleta/espeledata/actions/workflows/i18n.yml/badge.svg)](https://github.com/daniloespeleta/espeledata/actions/workflows/i18n.yml)

Site pessoal e portfólio de **Danilo Espeleta** (CRM & Lifecycle Marketing).
Estático, feito à mão, sem framework. Bilíngue PT/EN.

## Arquitetura

Cada página é **um único arquivo bilíngue** (spans `.pt` / `.en`). No build, o
`split-i18n.js` separa por idioma e gera:

- **PT** na raiz: `/`, `/portfolio.html`, `/case-*.html`, ...
- **EN** em `/en/`: `/en/`, `/en/portfolio.html`, ...

Cada URL final tem **um só idioma no DOM**, com `<html lang>`, `canonical`,
`hreflang` recíproco (pt-BR / en / x-default), `og:locale` e título/descrição
localizados. Assets compartilhados (`/favicon.svg`, `/CV/`, `/assets/`) ficam em
caminho absoluto; links entre páginas ficam relativos (navegação EN fica em `/en/`).

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html`, `portfolio.html`, `contact.html`, `case-*.html`, `404.html`, `obrigado.html` | Fonte bilíngue (o que você edita) |
| `split-i18n.js` | Split PT/EN + sitemap + traduções de `<head>` EN |
| `build.js` | Build cross-platform: copia assets + roda o split para `_deploy/` |
| `scripts/validate-i18n.js` | Validador de i18n usado no CI |
| `og-cover.html` → `og-cover.png` | Fonte e imagem Open Graph (1200×630) |
| `_template/case-shell.html` | Template para novos cases |
| `_site-antigo/` | Backup do site anterior |
| `netlify.toml`, `_redirects` | Config de deploy e redirects (404 localizado em `/en/`) |

`_deploy/` é **gerado** (não versionado).

## Desenvolvimento

```bash
node build.js               # gera _deploy/ (PT na raiz + EN em /en/)
node scripts/validate-i18n.js   # valida o i18n do _deploy/
```

`deploy.ps1` faz o mesmo no Windows e ainda empacota um `.zip` para upload manual.

## Deploy

Deploy contínuo pelo **Netlify**, ligado a este repositório. Cada `git push` no
`main` dispara um build (`node build.js`) que publica em
[espeledata.com](https://espeledata.com).

## CI

A cada push e em pull requests, a Action **i18n validation** builda o site e roda
`scripts/validate-i18n.js`, que falha o build se houver: vazamento de idioma,
`canonical`/`hreflang`/`og:locale` errado, `<h1>` duplicado, JS/CSS de idioma
remanescente, asset relativo, ou **travessão / em-dash** na copy.

## Convenção de escrita

Na copy (PT e EN): **sem travessão, em-dash ou en-dash**. Usar vírgula, ponto,
dois-pontos ou parênteses. A regra é validada no CI.
