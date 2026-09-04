import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categorias } from './collections/Categorias'
import { Media } from './collections/Media'
import { Produtos } from './collections/Produtos'
import { Projetos } from './collections/Projetos'
import { Solucoes } from './collections/Solucoes'
import { Users } from './collections/Users'
import { Home } from './globals/Home'
import { Localizacao } from './globals/Localizacao'
import { Sobre } from './globals/Sobre'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Produtos, Categorias, Solucoes, Projetos, Media, Users],
  globals: [Home, Sobre, Localizacao],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
})
