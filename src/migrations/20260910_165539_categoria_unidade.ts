import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_categorias_unidade" AS ENUM('Esquadrias', 'Vidros', 'Construção');
  ALTER TABLE "categorias" ADD COLUMN "unidade" "enum_categorias_unidade";
  CREATE INDEX "categorias_unidade_idx" ON "categorias" USING btree ("unidade");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "categorias_unidade_idx";
  ALTER TABLE "categorias" DROP COLUMN "unidade";
  DROP TYPE "public"."enum_categorias_unidade";`)
}
