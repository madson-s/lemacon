import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sobre_ficha" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar NOT NULL,
  	"valor" varchar
  );
  
  CREATE TABLE "sobre_capacidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"texto" varchar
  );
  
  CREATE TABLE "sobre_equipe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"funcao" varchar,
  	"foto_id" integer
  );
  
  CREATE TABLE "sobre" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"chapeu" varchar DEFAULT 'Sobre a LM',
  	"titulo" varchar DEFAULT 'Quem desenha, fabrica e instala é a mesma equipe' NOT NULL,
  	"lead" varchar DEFAULT 'A LM projeta, produz no próprio galpão e instala com equipe própria. É por isso que conseguimos fechar prazo, ajustar o acabamento na hora e responder por tudo depois da entrega.',
  	"imagem_id" integer,
  	"capacidades_titulo" varchar DEFAULT 'O que sai daqui pronto',
  	"historia_titulo" varchar DEFAULT 'Como a LM começou',
  	"historia_desde" varchar,
  	"historia_texto" jsonb,
  	"historia_imagem_id" integer,
  	"equipe_titulo" varchar DEFAULT 'Quem faz',
  	"equipe_texto" varchar,
  	"fechamento_titulo" varchar DEFAULT 'Traga o vão, a medida ou só a dúvida',
  	"fechamento_texto" varchar DEFAULT 'A avaliação é sem compromisso. Se der para resolver com o que já existe, a gente fala isso também.',
  	"fechamento_cta_texto" varchar DEFAULT 'Solicitar orçamento',
  	"fechamento_cta_link" varchar DEFAULT '/#orcamento',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "localizacao_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dias" varchar NOT NULL,
  	"horario" varchar NOT NULL
  );
  
  CREATE TABLE "localizacao" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"chapeu" varchar DEFAULT 'Onde estamos',
  	"titulo" varchar DEFAULT 'Do asfalto da BR até a nossa porta' NOT NULL,
  	"lead" varchar DEFAULT 'Venha ver o perfil, o vidro e o acabamento de perto — ou resolva pelo WhatsApp, se for mais fácil. Abaixo está o caminho inteiro, do primeiro ponto de referência à porta.',
  	"regiao" varchar DEFAULT 'Toda a Chapada Diamantina',
  	"endereco_logradouro" varchar,
  	"endereco_numero" varchar,
  	"endereco_complemento" varchar,
  	"endereco_bairro" varchar,
  	"endereco_cidade" varchar,
  	"endereco_estado" varchar DEFAULT 'BA',
  	"endereco_cep" varchar,
  	"referencia" varchar,
  	"mapa_url" varchar,
  	"contato_whatsapp" varchar,
  	"contato_telefone" varchar,
  	"contato_email" varchar,
  	"imagem_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "sobre_ficha" ADD CONSTRAINT "sobre_ficha_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sobre_capacidades" ADD CONSTRAINT "sobre_capacidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sobre_equipe" ADD CONSTRAINT "sobre_equipe_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sobre_equipe" ADD CONSTRAINT "sobre_equipe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sobre" ADD CONSTRAINT "sobre_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sobre" ADD CONSTRAINT "sobre_historia_imagem_id_media_id_fk" FOREIGN KEY ("historia_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "localizacao_horarios" ADD CONSTRAINT "localizacao_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."localizacao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "localizacao" ADD CONSTRAINT "localizacao_imagem_id_media_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sobre_ficha_order_idx" ON "sobre_ficha" USING btree ("_order");
  CREATE INDEX "sobre_ficha_parent_id_idx" ON "sobre_ficha" USING btree ("_parent_id");
  CREATE INDEX "sobre_capacidades_order_idx" ON "sobre_capacidades" USING btree ("_order");
  CREATE INDEX "sobre_capacidades_parent_id_idx" ON "sobre_capacidades" USING btree ("_parent_id");
  CREATE INDEX "sobre_equipe_order_idx" ON "sobre_equipe" USING btree ("_order");
  CREATE INDEX "sobre_equipe_parent_id_idx" ON "sobre_equipe" USING btree ("_parent_id");
  CREATE INDEX "sobre_equipe_foto_idx" ON "sobre_equipe" USING btree ("foto_id");
  CREATE INDEX "sobre_imagem_idx" ON "sobre" USING btree ("imagem_id");
  CREATE INDEX "sobre_historia_historia_imagem_idx" ON "sobre" USING btree ("historia_imagem_id");
  CREATE INDEX "localizacao_horarios_order_idx" ON "localizacao_horarios" USING btree ("_order");
  CREATE INDEX "localizacao_horarios_parent_id_idx" ON "localizacao_horarios" USING btree ("_parent_id");
  CREATE INDEX "localizacao_imagem_idx" ON "localizacao" USING btree ("imagem_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sobre_ficha" CASCADE;
  DROP TABLE "sobre_capacidades" CASCADE;
  DROP TABLE "sobre_equipe" CASCADE;
  DROP TABLE "sobre" CASCADE;
  DROP TABLE "localizacao_horarios" CASCADE;
  DROP TABLE "localizacao" CASCADE;`)
}
