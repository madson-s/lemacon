import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "produtos" ADD COLUMN "promocao" boolean DEFAULT false;
  CREATE INDEX "produtos_promocao_idx" ON "produtos" USING btree ("promocao");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "produtos_promocao_idx";
  ALTER TABLE "produtos" DROP COLUMN "promocao";`)
}
