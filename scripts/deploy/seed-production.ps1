# Executa seed no banco Supabase (após primeiro deploy Railway)
# Requer backend/.env com DATABASE_URL e DIRECT_URL

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Set-Location (Join-Path $Root "backend")
Write-Host "→ Seed produção (backend)..."
npm run db:seed
Write-Host "✅ Seed concluído."
