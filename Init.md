Catálogo Online — Next.js + Payload CMS + Tailwind + busca

Stack: Next.js 15 (App Router) · Payload 3 · Postgres · Tailwind v4 · Fuse.js (busca no cliente)

1. Criar o projeto
bash
npx create-payload-app@latest -n catalogo -t blank --use-pnpm

No prompt interativo, escolha:

Database: PostgreSQL
Database connection string: deixe o padrão local por enquanto (ajustamos no .env)

Isso já gera um projeto Next.js com o Payload instalado dentro de src/app, dividido em dois route groups:

src/app/(payload)/    -> painel administrativo e API do Payload
src/app/(frontend)/   -> o site público (o catálogo)
bash
cd catalogo
2. Banco de dados local (Docker)
bash
docker run --name catalogo-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=catalogo -p 5432:5432 -d postgres:16-alpine

Se preferir não usar Docker, crie um banco no Neon ou Supabase e use a connection string deles.

3. Variáveis de ambiente

Edite o .env na raiz:

env
DATABASE_URI=postgres://postgres:postgres@localhost:5432/catalogo
PAYLOAD_SECRET=troque-por-uma-string-longa-e-aleatoria
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

Gere o secret com:

bash
openssl rand -base64 32
4. Tailwind v4
bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
pnpm add fuse.js

Crie postcss.config.mjs na raiz:

js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

Em src/app/(frontend)/globals.css, deixe apenas:

css
@import 'tailwindcss';

Importante: importe esse CSS somente no layout de (frontend). O painel do Payload tem estilos próprios em (payload) — se o Tailwind entrar lá, o preflight quebra o visual do admin.

Em src/app/(frontend)/layout.tsx:

tsx
import './globals.css'

export const metadata = {
  title: 'Catálogo',
  description: 'Catálogo de produtos',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  )
}
5. Coleções do Payload

Copie os arquivos desta pasta para dentro do projeto:

src/collections/Media.ts
src/collections/Categorias.ts
src/collections/Produtos.ts
src/collections/Users.ts
src/lib/slug.ts
src/payload.config.ts            (substitui o gerado pela CLI)
src/app/(frontend)/catalogo/page.tsx
src/components/CatalogoBusca.tsx
6. Rodar
bash
pnpm dev
Painel: http://localhost:3000/admin (o primeiro acesso cria o usuário admin)
Catálogo: http://localhost:3000/catalogo

Gere os tipos do TypeScript sempre que mudar uma coleção:

bash
pnpm payload generate:types
7. Migrations (obrigatório com Postgres)

Em desenvolvimento o Payload sincroniza o schema automaticamente (push). Em produção não confie nisso — gere e versione as migrations:

bash
pnpm payload migrate:create nome_da_mudanca
git add src/migrations && git commit -m "migration"

No deploy, o comando de build precisa rodar a migration antes de subir:

json
"scripts": {
  "build": "payload migrate && next build"
}
8. Ordem sugerida de trabalho
Criar as categorias no painel
Cadastrar 3–4 produtos de teste, cada um ligado a uma categoria
Ajustar o layout do catálogo
Trocar o armazenamento de imagens para S3/R2 antes de publicar (pnpm add @payloadcms/storage-s3) — o disco do servidor é efêmero
Sobre a busca

A busca está no cliente com Fuse.js: o servidor manda a lista de produtos já renderizada e o Fuse indexa em memória no navegador. Vantagens: busca tolerante a erro de digitação, resposta instantânea, zero infraestrutura e zero custo.

Isso funciona bem até uns 2.000 produtos. Acima disso, o payload de JSON começa a pesar e vale migrar para:

@payloadcms/plugin-search — cria uma coleção de índice dentro do próprio Payload, com busca no servidor. Sem serviço externo.
Meilisearch ou Typesense — busca dedicada, com sinônimos e facetas. Roda em container no Railway (~US$5/mês a mais).