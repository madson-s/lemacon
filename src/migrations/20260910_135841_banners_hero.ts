import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_banners_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagem_id" integer NOT NULL,
  	"alt" varchar NOT NULL,
  	"link" varchar
  );
  
  ALTER TABLE "home_banners_hero" ADD CONSTRAINT "home_banners_hero_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_banners_hero" ADD CONSTRAINT "home_banners_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_banners_hero_order_idx" ON "home_banners_hero" USING btree ("_order");
  CREATE INDEX "home_banners_hero_parent_id_idx" ON "home_banners_hero" USING btree ("_parent_id");
  CREATE INDEX "home_banners_hero_imagem_idx" ON "home_banners_hero" USING btree ("imagem_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_banners_hero" CASCADE;`)
}
