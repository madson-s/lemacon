import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (from: string): FieldHook =>
  ({ data, originalDoc, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)

    const fallback = data?.[from] ?? originalDoc?.[from]
    if (typeof fallback === 'string' && fallback.length > 0) return slugify(fallback)

    return value
  }

/**
 * Campo de slug que se preenche sozinho a partir de outro campo (por padrão, `nome`).
 * Continua editável no painel para quando a URL precisar ser diferente do título.
 */
export const slugField = (from = 'nome'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Gerado a partir de "${from}". Edite apenas se precisar de uma URL específica.`,
  },
  hooks: {
    beforeValidate: [formatSlug(from)],
  },
})
