import type { GlobalConfig } from 'payload'

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
  ],
}
