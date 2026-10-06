import type { Field, GlobalConfig } from 'payload'

/**
 * Banner é arte pronta: o PNG carrega o texto e a página só o enquadra e liga
 * ao destino. Por isso não há título nem descrição aqui — só imagem, alt e link.
 */
const bannerFields = (medida: string): Field[] => [
  {
    name: 'imagem',
    label: 'Arte do banner',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description: `PNG ${medida}. Fora dessa proporção, as bordas da arte podem ser cortadas.`,
    },
  },
  {
    name: 'alt',
    label: 'Descrição da arte',
    type: 'text',
    required: true,
    admin: {
      description:
        'O que o banner diz, em uma frase. É o que quem usa leitor de tela ouve no lugar da imagem.',
    },
  },
  {
    name: 'link',
    label: 'Link',
    type: 'text',
    admin: {
      description:
        'Para onde o banner leva: /catalogo, a página de um produto (/catalogo/telha-residence) ou /#orcamento. Vazio, o banner não vira clicável.',
      placeholder: '/catalogo',
    },
  },
]

/**
 * O que a home deixa o painel editar: a vitrine de produtos e as três faixas de
 * banner. O resto da página — o título do topo, as unidades, o bloco do grupo e
 * os três passos — é fixo no código, porque é a apresentação da LM e não muda
 * com o catálogo.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'secaoCatalogo',
      label: 'Seção de produtos da home',
      type: 'group',
      admin: {
        description:
          'A vitrine logo abaixo do topo. Os produtos vêm do catálogo: marque "Mostrar na home" em cada um. Sem nenhum marcado, aparecem os mais recentes.',
      },
      fields: [
        {
          name: 'chapeu',
          label: 'Chapéu',
          type: 'text',
          defaultValue: 'Catálogo',
        },
        {
          name: 'titulo',
          label: 'Título',
          type: 'text',
          defaultValue: 'Produtos e serviços que a LM entrega',
        },
        {
          name: 'texto',
          label: 'Texto de apoio',
          type: 'textarea',
          defaultValue:
            'Um catálogo amplo de esquadrias, vidros e obra — cada peça medida, fabricada e instalada pela nossa equipe. Filtre por unidade de negócio.',
        },
      ],
    },
    {
      name: 'contato',
      label: 'Contato',
      type: 'group',
      admin: {
        description:
          'Usado na seção "Conte o seu projeto": o botão "Falar no WhatsApp" e o formulário de orçamento, que abre o WhatsApp com a mensagem já escrita.',
      },
      fields: [
        {
          name: 'whatsapp',
          label: 'WhatsApp',
          type: 'text',
          required: true,
          defaultValue: '75993364665',
          admin: {
            description: 'Só os números, com DDD e sem o 55. Ex.: 75993364665',
            placeholder: '75993364665',
          },
          // DDD + celular (9 dígitos começando com 9) ou fixo (8 dígitos, de 2 a 5).
          // Barra o número com um dígito a mais ou sem DDD, que viraria um link
          // de WhatsApp para outra pessoa.
          validate: (valor: string | null | undefined) =>
            /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(String(valor ?? '').replace(/\D/g, '')) ||
            'Confira o número: DDD + celular com 9 dígitos (ex.: 75993364665).',
        },
      ],
    },
    {
      name: 'bannersHero',
      label: 'Banners do topo',
      labels: { singular: 'Banner', plural: 'Banners' },
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Aparecem sobre a foto do topo: empilhados à direita no computador, e como um slide que desliza no celular. Todos com o mesmo tamanho. Deixe vazio para esconder.',
      },
      fields: bannerFields('na proporção 16:6 — 1020 × 390 px atende bem do computador ao celular'),
    },
    {
      name: 'bannersFaixa1',
      label: 'Banners — faixa de cima',
      labels: { singular: 'Banner', plural: 'Banners' },
      type: 'array',
      admin: {
        description:
          'Aparece logo depois das categorias, antes do bloco "Três frentes, uma equipe". Dois banners por linha. Deixe vazio para esconder a faixa.',
      },
      fields: bannerFields('na proporção 8:3 — 1200 × 450 px funciona bem'),
    },
    {
      name: 'bannersFaixa2',
      label: 'Banners — faixa de baixo',
      labels: { singular: 'Banner', plural: 'Banners' },
      type: 'array',
      admin: {
        description:
          'Aparece depois do bloco "Três passos até a instalação". Dois banners por linha. Deixe vazio para esconder a faixa.',
      },
      fields: bannerFields('na proporção 8:3 — 1200 × 450 px funciona bem'),
    },
  ],
}
