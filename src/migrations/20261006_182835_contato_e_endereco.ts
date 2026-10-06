import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "contato_whatsapp" varchar DEFAULT '75993364665' NOT NULL;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_logradouro" varchar DEFAULT 'Rua Castro Alves';
  ALTER TABLE "localizacao" ADD COLUMN "endereco_numero" varchar DEFAULT '01';
  ALTER TABLE "localizacao" ADD COLUMN "endereco_cidade" varchar DEFAULT 'Seabra';
  ALTER TABLE "localizacao" ADD COLUMN "endereco_estado" varchar DEFAULT 'BA';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "contato_whatsapp";
  ALTER TABLE "localizacao" DROP COLUMN "endereco_logradouro";
  ALTER TABLE "localizacao" DROP COLUMN "endereco_numero";
  ALTER TABLE "localizacao" DROP COLUMN "endereco_cidade";
  ALTER TABLE "localizacao" DROP COLUMN "endereco_estado";`)
}
