import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/slug'

/**
 * Trabalhos executados pela LM. Diferente de Produtos: aqui o que importa é o
 * ambiente pronto — o resultado da escolha das peças, não a peça isolada.
 */
export const Projetos: CollectionConfig = {
  slug: 'projetos',
  labels: {
    singular: 'Trabalho',
    plural: 'Trabalhos',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'local', 'ano', 'publicado'],
    description: 'Projetos executados, exibidos na página /trabalhos.',
  },
  defaultSort: '-ano',
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
    },
    slugField('titulo'),
    {
      type: 'row',
      fields: [
        {
          name: 'local',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Bairro, cidade — ex.: Meireles, Fortaleza.',
          },
        },
        {
          name: 'ano',
          type: 'number',
          admin: { width: '25%' },
        },
        {
          name: 'tipo',
          type: 'select',
          defaultValue: 'residencial',
          options: [
            { label: 'Residencial', value: 'residencial' },
            { label: 'Comercial', value: 'comercial' },
            { label: 'Corporativo', value: 'corporativo' },
          ],
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'resumo',
      type: 'textarea',
      admin: {
        description: 'Uma ou duas linhas sobre o que foi resolvido no ambiente.',
      },
    },
    {
      name: 'capa',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Foto principal do ambiente pronto.',
      },
    },
    {
      name: 'galeria',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Outros ângulos do mesmo trabalho.',
      },
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'richText',
      admin: {
        description: 'Texto longo: o desafio do espaço e a solução adotada.',
      },
    },
    {
      name: 'produtos',
      label: 'Peças usadas',
      type: 'relationship',
      relationTo: 'produtos',
      hasMany: true,
      admin: {
        description: 'Liga o trabalho ao catálogo — o visitante vê o que foi usado.',
      },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Menor aparece primeiro. Empates caem para o ano mais recente.',
      },
    },
    {
      name: 'destaque',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Aparece na prévia da home.',
      },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Desmarque para tirar de /trabalhos sem apagar o cadastro.',
      },
    },
  ],
}
