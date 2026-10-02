import type { GlobalConfig } from 'payload'

/**
 * Conteúdo da página /localizacao.
 *
 * A página fala da região que a LM atende, não de um endereço: o mapa mostra
 * a Chapada Diamantina inteira e o card diz que o ponto de encontro é combinado
 * antes da visita. Endereço, horário e fachada saíram do painel porque a página
 * não os mostra — voltar a exibi-los exige código.
 */
export const Localizacao: GlobalConfig = {
  slug: 'localizacao',
  label: 'Localização',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Página "Localização" do site. Preencha só o que for verdade — o que ficar vazio some da página.',
  },
  fields: [
    {
      // Abas sem nome só organizam o formulário: os campos continuam no topo
      // do documento, então nenhuma coluna do banco muda por causa delas.
      type: 'tabs',
      tabs: [
        {
          label: 'Abertura',
          description: 'O topo da página: título, texto e a região atendida.',
          fields: [
            {
              name: 'chapeu',
              label: 'Chapéu',
              type: 'text',
              defaultValue: 'Onde estamos',
            },
            {
              name: 'titulo',
              label: 'Título',
              type: 'text',
              required: true,
              defaultValue: 'Onde encontrar a LM',
            },
            {
              name: 'lead',
              label: 'Texto de abertura',
              type: 'textarea',
              defaultValue:
                'Atendemos toda a Chapada Diamantina: projeto, fabricação e instalação chegam até a sua obra. Abaixo estão os canais para falar com a gente.',
            },
            {
              name: 'regiao',
              label: 'Região atendida',
              type: 'text',
              defaultValue: 'Toda a Chapada Diamantina',
              admin: {
                description:
                  'Onde a LM atende. Aparece no destaque do topo, no título do card sobre o mapa e no card da seção "A LM vai até você".',
              },
            },
            {
              name: 'regiaoRotulo',
              label: 'Rótulo da região',
              type: 'text',
              defaultValue: 'Área de atendimento',
              admin: { description: 'Linha pequena acima da região, no destaque do topo.' },
            },
          ],
        },
        {
          label: 'Mapa',
          description: 'O card que fica por cima do mapa da Chapada Diamantina.',
          fields: [
            {
              name: 'cartaoMapa',
              label: 'Card sobre o mapa',
              type: 'group',
              admin: {
                description:
                  'O título do card é a região atendida (aba Abertura); aqui ficam o chapéu e o texto.',
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'Ponto de atendimento',
                },
                {
                  name: 'semEndereco',
                  label: 'Texto do card',
                  type: 'textarea',
                  defaultValue:
                    'A equipe combina o melhor ponto de encontro com você antes da visita.',
                },
              ],
            },
          ],
        },
        {
          label: 'Destaques',
          fields: [
            {
              name: 'destaques',
              label: 'Faixa de destaques',
              labels: { singular: 'Destaque', plural: 'Destaques' },
              type: 'array',
              admin: {
                description:
                  'A faixa logo abaixo do mapa. Linha sem valor não aparece; deixe a lista vazia para esconder a faixa.',
              },
              defaultValue: [
                { rotulo: 'Atendimento', valor: 'Toda a Chapada Diamantina' },
                { rotulo: 'Escopo', valor: 'Projeto · fabricação · instalação' },
                { rotulo: 'Avaliação', valor: 'No local e sem compromisso' },
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
                      admin: { width: '40%' },
                    },
                    {
                      name: 'valor',
                      label: 'Valor',
                      type: 'text',
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Cobertura',
          fields: [
            {
              name: 'cobertura',
              label: 'Seção "A LM vai até você"',
              type: 'group',
              admin: {
                description:
                  'O texto ao lado do card da região atendida, e o rótulo e o texto desse card.',
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'A LM vai até você',
                },
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Da primeira medida à instalação no seu endereço',
                },
                {
                  name: 'texto',
                  label: 'Texto',
                  type: 'textarea',
                  defaultValue:
                    'Antes de fabricar, entendemos o ambiente, os acessos e o uso de cada abertura. Assim, a visita já começa com contexto e termina com uma solução possível de executar.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaTexto',
                      label: 'Texto do botão',
                      type: 'text',
                      defaultValue: 'Conhecer o catálogo',
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
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'regiaoRotulo',
                      label: 'Card da região — rótulo',
                      type: 'text',
                      defaultValue: 'Região atendida',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'regiaoTexto',
                      label: 'Card da região — texto',
                      type: 'text',
                      defaultValue: 'Projeto, fabricação e instalação chegam até a sua obra.',
                      admin: { width: '60%' },
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
