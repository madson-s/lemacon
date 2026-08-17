import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/slug'

/**
 * O que a LM oferece — a etapa de serviço, não a peça (Produtos) nem o resultado
 * pronto (Projetos). É o meio de campo entre os dois na narrativa do site.
 */
export const Solucoes: CollectionConfig = {
  slug: 'solucoes',
  labels: {
    singular: 'Solução',
    plural: 'Soluções',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ordem', 'publicado'],
    description: 'Soluções oferecidas, exibidas na página /solucoes.',
  },
  // Sem isto o Payload singulariza "solucoes" para "Solucoe".
  typescript: {
    interface: 'Solucao',
  },
  defaultSort: 'ordem',
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
    },
    slugField('titulo'),
    {
      name: 'resumo',
      type: 'textarea',
      admin: {
        description: 'Uma ou duas linhas: que problema do ambiente essa solução resolve.',
      },
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'richText',
      admin: {
        description: 'Texto longo: como funciona na prática.',
      },
    },
    {
      name: 'entregaveis',
      label: 'O que está incluso',
      labels: {
        singular: 'Item',
        plural: 'Itens',
      },
      type: 'array',
      admin: {
        description: 'Lista objetiva do que o cliente recebe. Aparece ao lado do texto.',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'imagem',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Sem imagem, o bloco usa só o número e o texto.',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Define a numeração e a sequência na página. Menor aparece primeiro.',
      },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Desmarque para tirar de /solucoes sem apagar o cadastro.',
      },
    },
  ],
}
