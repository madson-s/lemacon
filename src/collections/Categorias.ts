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
    defaultColumns: ['nome', 'unidade', 'ordem'],
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
      name: 'unidade',
      label: 'Unidade',
      type: 'relationship',
      relationTo: 'unidades',
      index: true,
      admin: {
        description:
          'A frente da LM a que esta categoria pertence — é o que agrupa os produtos no filtro de unidades. Sem unidade, os produtos aparecem só em "Todas" e no filtro da própria categoria. Para criar uma unidade nova, use Unidades.',
      },
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
  ],
}
