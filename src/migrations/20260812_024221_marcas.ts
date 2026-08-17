import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_marcas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL
  );
  
  ALTER TABLE "produtos" ADD COLUMN "marca" varchar;
  ALTER TABLE "home_marcas" ADD CONSTRAINT "home_marcas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_marcas_order_idx" ON "home_marcas" USING btree ("_order");
  CREATE INDEX "home_marcas_parent_id_idx" ON "home_marcas" USING btree ("_parent_id");
  CREATE INDEX "produtos_marca_idx" ON "produtos" USING btree ("marca");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_marcas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_marcas" CASCADE;
  DROP INDEX "produtos_marca_idx";
  ALTER TABLE "produtos" DROP COLUMN "marca";`)
}
