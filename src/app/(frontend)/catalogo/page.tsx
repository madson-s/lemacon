import { getPayload } from 'payload'
import React from 'react'

import { CatalogoBusca } from '@/components/CatalogoBusca'
import { paraProdutoItem, type CategoriaItem, type ProdutoItem } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: 'Todos os produtos',
  description: 'Catálogo completo de produtos',
}

// O painel publica a qualquer momento; sem isso o Next serviria o HTML do build.
export const dynamic = 'force-dynamic'

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>
}) {
  const { q, categoria } = await searchParams
  const payload = await getPayload({ config: await config })

  const [{ docs: produtos }, { docs: categorias }] = await Promise.all([
    payload.find({
      collection: 'produtos',
      depth: 1,
      // A busca é no cliente: mandamos o catálogo inteiro e o Fuse indexa no navegador.
      // Acima de ~2.000 produtos, migrar para busca no servidor (ver Init.md).
      limit: 2000,
      pagination: false,
      sort: 'nome',
      where: { ativo: { equals: true } },
    }),
    payload.find({
      collection: 'categorias',
      depth: 0,
      limit: 200,
      pagination: false,
      sort: 'ordem',
    }),
  ])

  const itens: ProdutoItem[] = produtos.map(paraProdutoItem)

  const comProdutos = new Set(itens.map((i) => i.categoriaId))
  const filtros: CategoriaItem[] = categorias
    .filter((c) => comProdutos.has(String(c.id)))
    .map((c) => ({ id: String(c.id), nome: c.nome, slug: c.slug ?? null }))

  const categoriaInicial =
    categoria && filtros.some((c) => c.id === categoria) ? categoria : 'todas'

  return (
    <CatalogoBusca
      // A busca vem da URL (header, links de categoria). Sem a key, navegar de
      // /catalogo?q=mesa para /catalogo?q=vaso não recriaria o estado interno.
      key={`${q ?? ''}|${categoriaInicial}`}
      produtos={itens}
      categorias={filtros}
      termoInicial={q ?? ''}
      categoriaInicial={categoriaInicial}
    />
  )
}
