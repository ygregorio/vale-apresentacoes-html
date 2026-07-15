$Port = 8765
Write-Host "Encerrando processos na porta $Port..."

$pids = @()
netstat -ano | Select-String ":$Port\s" | ForEach-Object {
  $parts = ($_ -split '\s+') | Where-Object { $_ -ne '' }
  if ($parts.Length -ge 5) {
    $pids += [int]$parts[-1]
  }
}

$pids = $pids | Sort-Object -Unique | Where-Object { $_ -gt 0 }

if (-not $pids) {
  Write-Host "Nenhum processo encontrado na porta $Port."
  exit 0
}

foreach ($procId in $pids) {
  try {
    Stop-Process -Id $procId -Force -ErrorAction Stop
    Write-Host "Encerrado PID $procId"
  } catch {
    Write-Warning "Nao foi possivel encerrar PID $procId : $_"
  }
}

Write-Host "Pronto. Inicie de novo com: .\scripts\serve.ps1"
