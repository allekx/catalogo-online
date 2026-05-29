# Le Maia — Catálogo Online Premium

Vitrine digital mobile-first para bolsas personalizadas. O cliente navega, monta o carrinho localmente e **finaliza o pedido pelo WhatsApp** — sem login, sem pagamento no site.

Modelo de negócio: [`docs/BUSINESS-MODEL.md`](docs/BUSINESS-MODEL.md)

## Stack de produção

| Camada | Plataforma |
|--------|------------|
| Frontend + PWA | **Vercel** |
| API REST | **Railway** |
| PostgreSQL | **Supabase** |
| Imagens | **Cloudinary** |

Guia completo: [`docs/DEPLOY.md`](docs/DEPLOY.md)  
Modelo de negócio: [`docs/BUSINESS-MODEL.md`](docs/BUSINESS-MODEL.md)  
Arquitetura: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)  
Roadmap premium: [`docs/ROADMAP-PREMIUM.md`](docs/ROADMAP-PREMIUM.md)

## Estrutura

```
├── frontend/          # Catálogo público — PWA, SEO (Vercel)
│   └── design-system/
├── admin/             # Painel privado do dono (Vercel, URL separada)
├── backend/           # API REST (Railway)
└── docs/              # Negócio, arquitetura, deploy
```

## Variáveis de ambiente

| Arquivo | Uso |
|---------|-----|
| `.env.example` | Referência geral |
| `frontend/.env.example` | Vercel / dev local |
| `backend/.env.example` | Railway / Supabase / Cloudinary |

## Início rápido (desenvolvimento)

```bash
npm install

# Frontend
cp frontend/.env.example frontend/.env.local
npm run dev

# Backend (com Supabase configurado)
cp backend/.env.example backend/.env
npm run dev:backend
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Frontend :3000 |
| `npm run dev:backend` | API :4000 |
| `npm run dev:admin` | Admin :3001 |
| `npm run build` | Build todos os workspaces |
| `npm run build:frontend` | Build Vercel (catálogo) |
| `npm run build:backend` | Build Railway (API) |
| `npm run db:migrate:deploy` | Migrations em produção |
| `npm run db:seed` | Popular banco (dev/prod) |
| `npm run deploy:check` | Validar variáveis de ambiente |
| `npm run deploy:pre` | Build + check antes do deploy |

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
