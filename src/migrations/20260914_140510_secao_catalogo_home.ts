import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "secao_catalogo_chapeu" varchar DEFAULT 'Catálogo';
  ALTER TABLE "home" ADD COLUMN "secao_catalogo_titulo" varchar DEFAULT 'Produtos e serviços que a LM entrega';
  ALTER TABLE "home" ADD COLUMN "secao_catalogo_texto" varchar DEFAULT 'Um catálogo amplo de esquadrias, vidros e obra — cada peça medida, fabricada e instalada pela nossa equipe. Filtre por unidade de negócio.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "secao_catalogo_chapeu";
  ALTER TABLE "home" DROP COLUMN "secao_catalogo_titulo";
  ALTER TABLE "home" DROP COLUMN "secao_catalogo_texto";`)
}
