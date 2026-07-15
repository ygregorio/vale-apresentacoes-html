param(
  [Parameter(Mandatory = $true)]
  [string]$GitHubUser,

  [string]$RepoName = "vale-apresentacoes-html"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Git = Join-Path $env:LOCALAPPDATA "Programs\Git\bin\git.exe"
if (-not (Test-Path $Git)) {
  $Git = "git"
}

$RemoteUrl = "https://github.com/$GitHubUser/$RepoName.git"

Write-Host "Repositorio local: $Root"
Write-Host "Remote: $RemoteUrl"
Write-Host ""
Write-Host "Antes de continuar, crie o repositorio vazio em:"
Write-Host "  https://github.com/new?name=$RepoName"
Write-Host "(Publico, SEM README, .gitignore ou license)"
Write-Host ""

Set-Location $Root

& $Git remote remove origin 2>$null
& $Git remote add origin $RemoteUrl
& $Git branch -M main
& $Git push -u origin main

Write-Host ""
Write-Host "Publicado. Ative GitHub Pages em:"
Write-Host "  Settings > Pages > Source: Deploy from branch > main / (root)"
Write-Host "Site: https://$GitHubUser.github.io/$RepoName/"
