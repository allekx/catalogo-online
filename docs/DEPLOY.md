# Deploy — Le Maia (Vercel + Supabase + Cloudinary)

Stack única: **um projeto Next.js** no Vercel (catálogo público + API + painel admin).

| Serviço | Função |
|---------|--------|
| **Vercel** | Frontend, API Routes (`/api/*`), admin (`/admin/*`), PWA |
| **Supabase** | PostgreSQL |
| **Cloudinary** | Imagens |

## 1. Supabase

1. Crie o projeto em [supabase.com](https://supabase.com).
2. Em **Settings → Database**, copie:
   - **Transaction pooler** (6543) → `DATABASE_URL` com `?pgbouncer=true&connection_limit=1`
   - **Session pooler** (5432) → `DIRECT_URL`
3. Codifique caracteres especiais na senha na URL (`*` → `%2A`).

Migrations (local ou CI):

```bash
cd frontend
npx prisma migrate deploy
npm run db:seed
```

## 2. Cloudinary

1. Crie conta em [cloudinary.com](https://cloudinary.com).
2. Configure no Vercel:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_FOLDER=le-maia`
3. No cliente (imagens Next.js): `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (mesmo cloud name).

## 3. Vercel

### Checklist obrigatório (Settings)

| Campo | Valor |
|-------|--------|
| **Root Directory** | `frontend` |
| **Framework** | Next.js |
| **Build Command** | `prisma generate && npm run build` (em `frontend/vercel.json`) |
| **Install Command** | `npm install` |
| **Production Region** | `gru1` (São Paulo) |

Após alterar variáveis: **Deployments → Redeploy** (marque *Clear build cache* uma vez).

Validar env localmente (com `.env` carregado):

```bash
# PowerShell — carregue as mesmas vars do painel Vercel
npm run deploy:check
```

### Variáveis de ambiente (produção)

| Variável | Obrigatória | Notas |
|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | Sim | **`https://`** + domínio, sem barra final. Ex.: `https://catalogo-online.vercel.app`. Sem `https://` o site quebrava com 500 (corrigido no código, mas configure corretamente). |
| `DATABASE_URL` | Sim | Pooler 6543 + pgbouncer |
| `DIRECT_URL` | Sim | Pooler 5432 (migrations) |
| `CLOUDINARY_*` | Sim | 3 variáveis + folder |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Sim | Mesmo cloud name |
| `ADMIN_API_KEY` | Sim | Token longo e aleatório |
| `ADMIN_PASSWORD` | Sim | Senha do painel |
| `UPLOAD_API_KEY` | Sim | Protege `/api/upload` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recomendado | |
| `SEO_REVALIDATE_SECONDS` | Opcional | Padrão `300` |

Não é necessário `NEXT_PUBLIC_API_URL` em produção — a API usa o mesmo domínio (`/api`).

### Painel admin

- URL: `https://seu-dominio.vercel.app/admin`
- Login: `https://seu-dominio.vercel.app/admin/login`
- Proteção: cookie + middleware + header `x-admin-key`

## 4. Desenvolvimento local

```bash
npm install
cp frontend/.env.example frontend/.env.local
# Edite DATABASE_URL, DIRECT_URL, Cloudinary, admin

npm run dev
```

- Catálogo: http://localhost:3000  
- API: http://localhost:3000/api/health  
- Admin: http://localhost:3000/admin  

## 5. Checklist pós-deploy

1. Build logs mostram `next build` (não `backend@1.0.0`).
2. `GET /api/health` → JSON com `database: "connected"` (503 só se DB errado, não página de crash).
3. `GET /` → home do catálogo (sem `FUNCTION_INVOCATION_FAILED`).
4. Login em `/admin/login`.
5. Upload de imagem no admin.
6. Se ainda falhar: **Deployments → Runtime Logs** na rota `/` ou `/api/health`.
7. Use a URL exata do deploy em **Vercel → Domains** (ex.: `catalogo-online-xxx.vercel.app`). O domínio genérico `catalogo-online.vercel.app` pode ser **outro projeto** na sua conta.

- [ ] `GET /api/health` → `database: connected`
- [ ] Catálogo carrega produtos
- [ ] Login em `/admin/login`
- [ ] Upload de imagem no admin
- [ ] PWA / manifest OK

## O que foi removido

- Railway / Express backend separado
- Segundo deploy Vercel só para admin
- `NEXT_PUBLIC_API_URL` apontando para outro host (opcional em dev)

---

## Problemas comuns no Vercel

### Erro 500 — `FUNCTION_INVOCATION_FAILED`

**Causa 1 — Root Directory errado**  
O build não pode usar a pasta `backend` (Express). No projeto Vercel:

1. **Settings → General → Root Directory** = `frontend`
2. Ou deixe a raiz do repo e use o `vercel.json` na raiz (já configurado para `le-maia-frontend`).

Nos logs, se aparecer `backend@1.0.0 build`, o deploy está **desatualizado** ou com pasta raiz errada. Faça **push** do código novo e **Redeploy**.

**Causa 2 — `NEXT_PUBLIC_SITE_URL` inválida**  
Valor sem `https://` (ex.: só `catalogo-online.vercel.app`) fazia `new URL()` falhar no layout. O app agora normaliza a URL; no Vercel use sempre `https://seu-dominio.vercel.app`.

**Causa 3 — Variáveis de ambiente faltando**  
Sem `DATABASE_URL` e `DIRECT_URL`, as rotas `/api/*` retornam erro. Configure todas as variáveis da tabela acima em **Production** e rode **Redeploy**.

**Causa 4 — Código antigo no GitHub**  
Confirme que o repositório tem:

- `frontend/app/api/` (API no Next.js)
- `frontend/prisma/`
- `package.json` na raiz com workspace só `frontend`

Teste após deploy:

- `https://seu-dominio.vercel.app/api/health` → `"database": "connected"`
- `https://seu-dominio.vercel.app/` → home do catálogo

### Build: `Can't resolve './lib/admin/constants'` no middleware

O `.vercelignore` na raiz não pode usar o padrão `admin` solto — isso exclui **`frontend/lib/admin/`** do deploy. Use apenas `/admin` (pasta legado na raiz do repo).

### Submodule warning (`Failed to fetch git submodules`)

Isso acontecia porque a pasta `frontend/` estava registrada como **submódulo Git** (só o commit vazio do Create Next App ia para o GitHub). A correção é versionar `frontend/` como pasta normal (sem `frontend/.git`) e fazer **push** de novo.
