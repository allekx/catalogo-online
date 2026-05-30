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

1. Importe o repositório.
2. **Root Directory:** `frontend`
3. Framework: Next.js (detectado automaticamente).
4. Build: `prisma generate && npm run build` (já em `frontend/vercel.json`).
5. Região recomendada: **São Paulo (gru1)**.

### Variáveis de ambiente (produção)

| Variável | Obrigatória | Notas |
|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | Sim | `https://seu-dominio.vercel.app` |
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

- [ ] `GET /api/health` → `database: connected`
- [ ] Catálogo carrega produtos
- [ ] Login em `/admin/login`
- [ ] Upload de imagem no admin
- [ ] PWA / manifest OK

## O que foi removido

- Railway / Express backend separado
- Segundo deploy Vercel só para admin
- `NEXT_PUBLIC_API_URL` apontando para outro host (opcional em dev)
