
Add-Type -AssemblyName System.Drawing
$imagePath = "c:\Gardigital-Ultimate\gardigital-solomenu\public\logo.png"
$outputPath = "c:\Gardigital-Ultimate\gardigital-solomenu\public\logo_transparent.png"

$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($newBmp)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if color is near black
        if ($c.R -lt 40 -and $c.G -lt 40 -and $c.B -lt 40) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
$g.Dispose()
