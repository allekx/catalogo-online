# Arquitetura — Le Maia

Visão do monorepo alinhada ao [modelo de negócio](./BUSINESS-MODEL.md).

## Visão geral

```
Catálogo online/
├── frontend/     # Vitrine pública (Next.js 14, PWA, SEO)
├── admin/        # Painel privado do dono (Next.js 14)
├── backend/      # API REST (Express + Prisma)
└── docs/         # Deploy, negócio, roadmap
```

## Três superfícies

| Superfície | Responsabilidade | Auth |
|------------|------------------|------|
| **frontend** | Catálogo, carrinho, WhatsApp, favoritos locais | Nenhuma |
| **admin** | CRUD produtos/categorias, pedidos, métricas | Senha + token + middleware |
| **backend** | Dados, uploads, analytics admin | `ADMIN_API_KEY` nas rotas `/admin/*` |

## Frontend (catálogo público)

```
app/                    # Rotas Next.js (RSC quando possível)
components/
  ├── catalog/          # Listagem, filtros, busca
  ├── cart/             # Carrinho (localStorage)
  ├── whatsapp/         # Botões e fluxo wa.me
  ├── product/          # Detalhe, galeria
  └── layout/           # Nav mobile/desktop, menu
lib/
  ├── constants/        # routes, navigation, menu
  ├── products/         # types, normalize, fetch
  ├── whatsapp/         # mensagens, encode, open
  ├── seo/              # metadata, sitemap
  └── catalog/          # filtros, URL sync
store/                  # useCartStore, useFavoritesStore, useAppStore
```

### Regras

| O quê | Onde |
|-------|------|
| Rotas públicas | `lib/constants/routes.ts` |
| Bottom nav / desktop nav | `lib/constants/navigation.ts` |
| Menu hambúrguer | `lib/constants/menu.ts` |
| Checkout do pedido | `lib/whatsapp/` → `openCartOrderWhatsApp` |
| Metadata | `lib/metadata.ts` → `lib/seo/` |

### Server vs Client

- **Server:** home, produto `[slug]`, sitemap, metadata
- **Client:** carrinho, filtros, motion, PWA, `CatalogView`

## Admin (painel privado)

```
admin/app/
  login/              # Público — formulário de senha
  (panel)/            # Protegido — dashboard, produtos, pedidos…
admin/middleware.ts   # Redireciona sem cookie de sessão
admin/lib/auth.ts     # sessionStorage + cookie (middleware)
```

Proteção em duas camadas: **middleware** (servidor) + **AdminShell** (cliente, UX).

## Backend

```
backend/src/routes/
  public/               # Produtos, categorias (catálogo)
  admin/                # Autenticado com API key
```

## Fluxo de pedido

1. Cliente monta carrinho no frontend (Zustand → localStorage)
2. Clica em “Finalizar pedido no WhatsApp”
3. `buildOrderMessage` + `encodeURIComponent` → `wa.me`
4. Atendimento manual; admin pode registrar pedido/contato via API

## O que evitar no frontend público

- Rotas ou copy de “conta”, “login”, “checkout com pagamento”
- Estados globais de usuário autenticado
- Dependências de sessão para carrinho ou favoritos

## Imports recomendados

```ts
import { ROUTES } from "@/lib/constants/routes";
import { formatPrice } from "@/lib/format/currency";
import { openCartOrderWhatsApp } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/metadata";
```
