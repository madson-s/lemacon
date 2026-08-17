import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projetos_tipo" AS ENUM('residencial', 'comercial', 'corporativo');
  CREATE TABLE "projetos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar,
  	"local" varchar,
  	"ano" numeric,
  	"tipo" "enum_projetos_tipo" DEFAULT 'residencial',
  	"resumo" varchar,
  	"capa_id" integer,
  	"descricao" jsonb,
  	"ordem" numeric DEFAULT 0,
  	"destaque" boolean DEFAULT false,
  	"publicado" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projetos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"produtos_id" integer
  );
  
  ALTER TABLE "home" ALTER COLUMN "titulo" SET DEFAULT 'O ambiente inteiro muda quando cada escolha tem intenção';
  ALTER TABLE "home" ALTER COLUMN "subtitulo" SET DEFAULT 'Móveis, iluminação e decoração de linhas modernas, escolhidos para valorizar o espaço que você já tem — não para competir com ele.';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projetos_id" integer;
  ALTER TABLE "home" ADD COLUMN "chapeu" varchar DEFAULT 'Design moderno para ambientes reais';
  ALTER TABLE "home" ADD COLUMN "cta_secundario_texto" varchar DEFAULT 'Ver trabalhos executados';
  ALTER TABLE "home" ADD COLUMN "cta_secundario_link" varchar DEFAULT '/trabalhos';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_chapeu" varchar DEFAULT 'Trabalhos executados';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_titulo" varchar DEFAULT 'Soluções que valorizam o ambiente';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_texto" varchar DEFAULT 'Cada projeto começa lendo o espaço: proporção, luz e circulação. As peças entram depois, para resolver — não para preencher.';
  ALTER TABLE "home" ADD COLUMN "secao_trabalhos_cta_texto" varchar DEFAULT 'Ver todos os trabalhos';
  ALTER TABLE "projetos" ADD CONSTRAINT "projetos_capa_id_media_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "projetos_slug_idx" ON "projetos" USING btree ("slug");
  CREATE INDEX "projetos_capa_idx" ON "projetos" USING btree ("capa_id");
  CREATE INDEX "projetos_destaque_idx" ON "projetos" USING btree ("destaque");
  CREATE INDEX "projetos_publicado_idx" ON "projetos" USING btree ("publicado");
  CREATE INDEX "projetos_updated_at_idx" ON "projetos" USING btree ("updated_at");
  CREATE INDEX "projetos_created_at_idx" ON "projetos" USING btree ("created_at");
  CREATE INDEX "projetos_rels_order_idx" ON "projetos_rels" USING btree ("order");
  CREATE INDEX "projetos_rels_parent_idx" ON "projetos_rels" USING btree ("parent_id");
  CREATE INDEX "projetos_rels_path_idx" ON "projetos_rels" USING btree ("path");
  CREATE INDEX "projetos_rels_media_id_idx" ON "projetos_rels" USING btree ("media_id");
  CREATE INDEX "projetos_rels_produtos_id_idx" ON "projetos_rels" USING btree ("produtos_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projetos_fk" FOREIGN KEY ("projetos_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projetos_id_idx" ON "payload_locked_documents_rels" USING btree ("projetos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projetos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projetos_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projetos" CASCADE;
  DROP TABLE "projetos_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projetos_fk";
  
  DROP INDEX "payload_locked_documents_rels_projetos_id_idx";
  ALTER TABLE "home" ALTER COLUMN "titulo" SET DEFAULT 'Peças que dão caráter ao ambiente';
  ALTER TABLE "home" ALTER COLUMN "subtitulo" SET DEFAULT 'Móveis, iluminação e decoração selecionados peça a peça. Veja o catálogo completo e encontre o que combina com a sua casa.';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projetos_id";
  ALTER TABLE "home" DROP COLUMN "chapeu";
  ALTER TABLE "home" DROP COLUMN "cta_secundario_texto";
  ALTER TABLE "home" DROP COLUMN "cta_secundario_link";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_chapeu";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_titulo";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_texto";
  ALTER TABLE "home" DROP COLUMN "secao_trabalhos_cta_texto";
  DROP TYPE "public"."enum_projetos_tipo";`)
}
