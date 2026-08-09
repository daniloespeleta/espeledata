Add-Type -AssemblyName System.Drawing

$sourceDir = 'C:\Users\espel\OneDrive\Documentos\Claude\Projects\Agência Leea'
$targetDir = 'C:\Users\espel\espeledata\assets\leea'
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

function Save-CroppedAsset([string]$sourcePath, [string]$targetStem, [int]$left, [int]$top, [int]$width, [int]$height) {
  $source = [System.Drawing.Bitmap]::new($sourcePath)
  $white = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $whiteGraphics = [System.Drawing.Graphics]::FromImage($white)
  $whiteGraphics.Clear([System.Drawing.Color]::White)
  $whiteGraphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $width, $height), [System.Drawing.Rectangle]::new($left, $top, $width, $height), [System.Drawing.GraphicsUnit]::Pixel)
  $whiteGraphics.Dispose()

  $white.Save((Join-Path $targetDir "$targetStem.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $white.Dispose(); $source.Dispose()
}

Save-CroppedAsset (Join-Path $sourceDir 'Leea_logo.png') 'leea-logo' 100 560 1800 1100
Save-CroppedAsset (Join-Path $sourceDir 'Leea_wordmark.png') 'leea-wordmark' 100 700 1800 1000
Save-CroppedAsset (Join-Path $sourceDir 'Leea_logo+wordmark.png') 'leea-lockup' 100 380 1800 1500
