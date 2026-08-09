Add-Type -AssemblyName System.Drawing

$sourceDir = 'C:\Users\espel\OneDrive\Documentos\Claude\Projects\Agência Leea'
$targetDir = 'C:\Users\espel\espeledata\assets\leea'

function Save-TransparentCrop([string]$sourcePath, [string]$targetPath, [int]$left, [int]$top, [int]$width, [int]$height) {
  $source = [System.Drawing.Bitmap]::new($sourcePath)
  $crop = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($crop)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $width, $height), [System.Drawing.Rectangle]::new($left, $top, $width, $height), [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $crop.MakeTransparent([System.Drawing.Color]::White)
  $crop.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
  $source.Dispose()
}

Save-TransparentCrop (Join-Path $sourceDir 'Leea_logo.png') (Join-Path $targetDir 'leea-logo-transparent.png') 100 560 1800 1100
Save-TransparentCrop (Join-Path $sourceDir 'Leea_wordmark.png') (Join-Path $targetDir 'leea-wordmark-transparent.png') 100 700 1800 1000
Save-TransparentCrop (Join-Path $sourceDir 'Leea_logo+wordmark.png') (Join-Path $targetDir 'leea-lockup-transparent.png') 100 380 1800 1500
