import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "unidades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"slug" varchar,
  	"descricao" varchar,
  	"imagem_id" integer,
  	"ordem" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX "categorias_unidade_idx";
  ALTER TABLE "categorias" ADD COLUMN "unidade_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "unidades_id" integer;
  ALTER TABLE "unidades" ADD CONSTRAINT "unidades_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "unidades_nome_idx" ON "unidades" USING btree ("nome");
  CREATE UNIQUE INDEX "unidades_slug_idx" ON "unidades" USING btree ("slug");
  CREATE INDEX "unidades_imagem_idx" ON "unidades" USING btree ("imagem_id");
  CREATE INDEX "unidades_updated_at_idx" ON "unidades" USING btree ("updated_at");
  CREATE INDEX "unidades_created_at_idx" ON "unidades" USING btree ("created_at");
  ALTER TABLE "categorias" ADD CONSTRAINT "categorias_unidade_id_unidades_id_fk" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_unidades_fk" FOREIGN KEY ("unidades_id") REFERENCES "public"."unidades"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_unidades_id_idx" ON "payload_locked_documents_rels" USING btree ("unidades_id");
  CREATE INDEX "categorias_unidade_idx" ON "categorias" USING btree ("unidade_id");

  -- As três frentes que existiam como opções fixas passam a ser registros.
  INSERT INTO "unidades" ("nome", "slug", "descricao", "ordem") VALUES
    ('Esquadrias', 'esquadrias', 'Portas, janelas, fachadas e coberturas em alumínio.', 1),
    ('Vidros', 'vidros', 'Box, guarda-corpo, espelhos e coberturas de vidro.', 2),
    ('Construção', 'construcao', 'Projeto, execução, reforma e ampliação com equipe própria.', 3)
  ON CONFLICT ("nome") DO NOTHING;

  -- Cada categoria passa a apontar para o registro da unidade que tinha como texto.
  UPDATE "categorias" AS c
     SET "unidade_id" = u."id"
    FROM "unidades" AS u
   WHERE c."unidade" IS NOT NULL
     AND u."nome" = c."unidade"::text;

  -- A coluna antiga "unidade" e o enum dela ficam de propósito. O preview roda
  -- esta migração no banco de produção antes do merge, e o código que ainda
  -- está no ar lê essa coluna. Ela sai numa migração seguinte, quando nada
  -- mais depender dela.`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- A coluna antiga continua existindo (o up não a remove). Categorias criadas
  -- depois do up só têm a relação; devolve o valor a elas antes de apagar a
  -- tabela, desde que o nome seja uma das três opções do enum antigo.
  UPDATE "categorias" AS c
     SET "unidade" = u."nome"::"public"."enum_categorias_unidade"
    FROM "unidades" AS u
   WHERE c."unidade_id" = u."id"
     AND u."nome" IN ('Esquadrias', 'Vidros', 'Construção');

  ALTER TABLE "categorias" DROP CONSTRAINT IF EXISTS "categorias_unidade_id_unidades_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_unidades_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_unidades_id_idx";
  DROP INDEX IF EXISTS "categorias_unidade_idx";
  ALTER TABLE "categorias" DROP COLUMN "unidade_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "unidades_id";
  CREATE INDEX "categorias_unidade_idx" ON "categorias" USING btree ("unidade");
  DROP TABLE "unidades" CASCADE;`)
}
