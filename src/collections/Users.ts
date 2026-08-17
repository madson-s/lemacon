import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nome', 'email'],
  },
  auth: true,
  fields: [
    // email e senha já vêm do `auth: true`
    {
      name: 'nome',
      type: 'text',
    },
  ],
}
