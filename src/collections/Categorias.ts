import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/slug'

export const Categorias: CollectionConfig = {
  slug: 'categorias',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug', 'ordem'],
  },
  defaultSort: 'ordem',
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
    },
    slugField('nome'),
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Define a ordem de exibição no catálogo. Menor aparece primeiro.',
      },
    },
    {
      name: 'destacarNaHome',
      label: 'Destacar na home',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'A home ganha uma seção para cada categoria marcada aqui.',
      },
    },
  ],
}
