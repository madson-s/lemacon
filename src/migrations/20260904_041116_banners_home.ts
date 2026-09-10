import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_banners_faixa1" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagem_id" integer NOT NULL,
  	"alt" varchar NOT NULL,
  	"link" varchar
  );
  
  CREATE TABLE "home_banners_faixa2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagem_id" integer NOT NULL,
  	"alt" varchar NOT NULL,
  	"link" varchar
  );
  
  ALTER TABLE "localizacao" ALTER COLUMN "titulo" SET DEFAULT 'Onde encontrar a LM';
  ALTER TABLE "localizacao" ALTER COLUMN "lead" SET DEFAULT 'Atendemos toda a Chapada Diamantina: projeto, fabricação e instalação chegam até a sua obra. Abaixo estão os canais para falar com a gente.';
  ALTER TABLE "home_banners_faixa1" ADD CONSTRAINT "home_banners_faixa1_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_banners_faixa1" ADD CONSTRAINT "home_banners_faixa1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_banners_faixa2" ADD CONSTRAINT "home_banners_faixa2_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_banners_faixa2" ADD CONSTRAINT "home_banners_faixa2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_banners_faixa1_order_idx" ON "home_banners_faixa1" USING btree ("_order");
  CREATE INDEX "home_banners_faixa1_parent_id_idx" ON "home_banners_faixa1" USING btree ("_parent_id");
  CREATE INDEX "home_banners_faixa1_imagem_idx" ON "home_banners_faixa1" USING btree ("imagem_id");
  CREATE INDEX "home_banners_faixa2_order_idx" ON "home_banners_faixa2" USING btree ("_order");
  CREATE INDEX "home_banners_faixa2_parent_id_idx" ON "home_banners_faixa2" USING btree ("_parent_id");
  CREATE INDEX "home_banners_faixa2_imagem_idx" ON "home_banners_faixa2" USING btree ("imagem_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_banners_faixa1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_banners_faixa2" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_banners_faixa1" CASCADE;
  DROP TABLE "home_banners_faixa2" CASCADE;
  ALTER TABLE "localizacao" ALTER COLUMN "titulo" SET DEFAULT 'Do asfalto da BR até a nossa porta';
  ALTER TABLE "localizacao" ALTER COLUMN "lead" SET DEFAULT 'Venha ver o perfil, o vidro e o acabamento de perto — ou resolva pelo WhatsApp, se for mais fácil. Abaixo está o caminho inteiro, do primeiro ponto de referência à porta.';`)
}
