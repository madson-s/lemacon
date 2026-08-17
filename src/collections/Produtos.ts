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
        description: 'Fabricante da peça. A faixa de marcas da home é uma lista à parte, editada em Home.',
      },
    },
    {
      name: 'descricao',
      label: 'Descrição curta',
      type: 'textarea',
      admin: {
        description: 'Uma ou duas linhas. É o que aparece no card do catálogo.',
      },
    },
    {
      name: 'preco',
      label: 'Preço',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
        description: 'Em reais. Deixe vazio para exibir "sob consulta".',
      },
    },
    {
      name: 'imagem',
      label: 'Imagem principal',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Aparece no card e abre a galeria na página do produto.',
      },
    },
    {
      name: 'galeria',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Fotos adicionais mostradas na página do produto.',
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
        description: 'Pares como Material / Madeira maciça. Viram a tabela da página do produto.',
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
        description: 'Termos alternativos que ajudam o cliente a achar o produto na busca.',
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
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
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
