# Arquitetura — Le Maia

Monorepo com **um app Next.js** (`frontend/`) no Vercel.

## Visão geral

```
frontend/
├── app/
│   ├── (catálogo público)/   # /, /catalogo, /carrinho…
│   ├── admin/                # Painel privado /admin/*
│   └── api/                  # Route Handlers /api/*
├── lib/
│   ├── server/               # Prisma, handlers, Cloudinary
│   ├── admin/                # Cliente HTTP do painel
│   └── products/             # Domínio catálogo
└── prisma/                   # Schema + migrations
```

## Superfícies

| Superfície | Rota | Auth |
|------------|------|------|
| Catálogo | `/`, `/catalogo`, … | Nenhuma |
| API pública | `/api/products`, `/api/categories`, … | Nenhuma |
| API admin | `/api/admin/*` | `x-admin-key` + senha no login |
| Painel | `/admin/*` | Cookie + middleware |

## API (Route Handlers)

- **Runtime:** `nodejs` (Prisma + Cloudinary)
- **Dynamic:** `force-dynamic` nas rotas com DB
- **Cache:** headers `Cache-Control` em GETs públicos

Handlers em `lib/server/handlers/`; rotas finas em `app/api/`.

## Prisma no Vercel

- `postinstall` / build: `prisma generate`
- `DATABASE_URL`: pooler transaction (6543)
- `DIRECT_URL`: pooler session (5432) para migrations locais
- Singleton em `lib/server/prisma.ts` (serverless-safe)

## Cliente → API

- Browser: `getApiBaseUrl()` → `/api` (same origin)
- SSR: URL absoluta via `NEXT_PUBLIC_SITE_URL` ou `VERCEL_URL`

## Admin integrado

- UI em `app/admin/` + `components/admin/`
- API em `/api/admin/`
- Middleware em `frontend/middleware.ts` (matcher `/admin/:path*`)

## Legado

O diretório `backend/` (Express) não é mais usado em deploy. Ver `backend/README.md`.
