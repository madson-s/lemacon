import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "localizacao_destaques" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar NOT NULL,
  	"valor" varchar
  );
  
  ALTER TABLE "localizacao" ADD COLUMN "regiao_rotulo" varchar DEFAULT 'Área de atendimento';
  ALTER TABLE "localizacao" ADD COLUMN "cartao_mapa_chapeu" varchar DEFAULT 'Ponto de atendimento';
  ALTER TABLE "localizacao" ADD COLUMN "cartao_mapa_sem_endereco" varchar DEFAULT 'A equipe combina o melhor ponto de encontro com você antes da visita.';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_chapeu" varchar DEFAULT 'A LM vai até você';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_titulo" varchar DEFAULT 'Da primeira medida à instalação no seu endereço';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_texto" varchar DEFAULT 'Antes de fabricar, entendemos o ambiente, os acessos e o uso de cada abertura. Assim, a visita já começa com contexto e termina com uma solução possível de executar.';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_cta_texto" varchar DEFAULT 'Conhecer o catálogo';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_cta_link" varchar DEFAULT '/catalogo';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_regiao_rotulo" varchar DEFAULT 'Região atendida';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_regiao_texto" varchar DEFAULT 'Projeto, fabricação e instalação chegam até a sua obra.';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_base_rotulo" varchar DEFAULT 'Base da equipe';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_base_texto" varchar DEFAULT 'É daqui que saem as peças produzidas pela LM.';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_referencia_rotulo" varchar DEFAULT 'Ponto de referência';
  ALTER TABLE "localizacao" ADD COLUMN "cobertura_referencia_texto" varchar DEFAULT 'Uma orientação simples para reconhecer a chegada.';
  ALTER TABLE "localizacao" ADD COLUMN "visita_chapeu" varchar DEFAULT 'Planeje a visita';
  ALTER TABLE "localizacao" ADD COLUMN "visita_titulo" varchar DEFAULT 'Horário de atendimento';
  ALTER TABLE "localizacao_destaques" ADD CONSTRAINT "localizacao_destaques_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."localizacao"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "localizacao_destaques_order_idx" ON "localizacao_destaques" USING btree ("_order");
  CREATE INDEX "localizacao_destaques_parent_id_idx" ON "localizacao_destaques" USING btree ("_parent_id");

  -- Uma Localização já salva ganha os textos novos pelo DEFAULT das colunas, mas
  -- a lista de destaques nasce vazia — e lista vazia esconde a faixa abaixo do
  -- mapa. Os três destaques que estavam fixos na página entram para quem já
  -- tinha a linha; sem linha salva, o Payload usa o defaultValue do campo.
  INSERT INTO "localizacao_destaques" ("_order", "_parent_id", "id", "rotulo", "valor")
  SELECT d."ordem", l."id", substr(md5(random()::text || clock_timestamp()::text || d."ordem"), 1, 24), d."rotulo", d."valor"
    FROM "localizacao" AS l
   CROSS JOIN (VALUES
     (1, 'Atendimento', 'Toda a Chapada Diamantina'),
     (2, 'Escopo', 'Projeto · fabricação · instalação'),
     (3, 'Avaliação', 'No local e sem compromisso')
   ) AS d("ordem", "rotulo", "valor")
   WHERE NOT EXISTS (SELECT 1 FROM "localizacao_destaques" x WHERE x."_parent_id" = l."id");

  -- As colunas de História e Equipe da página Sobre saem do schema neste mesmo
  -- ciclo, mas ficam no banco: o código no ar ainda as lê. Elas são removidas na
  -- migração de limpeza, depois do merge.`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "localizacao_destaques" CASCADE;
  ALTER TABLE "localizacao" DROP COLUMN "regiao_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN "cartao_mapa_chapeu";
  ALTER TABLE "localizacao" DROP COLUMN "cartao_mapa_sem_endereco";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_chapeu";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_titulo";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_texto";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_cta_texto";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_cta_link";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_regiao_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_regiao_texto";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_base_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_base_texto";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_referencia_rotulo";
  ALTER TABLE "localizacao" DROP COLUMN "cobertura_referencia_texto";
  ALTER TABLE "localizacao" DROP COLUMN "visita_chapeu";
  ALTER TABLE "localizacao" DROP COLUMN "visita_titulo";`)
}
