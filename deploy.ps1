# ============================================================
# deploy.ps1 — prepara (e opcionalmente publica) o site no Netlify
#
# Uso:
#   .\deploy.ps1            -> só regenera _deploy\ e o zip
#   .\deploy.ps1 -Draft     -> regenera e publica um PREVIEW no Netlify
#   .\deploy.ps1 -Prod      -> regenera e publica em PRODUÇÃO
#
# Requisitos p/ publicar via CLI: Node instalado e login feito uma vez
#   npx netlify-cli login
# ============================================================
param(
  [switch]$Draft,
  [switch]$Prod
)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$out  = Join-Path $root '_deploy'

# 1) Regenera a pasta de deploy só com arquivos de produção
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory $out | Out-Null
# assets estaticos de raiz (o HTML e o sitemap sao gerados pelo split, nao copiados)
foreach ($f in 'favicon.svg','robots.txt','og-cover.png','_redirects') {
  $p = Join-Path $root $f
  if (Test-Path $p) { Copy-Item $p $out }
}
Copy-Item (Join-Path $root 'CV') (Join-Path $out 'CV') -Recurse
if (Test-Path (Join-Path $root 'assets')) {
  Copy-Item (Join-Path $root 'assets') (Join-Path $out 'assets') -Recurse
}

# Split bilingue: gera PT (raiz) + EN (/en/) + sitemap.xml a partir das fontes bilingues.
# Fonte unica: voce continua editando os .html bilingues; o deploy separa por idioma.
node (Join-Path $root 'split-i18n.js') $root $out
if ($LASTEXITCODE -ne 0) { throw 'split-i18n.js falhou' }

# 2) Zip para deploy por arrastar-e-soltar em https://app.netlify.com/drop
$zip = Join-Path $root 'espeledata-site.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $out '*') -DestinationPath $zip
Write-Host "OK: _deploy\ regenerada e espeledata-site.zip criado." -ForegroundColor Green
Get-ChildItem $out | Select-Object Name, Length | Format-Table -AutoSize

# 3) Publicação opcional via Netlify CLI
if ($Draft) { npx netlify-cli deploy --dir $out }
elseif ($Prod) { npx netlify-cli deploy --dir $out --prod }
else { Write-Host "Nada foi publicado. Use -Draft para preview ou -Prod para producao." }
