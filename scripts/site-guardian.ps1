$ErrorActionPreference = 'Stop'

$scriptRoot = $PSScriptRoot
$siteRoot = Split-Path -Parent $scriptRoot
$validator = Join-Path $scriptRoot 'validate-site-structure.ps1'

Write-Output 'SITE GUARDIAN: iniciando verificação'

& pwsh -NoLogo -NoProfile -File $validator
if ($LASTEXITCODE -ne 0) {
  Write-Output 'SITE GUARDIAN: BLOCKED, estrutura de navegação reprovada'
  exit 1
}

$requiredAssets = @(
  'assets/leea/leea-logo-transparent.png',
  'assets/leea/leea-wordmark-transparent.png',
  'assets/leea/leea-lockup-transparent.png'
)

$missingAssets = @($requiredAssets | Where-Object { -not (Test-Path -LiteralPath (Join-Path $siteRoot $_)) })
if ($missingAssets.Count -gt 0) {
  Write-Output 'SITE GUARDIAN: BLOCKED, asset obrigatório ausente'
  $missingAssets | ForEach-Object { Write-Output "- $_" }
  exit 1
}

& git -C $siteRoot diff --check
if ($LASTEXITCODE -ne 0) {
  Write-Output 'SITE GUARDIAN: BLOCKED, erro de whitespace no diff'
  exit 1
}

Write-Output 'SITE GUARDIAN: PASS, estrutura e assets preservados'
