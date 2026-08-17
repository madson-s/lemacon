import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solucoes_id" integer;
  ALTER TABLE "solucoes_entregaveis" ADD CONSTRAINT "solucoes_entregaveis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes" ADD CONSTRAINT "solucoes_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "solucoes_entregaveis_order_idx" ON "solucoes_entregaveis" USING btree ("_order");
  CREATE INDEX "solucoes_entregaveis_parent_id_idx" ON "solucoes_entregaveis" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solucoes_slug_idx" ON "solucoes" USING btree ("slug");
  CREATE INDEX "solucoes_imagem_idx" ON "solucoes" USING btree ("imagem_id");
  CREATE INDEX "solucoes_publicado_idx" ON "solucoes" USING btree ("publicado");
  CREATE INDEX "solucoes_updated_at_idx" ON "solucoes" USING btree ("updated_at");
  CREATE INDEX "solucoes_created_at_idx" ON "solucoes" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_solucoes_id_idx" ON "payload_locked_documents_rels" USING btree ("solucoes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solucoes_entregaveis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solucoes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solucoes_entregaveis" CASCADE;
  DROP TABLE "solucoes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solucoes_fk";
  
  DROP INDEX "payload_locked_documents_rels_solucoes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solucoes_id";`)
}
