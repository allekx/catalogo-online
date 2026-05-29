# Le Maia — validação local antes do deploy (PowerShell)
# Uso: .\scripts\deploy\pre-deploy.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "`n=== Le Maia — Pre-deploy ===`n" -ForegroundColor Cyan

Set-Location $Root
Write-Host "→ npm install (raiz)..."
npm install

Write-Host "`n→ Build frontend..."
npm run build:frontend

Write-Host "`n→ Build backend..."
npm run build:backend

Write-Host "`n→ Build admin..."
npm run build --workspace=admin

Write-Host "`n→ Verificar variáveis (arquivos .env locais)..."
node scripts/deploy/check-env.mjs all

Write-Host "`n✅ Pre-deploy concluído. Próximo passo: push para GitHub e deploy Vercel/Railway.`n" -ForegroundColor Green
