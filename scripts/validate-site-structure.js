/* ============================================================
 * scripts/validate-site-structure.js  —  Node port of
 * validate-site-structure.ps1
 * ------------------------------------------------------------
 * Guards the desktop <nav> and mobile <div class="sidebar">
 * link sequences on every page: same hrefs, same order, same
 * count. Message-for-message parity with the .ps1 version so
 * either can run depending on what's on PATH (pwsh vs node).
 *
 * Run standalone:
 *   node scripts/validate-site-structure.js
 * or via scripts/site-guardian.js, which spawns this as a step.
 * Pure Node built-ins.
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const siteRoot = path.join(__dirname, '..');

const expected = {
  'index.html': {
    desktop: ['#sobre', 'leea.html', '#trajetoria', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['#sobre', 'leea.html', '#trajetoria', '#cases', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'portfolio.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'leea.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'leea.html', 'notas.html', 'contact.html?leea=1'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'leea.html', 'notas.html', 'contact.html?leea=1'],
  },
  'notas.html': {
    desktop: ['index.html', 'index.html#sobre', 'leea.html', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'leea.html', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'contact.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-abrindo-caminhos.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-boa-leitura.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-espeledata.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-lifecycle-lint.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-segment-brief.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-lentes.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-fenix.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-leea.html': {
    desktop: ['index.html', 'portfolio.html', 'leea.html', 'contact.html'],
    mobile: ['index.html', 'portfolio.html', 'leea.html', 'contact.html'],
  },
  'case-sql-01.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-sql-02.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-sql-03.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-sql-04.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
  'case-sql-05.html': {
    desktop: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
    mobile: ['index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf'],
  },
};

function compareLinkSequence(label, fragment, expectedHrefs) {
  const actualHrefs = [...fragment.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const issues = [];

  if (actualHrefs.length !== expectedHrefs.length) {
    issues.push(`${label} possui ${actualHrefs.length} links; esperado ${expectedHrefs.length}`);
  }

  const limit = Math.max(actualHrefs.length, expectedHrefs.length);
  for (let i = 0; i < limit; i++) {
    const actual = i < actualHrefs.length ? actualHrefs[i] : '<ausente>';
    const expectedHref = i < expectedHrefs.length ? expectedHrefs[i] : '<nenhum>';
    if (actual !== expectedHref) {
      issues.push(`${label} alterou a posição ${i + 1}: encontrado '${actual}', esperado '${expectedHref}'`);
    }
  }

  return issues;
}

const failures = [];

for (const page of Object.keys(expected)) {
  const filePath = path.join(siteRoot, page);
  if (!fs.existsSync(filePath)) {
    failures.push(`${page} não encontrado`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const navMatch = /<nav\b[^>]*>.*?<\/nav>/is.exec(html);
  if (!navMatch) {
    failures.push(`${page} não possui nav principal`);
    continue;
  }

  const navLinksMatch = /<div class="nav-links">.*?<\/div>/is.exec(navMatch[0]);
  if (!navLinksMatch) {
    failures.push(`${page} não possui bloco nav-links`);
  } else {
    failures.push(...compareLinkSequence(`${page} / desktop`, navLinksMatch[0], expected[page].desktop));
  }

  if (expected[page].mobile) {
    const sidebarMatch = /<div class="sidebar"[^>]*>.*?<\/div>/is.exec(html);
    if (!sidebarMatch) {
      failures.push(`${page} não possui menu mobile sidebar`);
    } else {
      failures.push(...compareLinkSequence(`${page} / mobile`, sidebarMatch[0], expected[page].mobile));
    }
  }
}

if (failures.length > 0) {
  console.log('FALHA: estrutura de navegação alterada ou incompleta.');
  failures.filter(Boolean).forEach((f) => console.log(`- ${f}`));
  process.exit(1);
}

console.log('OK: menus desktop e mobile preservam os links e a ordem esperada.');
