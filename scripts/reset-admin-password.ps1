param(
  [string]$NewPassword = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$ServerDir = Join-Path $Root "backoffice\server"

Push-Location $ServerDir
try {
  if ($NewPassword) {
    python -c "from pathlib import Path; from auth import AuthStore; auth = AuthStore(Path(r'$Root')); user, pw = auth.reset_admin_password(r'''$NewPassword'''); print(f'Usuario: {user}'); print(f'Senha: {pw}')"
  } else {
    python -c "from pathlib import Path; from auth import AuthStore; auth = AuthStore(Path(r'$Root')); user, pw = auth.reset_admin_password(); print(f'Usuario: {user}'); print(f'Senha: {pw}')"
  }
  Write-Host ""
  Write-Host "Credencial salva em: $Root\data\auth\.bootstrap-admin.txt"
  Write-Host "Login: http://localhost:8765/backoffice/login.html"
} finally {
  Pop-Location
}
