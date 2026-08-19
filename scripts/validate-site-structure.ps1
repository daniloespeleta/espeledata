$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot

$expected = @{
  'index.html' = @{
    desktop = @('#sobre', 'leea.html', '#trajetoria', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
    mobile  = @('#sobre', 'leea.html', '#trajetoria', '#cases', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
  }
  'portfolio.html' = @{
    desktop = @('index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
    mobile  = @('index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
  }
  'leea.html' = @{
    desktop = @('index.html', 'index.html#sobre', 'portfolio.html', 'leea.html', 'notas.html', 'contact.html?leea=1')
    mobile  = @('index.html', 'index.html#sobre', 'portfolio.html', 'leea.html', 'notas.html', 'contact.html?leea=1')
  }
  'notas.html' = @{
    desktop = @('index.html', 'index.html#sobre', 'leea.html', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
    mobile  = @('index.html', 'index.html#sobre', 'leea.html', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
  }
  'contact.html' = @{
    desktop = @('index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
    mobile  = @('index.html', 'index.html#sobre', 'portfolio.html', 'notas.html', 'contact.html', 'CV/DE-Curriculo.pdf')
  }
  'case-leea.html' = @{
    desktop = @('index.html', 'portfolio.html', 'leea.html', 'contact.html')
    mobile  = @('index.html', 'portfolio.html', 'leea.html', 'contact.html')
  }
}

function Compare-LinkSequence {
  param(
    [string]$label,
    [string]$fragment,
    [string[]]$expectedHrefs
  )

  $actualHrefs = @([regex]::Matches($fragment, 'href="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
  $issues = @()

  if ($actualHrefs.Count -ne $expectedHrefs.Count) {
    $issues += "$label possui $($actualHrefs.Count) links; esperado $($expectedHrefs.Count)"
  }

  $limit = [Math]::Max($actualHrefs.Count, $expectedHrefs.Count)
  for ($i = 0; $i -lt $limit; $i++) {
    $actual = if ($i -lt $actualHrefs.Count) { $actualHrefs[$i] } else { '<ausente>' }
    $expectedHref = if ($i -lt $expectedHrefs.Count) { $expectedHrefs[$i] } else { '<nenhum>' }
    if ($actual -ne $expectedHref) {
      $issues += "$label alterou a posição $($i + 1): encontrado '$actual', esperado '$expectedHref'"
    }
  }

  return $issues
}

$failures = @()

foreach ($page in $expected.Keys) {
  $path = Join-Path $siteRoot $page
  if (-not (Test-Path -LiteralPath $path)) {
    $failures += "$page não encontrado"
    continue
  }

  $html = Get-Content -LiteralPath $path -Raw
  $navMatch = [regex]::Match($html, '(?is)<nav\b[^>]*>.*?</nav>')
  if (-not $navMatch.Success) {
    $failures += "$page não possui nav principal"
    continue
  }

  $navLinksMatch = [regex]::Match($navMatch.Value, '(?is)<div class="nav-links">.*?</div>')
  if (-not $navLinksMatch.Success) {
    $failures += "$page não possui bloco nav-links"
  } else {
    $failures += Compare-LinkSequence "$page / desktop" $navLinksMatch.Value $expected[$page].desktop
  }

  if ($null -ne $expected[$page].mobile) {
    $sidebarMatch = [regex]::Match($html, '(?is)<div class="sidebar"[^>]*>.*?</div>')
    if (-not $sidebarMatch.Success) {
      $failures += "$page não possui menu mobile sidebar"
    } else {
      $failures += Compare-LinkSequence "$page / mobile" $sidebarMatch.Value $expected[$page].mobile
    }
  }
}

if ($failures.Count -gt 0) {
  Write-Output 'FALHA: estrutura de navegação alterada ou incompleta.'
  $failures | Where-Object { $_ } | ForEach-Object { Write-Output "- $_" }
  exit 1
}

Write-Output 'OK: menus desktop e mobile preservam os links e a ordem esperada.'
