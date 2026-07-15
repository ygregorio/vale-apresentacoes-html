param(
  [string]$SourcePath = "C:\Users\81038569\OneDrive - Vale S.A\Desktop\arquivos_marca_vale\Imagens_padrao"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
$KitRoot = Join-Path $ProjectRoot "presentation-kit"
$LinkPath = Join-Path $KitRoot "brand-assets"
$FontSrc = Join-Path $SourcePath "Tipografia\ValeSans_v1\Webfonts\WOFF2"
$FontDst = Join-Path $KitRoot "assets\fonts"
$LogoSrc = Join-Path $SourcePath "logo\Vale_Color_logos_JPG\vale_c.jpg"
$LogoDst = Join-Path $KitRoot "assets\logo\vale-logo-color.jpg"

if (-not (Test-Path $SourcePath)) {
  Write-Error "Pasta de assets nao encontrada: $SourcePath"
}

if (Test-Path $LinkPath) {
  Write-Host "Junction ja existe: $LinkPath"
} else {
  cmd /c mklink /J "$LinkPath" "$SourcePath"
  Write-Host "Junction criado: $LinkPath"
}

New-Item -ItemType Directory -Force -Path $FontDst | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $LogoDst) | Out-Null

@("ValeSans-Regular.woff2", "ValeSans-Bold.woff2", "ValeSans-Medium.woff2", "ValeSans-Semibold.woff2", "ValeSans-Light.woff2") | ForEach-Object {
  Copy-Item (Join-Path $FontSrc $_) (Join-Path $FontDst $_) -Force
}

Copy-Item $LogoSrc $LogoDst -Force
python (Join-Path $KitRoot "scripts\make-logo-transparent.py")
python (Join-Path $KitRoot "scripts\make-logo-white.py")

Write-Host "Fontes e logo atualizados."
Write-Host "Regenerando manifest.json..."
python (Join-Path $KitRoot "scripts\generate-manifest.py")

Write-Host "Setup concluido."
