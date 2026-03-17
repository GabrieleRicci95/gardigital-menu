Add-Type -AssemblyName System.Drawing
$source = "c:\Gardigital-Ultimate\gardigital-menu\assets\icon.png"
$resDir = "c:\Gardigital-Ultimate\gardigital-menu\android\app\src\main\res"

function Resize-Android-Icon($size, $folder) {
    echo "Generating $folder (ic_launcher.png $size x $size)..."
    $srcImg = [System.Drawing.Image]::FromFile($source)
    $destImg = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($destImg)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImg, 0, 0, $size, $size)
    
    $destImg.Save("$resDir\$folder\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $destImg.Save("$resDir\$folder\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Also save as foreground for adaptive icons
    $destImg.Save("$resDir\$folder\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $destImg.Dispose()
    $srcImg.Dispose()
}

# Android Mipmap sizes
Resize-Android-Icon 48 "mipmap-mdpi"
Resize-Android-Icon 72 "mipmap-hdpi"
Resize-Android-Icon 96 "mipmap-xhdpi"
Resize-Android-Icon 144 "mipmap-xxhdpi"
Resize-Android-Icon 192 "mipmap-xxxhdpi"

echo "Done! Android Icons generated."
