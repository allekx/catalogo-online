# Deploy profissional — Le Maia

Guia para publicar o catálogo em **Vercel** (frontend + admin), **Railway** (API) e **Supabase** (PostgreSQL), com **HTTPS**, logs e segurança em produção.

## Arquitetura

```
┌─────────────────┐     HTTPS      ┌──────────────────┐
│  Vercel         │ ──────────────▶│  Railway         │
│  frontend/      │   REST /api    │  backend/        │
│  (catálogo PWA) │                │  Express+Prisma  │
└─────────────────┘                └────────┬─────────┘
┌─────────────────┐                         │
│  Vercel admin/  │ ────────────────────────┘
└─────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │  Supabase        │
                                 │  PostgreSQL      │
                                 └──────────────────┘
                                          ▲
                                 ┌────────┴─────────┐
                                 │  Cloudinary      │
                                 │  (imagens)       │
                                 └──────────────────┘
```

| Serviço | Pasta | URL exemplo |
|---------|-------|-------------|
| Catálogo | `frontend/` | `https://lemaia.vercel.app` |
| Admin | `admin/` | `https://lemaia-admin.vercel.app` |
| API | `backend/` | `https://le-maia-api.up.railway.app` |
| Banco | — | Supabase (connection strings) |

---

## Pré-requisitos

- Conta [GitHub](https://github.com)
- [Supabase](https://supabase.com) — projeto PostgreSQL
- [Railway](https://railway.app) — API Node
- [Vercel](https://vercel.com) — 2 projetos (frontend + admin)
- [Cloudinary](https://cloudinary.com) — upload de imagens

---

## 1. Supabase (banco)

1. Crie um projeto em **Supabase**.
2. **Project Settings → Database**:
   - **Transaction pooler** (porta **6543**) → `DATABASE_URL`  
     Adicione `?pgbouncer=true&connection_limit=1` se não vier na URL.
   - **Session / Direct** (porta **5432**) → `DIRECT_URL` (só migrations).
3. Guarde a senha com segurança.

### Migrations (primeira vez, local)

```bash
cd backend
cp .env.example .env
# Preencha DATABASE_URL e DIRECT_URL
npx prisma migrate deploy
npm run db:seed
```

Em produção, o **Railway** roda `prisma migrate deploy` no build automaticamente (`railway.toml`).

---

## 2. Railway (backend)

### Configuração do serviço

1. **New Project → Deploy from GitHub** (repositório Le Maia).
2. **Settings → Root Directory:** `backend`
3. **Settings → Networking → Generate Domain** (HTTPS automático).
4. Variáveis de ambiente (copie de `backend/.env.example`):

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `NODE_ENV` | Sim | `production` |
| `PORT` | Não | Railway injeta; padrão `4000` |
| `DATABASE_URL` | Sim | Pooler Supabase `:6543` |
| `DIRECT_URL` | Sim | Conexão direta `:5432` |
| `CORS_ORIGIN` | Sim | URLs Vercel separadas por vírgula |
| `CLOUDINARY_*` | Sim* | Upload de produtos |
| `UPLOAD_API_KEY` | Sim | Chave longa aleatória |
| `ADMIN_API_KEY` | Sim | Chave longa aleatória |
| `ADMIN_PASSWORD` | Sim | Senha forte do painel |

\* Cloudinary obrigatório para upload; catálogo funciona com URLs externas sem ele.

**Exemplo `CORS_ORIGIN`:**

```
https://lemaia.vercel.app,https://lemaia-admin.vercel.app
```

Sem barra no final. Sem espaços.

### Build e health check

O arquivo `backend/railway.toml` define:

- Build: `npm install && npm run build && npx prisma migrate deploy`
- Start: `npm run start`
- Health: `GET /api/health` (retorna **503** se o banco estiver offline)

### Logs

No painel Railway → **Deployments → View Logs**.  
A API emite logs **JSON** por requisição (`http_request`) e erros (`unhandled_error`).

### Gerar chaves seguras (PowerShell)

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Use uma chave diferente para `UPLOAD_API_KEY` e `ADMIN_API_KEY`.

---

## 3. Vercel — Catálogo (`frontend`)

1. **Add New Project** → importe o repositório.
2. **Root Directory:** `frontend`
3. **Framework:** Next.js (detectado automaticamente).
4. O `frontend/vercel.json` define região **gru1** (São Paulo) e headers de segurança (HSTS, etc.).
5. Variáveis de ambiente:

| Variável | Exemplo |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://lemaia.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://sua-api.up.railway.app/api` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | seu cloud name |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5511...` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL Instagram |
| `SEO_REVALIDATE_SECONDS` | `300` |

6. **Deploy** — HTTPS e CDN são automáticos na Vercel.
7. (Opcional) Domínio customizado em **Settings → Domains**.

### PWA

Service Worker e instalação no celular funcionam **apenas em produção** (`npm run build` + deploy). Em `dev`, o SW é removido automaticamente.

---

## 4. Vercel — Admin (`admin`)

1. Segundo projeto na Vercel (mesmo repositório).
2. **Root Directory:** `admin`
3. Variáveis:

| Variável | Exemplo |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://sua-api.up.railway.app` |

**Importante:** sem `/api` no final — as rotas do admin já usam `/api/admin/...`.

4. Inclua a URL do admin em `CORS_ORIGIN` no Railway.

---

## 5. Cloudinary

1. Dashboard → **Account Details**.
2. Configure no Railway: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER=le-maia`.
3. No frontend, apenas `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

### Teste de upload

```bash
curl -X POST https://SUA-API.up.railway.app/api/upload \
  -H "x-api-key: SUA_UPLOAD_API_KEY" \
  -F "file=@imagem.jpg" \
  -F "folder=products"
```

---

## Scripts de deploy (monorepo)

Na raiz do projeto:

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Build frontend + backend + admin |
| `npm run build:frontend` | Build Next.js catálogo |
| `npm run build:backend` | Prisma generate + TypeScript |
| `npm run db:migrate:deploy` | Migrations em produção (manual) |
| `npm run deploy:check` | Valida `.env` locais |
| `npm run deploy:pre` | Build completo + check (PowerShell) |

### Pre-deploy local (Windows)

```powershell
.\scripts\deploy\pre-deploy.ps1
```

### Seed após primeiro deploy

```powershell
.\scripts\deploy\seed-production.ps1
```

(Requer `backend/.env` apontando para Supabase.)

---

## HTTPS

| Plataforma | HTTPS |
|------------|--------|
| Vercel | Automático (Let's Encrypt) |
| Railway | Automático no domínio `*.up.railway.app` |
| Supabase | Conexões TLS no connection string |

**Regras:**

- `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_API_URL` devem usar `https://` em produção.
- `CORS_ORIGIN` deve listar as URLs HTTPS exatas do Vercel.
- O frontend envia header `Strict-Transport-Security` via `vercel.json`.

---

## Segurança em produção

O backend valida na subida (`assertProductionEnv`):

- `DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGIN` obrigatórios
- `UPLOAD_API_KEY`, `ADMIN_API_KEY`, `ADMIN_PASSWORD` não podem ser valores padrão de dev
- Helmet + rate limit (200 req/15 min API, 20 uploads/min)
- `trust proxy` ativo (Railway)
- Upload exige header `x-api-key`
- Admin exige `x-admin-key` + senha no login

---

## Checklist final

- [ ] Supabase: `DATABASE_URL` (pooler 6543) + `DIRECT_URL` (5432)
- [ ] Railway: root `backend`, health `/api/health` verde
- [ ] Railway: `CORS_ORIGIN` com URLs do catálogo e admin (HTTPS)
- [ ] Railway: chaves admin/upload alteradas
- [ ] Vercel frontend: `NEXT_PUBLIC_API_URL` termina com `/api`
- [ ] Vercel admin: `NEXT_PUBLIC_API_URL` **sem** `/api`
- [ ] Cloudinary configurado no Railway
- [ ] `npm run deploy:check` sem erros (com `.env` preenchidos)
- [ ] Seed executado (`db:seed`) se banco vazio
- [ ] PWA testado em produção (instalar no celular)

---

## CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` roda em cada push/PR:

- `npm ci`
- lint em todos os workspaces
- build frontend, backend e admin

---

## Solução de problemas

| Problema | Solução |
|----------|---------|
| CORS bloqueado | Confira `CORS_ORIGIN` exata (protocolo + domínio, sem `/` final) |
| Health 503 | Banco inacessível — revise `DATABASE_URL` / IP allowlist Supabase |
| Build Railway falha Prisma | `DIRECT_URL` correta; migrations na pasta `prisma/migrations` |
| Admin não loga | `NEXT_PUBLIC_API_URL` sem `/api`; `ADMIN_*` no Railway |
| PWA não instala | Deploy produção Vercel + `NEXT_PUBLIC_SITE_URL` HTTPS |
| Imagens não carregam | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + domínio Cloudinary no Next |

---

## Estrutura de arquivos de deploy

```
├── .github/workflows/ci.yml
├── scripts/deploy/
│   ├── check-env.mjs
│   ├── pre-deploy.ps1
│   └── seed-production.ps1
├── backend/
│   ├── railway.toml
│   ├── nixpacks.toml
│   └── .env.example
├── frontend/
│   ├── vercel.json
│   └── .env.example
├── admin/
│   ├── vercel.json
│   └── .env.example
└── docs/DEPLOY.md
```
