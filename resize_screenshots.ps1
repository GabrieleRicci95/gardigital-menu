Add-Type -AssemblyName System.Drawing
$targetWidth = 1242
$targetHeight = 2688

# Percorso dei file (puoi cambiarlo se necessario)
$sourceDir = "c:\Gardigital-Ultimate\gardigital-menu\assets\store"
$destDir = "c:\Gardigital-Ultimate\gardigital-menu\assets\store\resized"

if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir }

$files = Get-ChildItem -Path $sourceDir -Filter "*.png"
if ($files.Count -eq 0) { $files = Get-ChildItem -Path $sourceDir -Filter "*.jp*g" }
if ($files.Count -eq 0) { $files = Get-ChildItem -Path $sourceDir -Filter "*.jpeg" }

foreach ($file in $files) {
    echo "Ridimensionamento $($file.Name)..."
    $srcImg = [System.Drawing.Image]::FromFile($file.FullName)
    $destImg = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($destImg)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImg, 0, 0, $targetWidth, $targetHeight)
    
    $destImg.Save("$destDir\$($file.Name)", [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $destImg.Dispose()
    $srcImg.Dispose()
}

echo "Completato! Trovi le immagini pronte in: $destDir"
