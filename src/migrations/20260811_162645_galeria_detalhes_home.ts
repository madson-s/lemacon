import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "produtos_especificacoes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar NOT NULL,
  	"valor" varchar NOT NULL
  );
  
  CREATE TABLE "produtos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar DEFAULT 'Peças que dão caráter ao ambiente' NOT NULL,
  	"subtitulo" varchar DEFAULT 'Móveis, iluminação e decoração selecionados peça a peça. Veja o catálogo completo e encontre o que combina com a sua casa.',
  	"cta_texto" varchar DEFAULT 'Ver o catálogo' NOT NULL,
  	"cta_link" varchar DEFAULT '/catalogo' NOT NULL,
  	"imagem_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "produtos" ADD COLUMN "detalhes" jsonb;
  ALTER TABLE "categorias" ADD COLUMN "destacar_na_home" boolean DEFAULT true;
  ALTER TABLE "produtos_especificacoes" ADD CONSTRAINT "produtos_especificacoes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "produtos_especificacoes_order_idx" ON "produtos_especificacoes" USING btree ("_order");
  CREATE INDEX "produtos_especificacoes_parent_id_idx" ON "produtos_especificacoes" USING btree ("_parent_id");
  CREATE INDEX "produtos_rels_order_idx" ON "produtos_rels" USING btree ("order");
  CREATE INDEX "produtos_rels_parent_idx" ON "produtos_rels" USING btree ("parent_id");
  CREATE INDEX "produtos_rels_path_idx" ON "produtos_rels" USING btree ("path");
  CREATE INDEX "produtos_rels_media_id_idx" ON "produtos_rels" USING btree ("media_id");
  CREATE INDEX "home_imagem_idx" ON "home" USING btree ("imagem_id");
  CREATE INDEX "produtos_destaque_idx" ON "produtos" USING btree ("destaque");
  CREATE INDEX "categorias_destacar_na_home_idx" ON "categorias" USING btree ("destacar_na_home");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "produtos_especificacoes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produtos_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "produtos_especificacoes" CASCADE;
  DROP TABLE "produtos_rels" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP INDEX "produtos_destaque_idx";
  DROP INDEX "categorias_destacar_na_home_idx";
  ALTER TABLE "produtos" DROP COLUMN "detalhes";
  ALTER TABLE "categorias" DROP COLUMN "destacar_na_home";`)
}
