import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/slug'

export const Produtos: CollectionConfig = {
  slug: 'produtos',
  labels: {
    singular: 'Produto',
    plural: 'Produtos',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'categoria', 'preco', 'ativo'],
  },
  defaultSort: 'nome',
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
    },
    slugField('nome'),
    {
      name: 'categoria',
      type: 'relationship',
      relationTo: 'categorias',
      required: true,
      index: true,
    },
    {
      name: 'marca',
      type: 'text',
      index: true,
      admin: {
        description:
          'Fabricante da peça, como Kingspan ou Wallboard. Aparece na página do produto.',
      },
    },
    {
      name: 'descricao',
      label: 'Descrição curta',
      type: 'textarea',
      admin: {
        description:
          'Um parágrafo curto na página do produto, logo abaixo do nome. Também entra na busca do catálogo.',
      },
    },
    {
      name: 'preco',
      label: 'Preço',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
        description:
          'Em reais. Aparece só na página do produto — o card do catálogo sempre mostra "Sob orçamento". Vazio, a página também mostra "Sob orçamento".',
      },
    },
    {
      name: 'imagem',
      label: 'Imagem principal',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'A capa do produto: aparece no card do catálogo e é a primeira foto da galeria.',
      },
    },
    {
      name: 'galeria',
      label: 'Mais fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Outros ângulos, detalhes e aplicações. Aparecem como miniaturas ao lado da foto principal, na ordem em que estiverem aqui — arraste para reordenar.',
      },
    },
    {
      name: 'detalhes',
      type: 'richText',
      admin: {
        description: 'Texto longo da página do produto. Aceita listas, negrito e links.',
      },
    },
    {
      name: 'especificacoes',
      label: 'Especificações',
      labels: {
        singular: 'Especificação',
        plural: 'Especificações',
      },
      type: 'array',
      admin: {
        description: 'Pares como Espessura / 30 mm. Viram a tabela da página do produto.',
      },
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
              type: 'text',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      admin: {
        description:
          'Aparecem como etiquetas na página do produto e ajudam a achá-lo na busca — vale incluir termos que o cliente usaria.',
      },
      fields: [
        {
          name: 'valor',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'promocao',
      label: 'Em promoção',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Produtos em promoção aparecem primeiro no catálogo, antes dos demais. Entre eles, a ordem continua alfabética.',
      },
    },
    {
      name: 'destaque',
      label: 'Mostrar na home',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Marque para o produto aparecer na seção "Produtos e serviços que a LM entrega", na home. Sem nenhum marcado, a seção mostra os mais recentes do catálogo.',
      },
    },
    {
      name: 'ativo',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Desmarque para tirar do catálogo sem apagar o cadastro.',
      },
    },
  ],
}
