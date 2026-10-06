import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Limpeza: remove do banco o que saiu do schema nos PRs anteriores e ficou de
 * propósito para trás, enquanto o código no ar ainda lia cada coluna.
 *
 * - categorias.unidade (e o enum): a unidade virou relação com a coleção
 *   Unidades (#11); o valor já foi copiado para categorias.unidade_id.
 * - sobre: História e Equipe (#14).
 * - localizacao: endereço, ponto de referência, link do mapa, horários, foto
 *   da fachada, textos da visita e dos cards de base e referência (#16).
 *
 * Só pode ser aplicada com o #16 no ar: o preview roda esta migração contra o
 * banco de produção assim que a branch sobe.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Unidade antiga: texto fixo, substituído pela relação categorias.unidade_id.
  ALTER TABLE "categorias" DROP COLUMN IF EXISTS "unidade";
  DROP TYPE IF EXISTS "public"."enum_categorias_unidade";

  -- Sobre: História e Equipe.
  DROP TABLE IF EXISTS "sobre_equipe" CASCADE;
  ALTER TABLE "sobre" DROP CONSTRAINT IF EXISTS "sobre_historia_imagem_id_media_id_fk";
  DROP INDEX IF EXISTS "sobre_historia_historia_imagem_idx";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "historia_titulo";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "historia_desde";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "historia_texto";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "historia_imagem_id";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "equipe_titulo";
  ALTER TABLE "sobre" DROP COLUMN IF EXISTS "equipe_texto";

  -- Localização: endereço, mapa, horários, fachada, visita e os dois cards.
  DROP TABLE IF EXISTS "localizacao_horarios" CASCADE;
  ALTER TABLE "localizacao" DROP CONSTRAINT IF EXISTS "localizacao_imagem_id_media_id_fk";
  DROP INDEX IF EXISTS "localizacao_imagem_idx";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_logradouro";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_numero";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_complemento";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_bairro";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_cidade";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_estado";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "endereco_cep";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "referencia";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "mapa_url";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "imagem_id";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "visita_chapeu";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "visita_titulo";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "cobertura_base_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "cobertura_base_texto";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "cobertura_referencia_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN IF EXISTS "cobertura_referencia_texto";`)
}

/**
 * Recria a estrutura, sem os dados. A exceção é a unidade antiga, que volta
 * preenchida a partir da relação — desde que o nome seja um dos três do enum.
 */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_categorias_unidade" AS ENUM('Esquadrias', 'Vidros', 'Construção');
  ALTER TABLE "categorias" ADD COLUMN "unidade" "public"."enum_categorias_unidade";
  UPDATE "categorias" AS c
     SET "unidade" = u."nome"::"public"."enum_categorias_unidade"
    FROM "unidades" AS u
   WHERE c."unidade_id" = u."id"
     AND u."nome" IN ('Esquadrias', 'Vidros', 'Construção');

  ALTER TABLE "sobre" ADD COLUMN "historia_titulo" varchar DEFAULT 'Como a LM começou';
  ALTER TABLE "sobre" ADD COLUMN "historia_desde" varchar;
  ALTER TABLE "sobre" ADD COLUMN "historia_texto" jsonb;
  ALTER TABLE "sobre" ADD COLUMN "historia_imagem_id" integer;
  ALTER TABLE "sobre" ADD COLUMN "equipe_titulo" varchar DEFAULT 'Quem faz';
  ALTER TABLE "sobre" ADD COLUMN "equipe_texto" varchar;
  ALTER TABLE "sobre" ADD CONSTRAINT "sobre_historia_imagem_id_media_id_fk" FOREIGN KEY ("historia_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sobre_historia_historia_imagem_idx" ON "sobre" USING btree ("historia_imagem_id");
  CREATE TABLE "sobre_equipe" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "nome" varchar NOT NULL,
    "funcao" varchar,
    "foto_id" integer
  );
  ALTER TABLE "sobre_equipe" ADD CONSTRAINT "sobre_equipe_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sobre_equipe" ADD CONSTRAINT "sobre_equipe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sobre"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sobre_equipe_order_idx" ON "sobre_equipe" USING btree ("_order");
  CREATE INDEX "sobre_equipe_parent_id_idx" ON "sobre_equipe" USING btree ("_parent_id");
  CREATE INDEX "sobre_equipe_foto_idx" ON "sobre_equipe" USING btree ("foto_id");

  ALTER TABLE "localizacao" ADD COLUMN "endereco_logradouro" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_numero" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_complemento" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_bairro" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_cidade" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "endereco_estado" varchar DEFAULT 'BA';
  ALTER TABLE "localizacao" ADD COLUMN "endereco_cep" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "referencia" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "mapa_url" varchar;
  ALTER TABLE "localizacao" ADD COLUMN "imagem_id" integer;
  ALTER TABLE "localizacao" ADD COLUMN "visita_chapeu" varchar DEFAULT 'Planeje a visita';
  ALTER TABLE "localizacao" ADD COLUMN "visita_titulo" varchar DEFAULT 'Horário de atendimento';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_base_rotulo" varchar DEFAULT 'Base da equipe';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_base_texto" varchar DEFAULT 'É daqui que saem as peças produzidas pela LM.';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_referencia_rotulo" varchar DEFAULT 'Ponto de referência';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_referencia_texto" varchar DEFAULT 'Uma orientação simples para reconhecer a chegada.';
  ALTER TABLE "localizacao" ADD CONSTRAINT "localizacao_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "localizacao_imagem_idx" ON "localizacao" USING btree ("imagem_id");
  CREATE TABLE "localizacao_horarios" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "dias" varchar NOT NULL,
    "horario" varchar NOT NULL
  );
  ALTER TABLE "localizacao_horarios" ADD CONSTRAINT "localizacao_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."localizacao"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "localizacao_horarios_order_idx" ON "localizacao_horarios" USING btree ("_order");
  CREATE INDEX "localizacao_horarios_parent_id_idx" ON "localizacao_horarios" USING btree ("_parent_id");`)
}
