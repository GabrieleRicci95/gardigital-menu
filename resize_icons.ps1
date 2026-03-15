Add-Type -AssemblyName System.Drawing
$source = "c:\Gardigital-Ultimate\gardigital-menu\assets\icon.png"
$destDir = "c:\Gardigital-Ultimate\gardigital-menu\ios\App\App\Assets.xcassets\AppIcon.appiconset"

function Resize-Image-Opaque($size, $filename) {
    echo "Generating Opaque $filename ($size x $size)..."
    $srcImg = [System.Drawing.Image]::FromFile($source)
    
    # Create NEW bitmap with 24bpp (No Alpha)
    $destImg = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destImg)
    
    # Fill background with SOLID WHITE
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.FillRectangle($whiteBrush, 0, 0, $size, $size)
    
    # Draw logo on top
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImg, 0, 0, $size, $size)
    
    # Save as PNG (The 24bpp format will force it to be opaque)
    $destImg.Save("$destDir\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    
    $whiteBrush.Dispose()
    $graphics.Dispose()
    $destImg.Dispose()
    $srcImg.Dispose()
}

# iPhone sizes
Resize-Image-Opaque 40 "AppIcon-20x20@2x.png"
Resize-Image-Opaque 60 "AppIcon-20x20@3x.png"
Resize-Image-Opaque 58 "AppIcon-29x29@2x.png"
Resize-Image-Opaque 87 "AppIcon-29x29@3x.png"
Resize-Image-Opaque 80 "AppIcon-40x40@2x.png"
Resize-Image-Opaque 120 "AppIcon-40x40@3x.png"
Resize-Image-Opaque 120 "AppIcon-60x60@2x.png"
Resize-Image-Opaque 180 "AppIcon-60x60@3x.png"

# iPad sizes
Resize-Image-Opaque 20 "AppIcon-20x20@1x.png"
Resize-Image-Opaque 29 "AppIcon-29x29@1x.png"
Resize-Image-Opaque 40 "AppIcon-40x40@1x.png"
Resize-Image-Opaque 76 "AppIcon-76x76@1x.png"
Resize-Image-Opaque 152 "AppIcon-76x76@2x.png"
Resize-Image-Opaque 167 "AppIcon-83.5x83.5@2x.png"

# Marketing size (The critical one for 409 error)
Resize-Image-Opaque 1024 "AppIcon-1024.png"

echo "Done! Nuclear Opaque Icons generated."
