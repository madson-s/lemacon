import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

import { limparMarcadorDev } from './limpar-marcador-dev'
import { MIDIA_WALLBOARD, PRODUTOS_WALLBOARD } from './seed-wallboard-dados'

/**
 * Revestimentos flexíveis Wallboard.
 *
 *   pnpm payload run scripts/seed-wallboard.ts
 *
 * É idempotente, como o seed principal: produto que já existe é deixado como
 * está, e foto só sobe para produto que ainda não tem imagem. Serve tanto para
 * popular a produção quanto para repetir depois de incluir novas cores.
 */
const payload = await getPayload({ config })

// --- Categoria ------------------------------------------------------------
const NOME_CATEGORIA = 'Fachadas e Revestimentos'
const achadaCategoria = await payload.find({
  collection: 'categorias',
  where: { nome: { equals: NOME_CATEGORIA } },
  limit: 1,
})
const categoria = achadaCategoria.docs[0]

if (!categoria) {
  console.error(`categoria "${NOME_CATEGORIA}" não existe — rode antes o seed-lm.ts`)
  process.exit(1)
}

// --- Produtos -------------------------------------------------------------
for (const item of PRODUTOS_WALLBOARD) {
  const achado = await payload.find({
    collection: 'produtos',
    where: { nome: { equals: item.nome } },
    limit: 1,
  })

  if (achado.docs[0]) {
    console.log('produto já existia:', item.nome)
    continue
  }

  const criado = await payload.create({
    collection: 'produtos',
    data: {
      nome: item.nome,
      categoria: categoria.id,
      marca: item.marca,
      descricao: item.descricao,
      tags: item.tags.map((valor) => ({ valor })),
      ativo: true,
    },
  })
  console.log('produto criado:', criado.nome, '->', criado.slug)
}

// --- Fotos ----------------------------------------------------------------
const PASTA_FOTOS = path.resolve(process.cwd(), 'public/produtos')

const subirFoto = async ([arquivo, alt]: [string, string]) => {
  const achado = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
  })
  if (achado.docs[0]) return achado.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(PASTA_FOTOS, arquivo),
  })
  return doc.id
}

for (const midia of MIDIA_WALLBOARD) {
  const achado = await payload.find({
    collection: 'produtos',
    where: { nome: { equals: midia.produto } },
    limit: 1,
  })
  const produto = achado.docs[0]

  if (!produto) {
    console.warn('produto ausente, fotos ignoradas:', midia.produto)
    continue
  }
  if (produto.imagem) continue

  const capa = await subirFoto(midia.capa as [string, string])
  const galeria: number[] = []
  for (const foto of midia.galeria) galeria.push(await subirFoto(foto as [string, string]))

  await payload.update({
    collection: 'produtos',
    id: produto.id,
    data: { imagem: capa, galeria },
  })
  console.log('fotos aplicadas:', midia.produto, `(1 capa + ${galeria.length})`)
}

console.log('seed Wallboard concluído')

await limparMarcadorDev(payload)

process.exit(0)
