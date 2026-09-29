import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solucoes_entregaveis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solucoes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_marcas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solucoes_entregaveis" CASCADE;
  DROP TABLE "solucoes" CASCADE;
  DROP TABLE "home_marcas" CASCADE;
  -- O DROP TABLE ... CASCADE acima já leva esta FK; sem o IF EXISTS o comando falha.
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_solucoes_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_imagem_id_media_id_fk";
  
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DATA TYPE text;
  -- Os valores passam a ter inicial maiúscula, porque a página imprime o valor
  -- como está. Sem este UPDATE, 'residencial' não cabe no enum novo e o cast falha.
  UPDATE "projetos" SET "tipo" = initcap("tipo") WHERE "tipo" IS NOT NULL;
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DEFAULT 'Residencial'::text;
  DROP TYPE "public"."enum_projetos_tipo";
  CREATE TYPE "public"."enum_projetos_tipo" AS ENUM('Residencial', 'Comercial', 'Corporativo');
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DEFAULT 'Residencial'::"public"."enum_projetos_tipo";
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DATA TYPE "public"."enum_projetos_tipo" USING "tipo"::"public"."enum_projetos_tipo";
  DROP INDEX "categorias_destacar_na_home_idx";
  DROP INDEX "projetos_destaque_idx";
  DROP INDEX "payload_locked_documents_rels_solucoes_id_idx";
  DROP INDEX "home_imagem_idx";
  ALTER TABLE "categorias" DROP COLUMN "descricao";
  ALTER TABLE "categorias" DROP COLUMN "destacar_na_home";
  ALTER TABLE "projetos" DROP COLUMN "destaque";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solucoes_id";
  ALTER TABLE "home" DROP COLUMN "chapeu";
  ALTER TABLE "home" DROP COLUMN "titulo";
  ALTER TABLE "home" DROP COLUMN "subtitulo";
  ALTER TABLE "home" DROP COLUMN "cta_texto";
  ALTER TABLE "home" DROP COLUMN "cta_link";
  ALTER TABLE "home" DROP COLUMN "cta_secundario_texto";
  ALTER TABLE "home" DROP COLUMN "cta_secundario_link";
  ALTER TABLE "home" DROP COLUMN "imagem_id";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_chapeu";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_titulo";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_texto";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_cta_texto";
  ALTER TABLE "localizacao" DROP COLUMN "contato_whatsapp";
  ALTER TABLE "localizacao" DROP COLUMN "contato_telefone";
  ALTER TABLE "localizacao" DROP COLUMN "contato_email";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "solucoes_entregaveis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "solucoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar,
  	"resumo" varchar,
  	"descricao" jsonb,
  	"imagem_id" integer,
  	"ordem" numeric DEFAULT 0,
  	"publicado" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_marcas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL
  );
  
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DATA TYPE text;
  UPDATE "projetos" SET "tipo" = lower("tipo") WHERE "tipo" IS NOT NULL;
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DEFAULT 'residencial'::text;
  DROP TYPE "public"."enum_projetos_tipo";
  CREATE TYPE "public"."enum_projetos_tipo" AS ENUM('residencial', 'comercial', 'corporativo');
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DEFAULT 'residencial'::"public"."enum_projetos_tipo";
  ALTER TABLE "projetos" ALTER COLUMN "tipo" SET DATA TYPE "public"."enum_projetos_tipo" USING "tipo"::"public"."enum_projetos_tipo";
  ALTER TABLE "categorias" ADD COLUMN "descricao" varchar;
  ALTER TABLE "categorias" ADD COLUMN "destacar_na_home" boolean DEFAULT true;
  ALTER TABLE "projetos" ADD COLUMN "destaque" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solucoes_id" integer;
  ALTER TABLE "home" ADD COLUMN "chapeu" varchar DEFAULT 'Design moderno para ambientes reais';
  ALTER TABLE "home" ADD COLUMN "titulo" varchar DEFAULT 'O ambiente inteiro muda quando cada escolha tem intenção' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "subtitulo" varchar DEFAULT 'Móveis, iluminação e decoração de linhas modernas, escolhidos para valorizar o espaço que você já tem — não para competir com ele.';
  ALTER TABLE "home" ADD COLUMN "cta_texto" varchar DEFAULT 'Ver o catálogo' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "cta_link" varchar DEFAULT '/catalogo' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "cta_secundario_texto" varchar DEFAULT 'Ver trabalhos executados';
  ALTER TABLE "home" ADD COLUMN "cta_secundario_link" varchar DEFAULT '/trabalhos';
  ALTER TABLE "home" ADD COLUMN "imagem_id" integer;
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_chapeu" varchar DEFAULT 'Trabalhos executados';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_titulo" varchar DEFAULT 'Soluções que valorizam o ambiente';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_texto" varchar DEFAULT 'Cada projeto começa lendo o espaço: proporção, luz e circulação. As peças entram depois, para resolver — não para preencher.';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_cta_texto" varchar DEFAULT 'Ver todos os trabalhos';
  ALTER TABLE "localizacao" ADD COLUMN "contato_whatsapp" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "contato_telefone" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "contato_email" varchar;
  ALTER TABLE "solucoes_entregaveis" ADD CONSTRAINT "solucoes_entregaveis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes" ADD CONSTRAINT "solucoes_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_marcas" ADD CONSTRAINT "home_marcas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solucoes_entregaveis_order_idx" ON "solucoes_entregaveis" USING btree ("_order");
  CREATE INDEX "solucoes_entregaveis_parent_id_idx" ON "solucoes_entregaveis" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solucoes_slug_idx" ON "solucoes" USING btree ("slug");
  CREATE INDEX "solucoes_imagem_idx" ON "solucoes" USING btree ("imagem_id");
  CREATE INDEX "solucoes_publicado_idx" ON "solucoes" USING btree ("publicado");
  CREATE INDEX "solucoes_updated_at_idx" ON "solucoes" USING btree ("updated_at");
  CREATE INDEX "solucoes_created_at_idx" ON "solucoes" USING btree ("created_at");
  CREATE INDEX "home_marcas_order_idx" ON "home_marcas" USING btree ("_order");
  CREATE INDEX "home_marcas_parent_id_idx" ON "home_marcas" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "categorias_destacar_na_home_idx" ON "categorias" USING btree ("destacar_na_home");
  CREATE INDEX "projetos_destaque_idx" ON "projetos" USING btree ("destaque");
  CREATE INDEX "payload_locked_documents_rels_solucoes_id_idx" ON "payload_locked_documents_rels" USING btree ("solucoes_id");
  CREATE INDEX "home_imagem_idx" ON "home" USING btree ("imagem_id");`)
}
