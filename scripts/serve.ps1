$Port = 8765
$Root = Split-Path $PSScriptRoot -Parent
$ServerDir = Join-Path $Root "backoffice\server"
$DefaultAdminFile = Join-Path $Root "data\auth\default-admin.txt"
$BootstrapFile = Join-Path $Root "data\auth\.bootstrap-admin.txt"

if (-not $env:VALE_ADMIN_PASSWORD) {
  $env:VALE_ADMIN_PASSWORD = "Vale@2026"
}

Write-Host "Servindo $Root em http://localhost:$Port"
Write-Host "Portal: http://localhost:$Port/"
Write-Host "Backoffice: http://localhost:$Port/backoffice/login.html"
Write-Host "Apresentacao teste: http://localhost:$Port/presentations/indicadores-transportes-teste/index.html"
Write-Host ""
Write-Host "Login backoffice: admin / Vale@2026 (padrao dev; veja data/auth/default-admin.txt)"
if (Test-Path $BootstrapFile) {
  Write-Host "Senha gerada localmente: $BootstrapFile"
  Write-Host "(Reset: .\scripts\reset-admin-password.ps1)"
} elseif (Test-Path $DefaultAdminFile) {
  Write-Host "Credencial padrao: $DefaultAdminFile"
}
Set-Location $ServerDir
python server.py $Port
