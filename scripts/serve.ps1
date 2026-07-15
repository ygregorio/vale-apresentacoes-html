$Port = 8765
$Root = Split-Path $PSScriptRoot -Parent
$ServerDir = Join-Path $Root "backoffice\server"
Write-Host "Servindo $Root em http://localhost:$Port"
Write-Host "Portal: http://localhost:$Port/"
Write-Host "Backoffice: http://localhost:$Port/backoffice/login.html"
Write-Host "Apresentacao teste: http://localhost:$Port/presentations/indicadores-transportes-teste/index.html"
$BootstrapFile = Join-Path $Root "data\auth\.bootstrap-admin.txt"
if (Test-Path $BootstrapFile) {
  Write-Host ""
  Write-Host "Credencial admin: veja $BootstrapFile"
  Write-Host "(Se nao souber a senha: .\scripts\reset-admin-password.ps1)"
}
Set-Location $ServerDir
python server.py $Port
