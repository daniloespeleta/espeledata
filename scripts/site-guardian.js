/* ============================================================
 * scripts/site-guardian.js  —  Node port of site-guardian.ps1
 * ------------------------------------------------------------
 * Orchestrates the checks that must pass before a page edit is
 * reported as done: nav/sidebar structure, required Leea brand
 * assets, and diff whitespace hygiene. Message-for-message
 * parity with the .ps1 version so either can run depending on
 * what's on PATH (pwsh vs node).
 *
 * Run after editing any page:
 *   node scripts/site-guardian.js
 *
 * Exits 1 on the first blocked check; exits 0 with
 * "SITE GUARDIAN: PASS, ..." only when everything checks out.
 * Pure Node built-ins.
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const scriptRoot = __dirname;
const siteRoot = path.join(scriptRoot, '..');
const validator = path.join(scriptRoot, 'validate-site-structure.js');

function runStep(result, stepLabel, blockedMessage) {
  if (result.error) {
    console.log(`SITE GUARDIAN: erro ao executar ${stepLabel}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.log(blockedMessage);
    process.exit(1);
  }
}

console.log('SITE GUARDIAN: iniciando verificação');

const structureCheck = spawnSync(process.execPath, [validator], { stdio: 'inherit' });
runStep(structureCheck, 'validate-site-structure.js', 'SITE GUARDIAN: BLOCKED, estrutura de navegação reprovada');

const requiredAssets = [
  'assets/leea/leea-logo-transparent.png',
  'assets/leea/leea-wordmark-transparent.png',
  'assets/leea/leea-lockup-transparent.png',
];

const missingAssets = requiredAssets.filter((asset) => !fs.existsSync(path.join(siteRoot, asset)));
if (missingAssets.length > 0) {
  console.log('SITE GUARDIAN: BLOCKED, asset obrigatório ausente');
  missingAssets.forEach((asset) => console.log(`- ${asset}`));
  process.exit(1);
}

const diffCheck = spawnSync('git', ['-C', siteRoot, 'diff', '--check'], { stdio: 'inherit' });
runStep(diffCheck, 'git diff --check', 'SITE GUARDIAN: BLOCKED, erro de whitespace no diff');

console.log('SITE GUARDIAN: PASS, estrutura e assets preservados');
