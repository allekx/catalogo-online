# Le Maia — Catálogo Online Premium

Vitrine digital mobile-first para bolsas personalizadas. O cliente navega, monta o carrinho localmente e **finaliza o pedido pelo WhatsApp** — sem login, sem pagamento no site.

Modelo de negócio: [`docs/BUSINESS-MODEL.md`](docs/BUSINESS-MODEL.md)

## Stack de produção

| Camada | Plataforma |
|--------|------------|
| Catálogo + API + Admin + PWA | **Vercel** (`frontend/`) |
| PostgreSQL | **Supabase** |
| Imagens | **Cloudinary** |

Guia completo: [`docs/DEPLOY.md`](docs/DEPLOY.md)  
Modelo de negócio: [`docs/BUSINESS-MODEL.md`](docs/BUSINESS-MODEL.md)  
Arquitetura: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)  
Roadmap premium: [`docs/ROADMAP-PREMIUM.md`](docs/ROADMAP-PREMIUM.md)

## Estrutura

```
├── frontend/          # Next.js — catálogo, /api, /admin, Prisma, PWA
│   ├── app/api/       # Route Handlers (ex-Railway)
│   ├── app/admin/     # Painel privado
│   └── prisma/
├── backend/           # Legado Express (não usar em deploy)
└── docs/
```

## Variáveis de ambiente

| Arquivo | Uso |
|---------|-----|
| `frontend/.env.example` | Vercel + Supabase + Cloudinary + admin |

## Início rápido (desenvolvimento)

```bash
npm install
cp frontend/.env.example frontend/.env.local
# Configure DATABASE_URL, DIRECT_URL, Cloudinary, ADMIN_*

npm run dev
# Catálogo :3000 | API :3000/api | Admin :3000/admin
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Next.js :3000 (catálogo + API + admin) |
| `npm run build` | Build produção |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:migrate:deploy` | Migrations em produção |
| `npm run db:seed` | Popular banco |
| `npm run db:studio` | Prisma Studio |
| `npm run deploy:check` | Validar variáveis Vercel |

## Design System

Importe de `@/design-system`:

- **Tokens:** cores, tipografia, sombras, spacing, animações
- **UI:** Button, Card, Input, Modal, BottomSheet, Toast, Loading, Skeleton, ProductCard

Documentação: [`frontend/design-system/README.md`](frontend/design-system/README.md)

## Paleta

| Cor | Hex |
|-----|-----|
| Laranja | `#FF6B00` |
| Nude | `#F7E6DA` |
| Rosé | `#E9C7B5` |
| Texto | `#222222` |
