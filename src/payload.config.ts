import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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

/**
 * O disco da Vercel é efêmero: um arquivo salvo numa requisição não existe na
 * seguinte. Com as credenciais S3 do Supabase Storage configuradas, os uploads
 * vão para o bucket; sem elas, o Payload continua gravando em `media/` — que é
 * o que queremos no desenvolvimento local.
 */
const s3 = {
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
}

const temS3 = Boolean(
  s3.bucket && s3.endpoint && s3.accessKeyId && s3.secretAccessKey,
)

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
  plugins: temS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: s3.bucket as string,
          config: {
            endpoint: s3.endpoint,
            region: s3.region || 'us-east-1',
            // O Supabase Storage expõe o bucket no caminho, e não no subdomínio.
            forcePathStyle: true,
            credentials: {
              accessKeyId: s3.accessKeyId as string,
              secretAccessKey: s3.secretAccessKey as string,
            },
          },
        }),
      ]
    : [],
})
