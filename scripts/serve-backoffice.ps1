$Port = 8765
$Root = Split-Path $PSScriptRoot -Parent
$ServerDir = Join-Path $Root "backoffice\server"
Write-Host "Backoffice + apresentacoes em http://localhost:$Port"
Write-Host "UI: http://localhost:$Port/backoffice/index.html"
Set-Location $ServerDir
python server.py $Port
