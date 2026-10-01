import type { GlobalConfig } from 'payload'

/**
 * Conteúdo da página /sobre. É um global porque a página é um documento único.
 *
 * Os campos vêm vazios de propósito onde o dado é da empresa e ninguém pode
 * inventar por ela (ano de fundação, cidade, tamanho e nomes da equipe): a
 * página esconde a seção inteira em vez de mostrar um valor de mentira.
 */
export const Sobre: GlobalConfig = {
  slug: 'sobre',
  label: 'Sobre',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Página "Sobre" do site. As abas seguem a ordem das seções na página, e o que estiver vazio aqui simplesmente não aparece lá. Ainda faltam História e Equipe: enquanto estiverem vazias, essas duas seções ficam de fora.',
  },
  fields: [
    {
      // Abas sem nome só organizam o formulário: os campos continuam no topo
      // do documento, então nenhuma coluna do banco muda por causa delas.
      type: 'tabs',
      tabs: [
        {
          label: 'Abertura',
          description: 'O topo da página: título, texto, botão, foto e a ficha da empresa.',
          fields: [
            {
              name: 'chapeu',
              label: 'Chapéu',
              type: 'text',
              defaultValue: 'Sobre a LM',
              admin: {
                description: 'Linha curta acima do título.',
              },
            },
            {
              name: 'titulo',
              label: 'Título',
              type: 'text',
              required: true,
              defaultValue: 'Quem desenha, fabrica e instala é a mesma equipe',
            },
            {
              name: 'lead',
              label: 'Texto de abertura',
              type: 'textarea',
              defaultValue:
                'A LM projeta, produz no próprio galpão e instala com equipe própria. É por isso que conseguimos fechar prazo, ajustar o acabamento na hora e responder por tudo depois da entrega.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaTexto',
                  label: 'Texto do botão',
                  type: 'text',
                  defaultValue: 'Conheça o seu projeto com a LM',
                  admin: { width: '50%', description: 'Botão logo abaixo do texto de abertura.' },
                },
                {
                  name: 'ctaLink',
                  label: 'Link do botão',
                  type: 'text',
                  defaultValue: '/#orcamento',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'imagem',
              label: 'Imagem de abertura',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Opcional. Uma foto da equipe, do galpão ou de uma obra entregue.',
              },
            },
            {
              name: 'imagemLegenda',
              label: 'Legenda da imagem',
              type: 'text',
              defaultValue: 'Projeto · fabricação · instalação',
              admin: {
                description: 'Etiqueta curta sobre a foto de abertura. Deixe vazio para esconder.',
              },
            },
            {
              name: 'ficha',
              label: 'Ficha da empresa',
              labels: { singular: 'Linha da ficha', plural: 'Linhas da ficha' },
              type: 'array',
              admin: {
                description:
                  'Os dados objetivos da LM, logo abaixo do título da página. Só as três primeiras linhas preenchidas aparecem — ponha no topo o que mais importa. Preencha só o que for verdade: linha sem valor é pulada.',
              },
              defaultValue: [
                { rotulo: 'Atendimento', valor: 'Toda a Chapada Diamantina' },
                { rotulo: 'Escopo', valor: 'Projeto · fabricação · instalação' },
                { rotulo: 'Frentes', valor: 'Esquadrias · Vidros · Construção' },
                { rotulo: 'Fabricação', valor: 'Galpão próprio, equipe própria' },
                { rotulo: 'Fundação', valor: '' },
                { rotulo: 'Sede', valor: '' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rotulo',
                      label: 'Rótulo',
                      type: 'text',
                      required: true,
                      admin: { width: '40%', placeholder: 'Fundação' },
                    },
                    {
                      name: 'valor',
                      label: 'Valor',
                      type: 'text',
                      admin: { width: '60%', placeholder: '2014' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Execução',
          description: 'A seção "O que sai daqui pronto": o que a LM executa de ponta a ponta.',
          fields: [
            {
              name: 'capacidadesChapeu',
              label: 'Chapéu da seção',
              type: 'text',
              defaultValue: 'Estrutura própria',
            },
            {
              name: 'capacidadesTitulo',
              label: 'Título da seção de execução',
              type: 'text',
              defaultValue: 'O que sai daqui pronto',
            },
            {
              name: 'capacidadesTexto',
              label: 'Texto da seção',
              type: 'textarea',
              defaultValue:
                'Da leitura do vão ao acabamento final, as decisões acontecem perto de quem vai fabricar e instalar.',
            },
            {
              name: 'capacidades',
              label: 'Capacidade de execução',
              labels: { singular: 'Frente', plural: 'Frentes' },
              type: 'array',
              admin: {
                description:
                  'O que a LM executa de ponta a ponta. Deixe vazio para esconder a seção.',
              },
              defaultValue: [
                {
                  titulo: 'Esquadrias de alumínio',
                  texto: 'Portas, janelas, fachadas e coberturas sob medida, do perfil à ferragem.',
                },
                {
                  titulo: 'Vidros temperados',
                  texto:
                    'Box, guarda-corpo, espelhos e coberturas de vidro, cortados e temperados para o vão.',
                },
                {
                  titulo: 'Tec Construção',
                  texto:
                    'Projeto, execução, reforma e ampliação — a obra inteira sob a mesma coordenação.',
                },
              ],
              fields: [
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'texto',
                  label: 'Descrição',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Projetos',
          fields: [
            {
              name: 'projetos',
              label: 'Seção de projetos',
              type: 'group',
              admin: {
                description:
                  'O cabeçalho da seção. Os projetos em si vêm da coleção Projetos — só os publicados aparecem, na ordem definida lá.',
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'Portfólio LM',
                },
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Projetos que mostram como trabalhamos',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaTexto',
                      label: 'Texto do botão',
                      type: 'text',
                      defaultValue: 'Ver catálogo',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ctaLink',
                      label: 'Link do botão',
                      type: 'text',
                      defaultValue: '/catalogo',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'História',
          fields: [
            {
              name: 'historia',
              label: 'História e origem',
              type: 'group',
              admin: {
                description:
                  'PENDENTE — como a LM começou: de onde veio, há quanto tempo está na estrada, o que mudou. Sem texto aqui, a seção inteira não aparece no site.',
              },
              fields: [
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Como a LM começou',
                },
                {
                  name: 'desde',
                  label: 'No mercado desde',
                  type: 'text',
                  admin: {
                    placeholder: '2014',
                    description: 'Só o ano. Aparece em destaque ao lado do texto.',
                  },
                },
                {
                  name: 'texto',
                  label: 'Texto',
                  type: 'richText',
                },
                {
                  name: 'imagem',
                  label: 'Imagem',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'Equipe',
          fields: [
            {
              name: 'equipeTitulo',
              label: 'Título da seção de equipe',
              type: 'text',
              defaultValue: 'Quem faz',
            },
            {
              name: 'equipeTexto',
              label: 'Texto da seção de equipe',
              type: 'textarea',
            },
            {
              name: 'equipe',
              label: 'Equipe',
              labels: { singular: 'Pessoa', plural: 'Pessoas' },
              type: 'array',
              admin: {
                description:
                  'PENDENTE — cadastre só pessoas reais, com o nome como elas querem ser chamadas. Enquanto estiver vazio, a seção não aparece no site.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nome',
                      label: 'Nome',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'funcao',
                      label: 'Função',
                      type: 'text',
                      admin: { width: '50%', placeholder: 'Instalação' },
                    },
                  ],
                },
                {
                  name: 'foto',
                  label: 'Foto',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Opcional. Sem foto, aparecem as iniciais do nome.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Método',
          fields: [
            {
              name: 'metodo',
              label: 'Nosso método',
              type: 'group',
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'Nosso método',
                },
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Uma equipe do primeiro traço à última regulagem',
                },
                {
                  name: 'passos',
                  label: 'Passos',
                  labels: { singular: 'Passo', plural: 'Passos' },
                  type: 'array',
                  admin: {
                    description:
                      'Numerados na ordem em que estiverem aqui — arraste para reordenar. Deixe vazio para esconder a seção.',
                  },
                  defaultValue: [
                    {
                      titulo: 'Projeto conectado à execução',
                      texto: 'Quem mede e especifica acompanha o que será produzido.',
                    },
                    {
                      titulo: 'Fabricação própria',
                      texto: 'Perfis, vidros e acabamentos passam pela mesma coordenação.',
                    },
                    {
                      titulo: 'Instalação e pós-entrega',
                      texto: 'A equipe instala, ajusta e responde por cada detalhe entregue.',
                    },
                  ],
                  fields: [
                    {
                      name: 'titulo',
                      label: 'Título',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'texto',
                      label: 'Descrição',
                      type: 'textarea',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Fechamento',
          fields: [
            {
              name: 'fechamento',
              label: 'Fechamento',
              type: 'group',
              admin: {
                description: 'Bloco final da página, que leva para o orçamento.',
              },
              fields: [
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Traga o vão, a medida ou só a dúvida',
                },
                {
                  name: 'texto',
                  label: 'Texto',
                  type: 'textarea',
                  defaultValue:
                    'A avaliação é sem compromisso. Se der para resolver com o que já existe, a gente fala isso também.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaTexto',
                      label: 'Texto do botão',
                      type: 'text',
                      defaultValue: 'Solicitar orçamento',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ctaLink',
                      label: 'Link do botão',
                      type: 'text',
                      defaultValue: '/#orcamento',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
