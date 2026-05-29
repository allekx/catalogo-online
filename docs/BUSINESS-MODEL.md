# Modelo de negócio — Le Maia

Documento oficial do produto. Toda decisão de arquitetura e UX deve respeitar estas regras.

## O que o sistema é

- **Catálogo online premium** (vitrine digital)
- **Mobile-first** com PWA
- **Carrinho local** (localStorage, sem login)
- **Checkout via WhatsApp** (único canal de fechamento de pedido)
- **Painel administrativo privado** (app separado, só dono)

## O que o sistema não é

- E-commerce tradicional com pagamento online
- App com conta de cliente
- Marketplace (Shopee, Amazon, etc.)
- ERP ou sistema complexo para o visitante

## Fluxo do cliente (público)

```
Catálogo → Produto → Carrinho (local) → WhatsApp
```

O cliente pode:

- Navegar e buscar produtos
- Favoritar localmente
- Adicionar ao carrinho
- Enviar pedido pelo WhatsApp

O cliente **não** pode:

- Criar conta ou fazer login
- Ver histórico de pedidos no site
- Pagar online
- Acessar o painel admin

Personalização das bolsas: **manual**, no atendimento WhatsApp.

## Fluxo do dono (admin)

App em `admin/` (porta 3001 em dev), deploy separado do catálogo.

- Autenticação **somente** no admin (senha + token API)
- `middleware.ts` + cookie de sessão + `AdminShell` no cliente
- Gestão de produtos, categorias, pedidos recebidos, métricas e imagens

## Separação de apps

| App | URL (exemplo) | Público |
|-----|----------------|---------|
| `frontend/` | lemaia.vercel.app | Sim — catálogo |
| `admin/` | admin.lemaia… | Não — dono |
| `backend/` | api… | API REST |

## Rotas públicas (frontend)

| Rota | Função |
|------|--------|
| `/` | Home |
| `/catalogo` | Listagem e busca |
| `/catalogo/[slug]` | Detalhe do produto |
| `/categorias` | Categorias |
| `/favoritos` | Favoritos locais |
| `/carrinho` | Carrinho |
| `/sobre` | Institucional |

Rotas removidas / redirecionadas: `/perfil`, `/pedidos`, `/login`, `/cadastro`, `/checkout` → catálogo ou carrinho.

## Organização do código (frontend)

Lógica por domínio, não por “e-commerce”:

- `components/catalog`, `components/cart`, `components/whatsapp`
- `lib/constants/routes.ts`, `navigation.ts`, `menu.ts`
- `store/` — carrinho e favoritos (Zustand + persist)

## Roadmap (fora do MVP)

Itens futuros (pagamento, login cliente, etc.) estão em [`ROADMAP-PREMIUM.md`](./ROADMAP-PREMIUM.md) e **não** fazem parte do escopo atual.
