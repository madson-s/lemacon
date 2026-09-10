import type { Field, GlobalConfig } from 'payload'

/**
 * Banner é arte pronta: o PNG carrega o texto e a página só o enquadra e liga
 * ao destino. Por isso não há título nem descrição aqui — só imagem, alt e link.
 */
const bannerFields: Field[] = [
  {
    name: 'imagem',
    label: 'Arte do banner',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
      description:
        'PNG na proporção 8:3 — 1200 × 450 px funciona bem. Fora dessa proporção, as bordas da arte podem ser cortadas.',
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
        'Para onde o banner leva. Ex.: /catalogo?unidade=Esquadrias ou /#orcamento. Vazio, o banner não vira clicável.',
      placeholder: '/catalogo',
    },
  },
]

/**
 * Conteúdo do topo da home. É um global (documento único) porque a home não é
 * uma lista — tem só uma versão, editável sem mexer no código.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'chapeu',
      label: 'Chapéu',
      type: 'text',
      defaultValue: 'Design moderno para ambientes reais',
      admin: {
        description: 'Linha curta acima do título. Posiciona antes de o visitante ler o resto.',
      },
    },
    {
      name: 'titulo',
      label: 'Título do hero',
      type: 'text',
      required: true,
      defaultValue: 'O ambiente inteiro muda quando cada escolha tem intenção',
    },
    {
      name: 'subtitulo',
      label: 'Subtítulo',
      type: 'textarea',
      defaultValue:
        'Móveis, iluminação e decoração de linhas modernas, escolhidos para valorizar o espaço que você já tem — não para competir com ele.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaTexto',
          label: 'Texto do botão',
          type: 'text',
          required: true,
          defaultValue: 'Ver o catálogo',
          admin: { width: '50%' },
        },
        {
          name: 'ctaLink',
          label: 'Link do botão',
          type: 'text',
          required: true,
          defaultValue: '/catalogo',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaSecundarioTexto',
          label: 'Texto do botão secundário',
          type: 'text',
          defaultValue: 'Ver trabalhos executados',
          admin: { width: '50%' },
        },
        {
          name: 'ctaSecundarioLink',
          label: 'Link do botão secundário',
          type: 'text',
          defaultValue: '/trabalhos',
          admin: {
            width: '50%',
            description: 'Deixe o texto vazio para esconder o botão.',
          },
        },
      ],
    },
    {
      name: 'imagem',
      label: 'Imagem de fundo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Sem imagem, o hero usa um fundo sólido.',
      },
    },
    {
      name: 'marcas',
      label: 'Faixa de marcas',
      labels: {
        singular: 'Marca',
        plural: 'Marcas',
      },
      type: 'array',
      admin: {
        description:
          'Lista fixa exibida na faixa rolante da home, na ordem em que estiverem aqui. Deixe vazio para esconder a faixa.',
      },
      fields: [
        {
          name: 'nome',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'secaoTrabalhos',
      label: 'Seção de trabalhos',
      type: 'group',
      admin: {
        description: 'Bloco da home que leva para /trabalhos. Some se não houver trabalho publicado.',
      },
      fields: [
        {
          name: 'chapeu',
          label: 'Chapéu',
          type: 'text',
          defaultValue: 'Trabalhos executados',
        },
        {
          name: 'titulo',
          label: 'Título',
          type: 'text',
          defaultValue: 'Soluções que valorizam o ambiente',
        },
        {
          name: 'texto',
          type: 'textarea',
          defaultValue:
            'Cada projeto começa lendo o espaço: proporção, luz e circulação. As peças entram depois, para resolver — não para preencher.',
        },
        {
          name: 'ctaTexto',
          label: 'Texto do botão',
          type: 'text',
          defaultValue: 'Ver todos os trabalhos',
        },
      ],
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
      fields: bannerFields,
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
      fields: bannerFields,
    },
  ],
}
