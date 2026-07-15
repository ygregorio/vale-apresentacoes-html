$Port = 8765
$Root = Split-Path $PSScriptRoot -Parent
$ServerDir = Join-Path $Root "backoffice\server"
Write-Host "Servindo $Root em http://localhost:$Port"
Write-Host "Backoffice: http://localhost:$Port/backoffice/index.html"
Write-Host "Apresentacao teste: http://localhost:$Port/presentations/indicadores-transportes-teste/index.html"
Set-Location $ServerDir
python server.py $Port
