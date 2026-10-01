import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sobre_metodo_passos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"texto" varchar
  );
  
  ALTER TABLE "sobre" ADD COLUMN "cta_texto" varchar DEFAULT 'Conheça o seu projeto com a LM';
  ALTER TABLE "sobre" ADD COLUMN "cta_link" varchar DEFAULT '/#orcamento';
  ALTER TABLE "sobre" ADD COLUMN "imagem_legenda" varchar DEFAULT 'Projeto · fabricação · instalação';
  ALTER TABLE "sobre" ADD COLUMN "capacidades_chapeu" varchar DEFAULT 'Estrutura própria';
  ALTER TABLE "sobre" ADD COLUMN "capacidades_texto" varchar DEFAULT 'Da leitura do vão ao acabamento final, as decisões acontecem perto de quem vai fabricar e instalar.';
  ALTER TABLE "sobre" ADD COLUMN "projetos_chapeu" varchar DEFAULT 'Portfólio LM';
  ALTER TABLE "sobre" ADD COLUMN "projetos_titulo" varchar DEFAULT 'Projetos que mostram como trabalhamos';
  ALTER TABLE "sobre" ADD COLUMN "projetos_cta_texto" varchar DEFAULT 'Ver catálogo';
  ALTER TABLE "sobre" ADD COLUMN "projetos_cta_link" varchar DEFAULT '/catalogo';
  ALTER TABLE "sobre" ADD COLUMN "metodo_chapeu" varchar DEFAULT 'Nosso método';
  ALTER TABLE "sobre" ADD COLUMN "metodo_titulo" varchar DEFAULT 'Uma equipe do primeiro traço à última regulagem';
  ALTER TABLE "sobre_metodo_passos" ADD CONSTRAINT "sobre_metodo_passos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sobre"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sobre_metodo_passos_order_idx" ON "sobre_metodo_passos" USING btree ("_order");
  CREATE INDEX "sobre_metodo_passos_parent_id_idx" ON "sobre_metodo_passos" USING btree ("_parent_id");

  -- Um Sobre já salvo ganha os textos novos pelo DEFAULT das colunas, mas a
  -- tabela de passos nasce vazia — e passos vazios escondem a seção "Nosso
  -- método". Os três passos que estavam fixos na página entram aqui para quem
  -- já tinha a linha; sem linha salva, o Payload usa o defaultValue do campo.
  INSERT INTO "sobre_metodo_passos" ("_order", "_parent_id", "id", "titulo", "texto")
  SELECT p."ordem", s."id", substr(md5(random()::text || clock_timestamp()::text || p."ordem"), 1, 24), p."titulo", p."texto"
    FROM "sobre" AS s
   CROSS JOIN (VALUES
     (1, 'Projeto conectado à execução', 'Quem mede e especifica acompanha o que será produzido.'),
     (2, 'Fabricação própria', 'Perfis, vidros e acabamentos passam pela mesma coordenação.'),
     (3, 'Instalação e pós-entrega', 'A equipe instala, ajusta e responde por cada detalhe entregue.')
   ) AS p("ordem", "titulo", "texto")
   WHERE NOT EXISTS (SELECT 1 FROM "sobre_metodo_passos" x WHERE x."_parent_id" = s."id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sobre_metodo_passos" CASCADE;
  ALTER TABLE "sobre" DROP COLUMN "cta_texto";
  ALTER TABLE "sobre" DROP COLUMN "cta_link";
  ALTER TABLE "sobre" DROP COLUMN "imagem_legenda";
  ALTER TABLE "sobre" DROP COLUMN "capacidades_chapeu";
  ALTER TABLE "sobre" DROP COLUMN "capacidades_texto";
  ALTER TABLE "sobre" DROP COLUMN "projetos_chapeu";
  ALTER TABLE "sobre" DROP COLUMN "projetos_titulo";
  ALTER TABLE "sobre" DROP COLUMN "projetos_cta_texto";
  ALTER TABLE "sobre" DROP COLUMN "projetos_cta_link";
  ALTER TABLE "sobre" DROP COLUMN "metodo_chapeu";
  ALTER TABLE "sobre" DROP COLUMN "metodo_titulo";`)
}
