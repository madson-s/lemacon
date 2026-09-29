import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/slug'

/**
 * As frentes da LM — hoje Esquadrias, Vidros e Construção. Cada categoria
 * pertence a uma unidade, e é por ela que o catálogo agrupa os produtos.
 *
 * O site inteiro lê esta lista: os filtros do catálogo e da home, os cards de
 * "Comece por unidade", o fim da página do produto, o rodapé e o formulário de
 * orçamento. Uma unidade nova aparece em todos esses lugares assim que for
 * cadastrada — sem produto, o filtro dela fica desabilitado até ganhar o primeiro.
 */
export const Unidades: CollectionConfig = {
  slug: 'unidades',
  labels: {
    singular: 'Unidade',
    plural: 'Unidades',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ordem'],
    description:
      'As frentes da LM. Cada categoria pertence a uma unidade, e o site usa esta lista nos filtros, nos cards da home, na página do produto, no rodapé e no formulário de orçamento.',
  },
  defaultSort: 'ordem',
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Curto: é o texto do botão de filtro. Ex.: Esquadrias, Vidros, Construção.',
      },
    },
    slugField('nome'),
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      admin: {
        description:
          'Uma linha sobre o que a unidade faz. Aparece no card de "Comece por unidade", na home, e no fim da página de cada produto.',
      },
    },
    {
      name: 'imagem',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'A foto do card. Vertical funciona melhor — o card é mais alto que largo. Sem foto, o card usa uma imagem genérica do catálogo.',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Ordem em todos os lugares onde as unidades aparecem. Menor vem primeiro.',
      },
    },
  ],
}
