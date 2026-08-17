import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { GaleriaProduto, type Foto } from '@/components/GaleriaProduto'
import { GradeDeProdutos } from '@/components/ProdutoCard'
import {
  altDaMedia,
  formatarPreco,
  paraProdutoItem,
  urlDaMedia,
  type ProdutoItem,
} from '@/lib/produtos'
import type { Produto } from '@/payload-types'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const RELACIONADOS = 4

/** Aceita slug ou id na URL: links antigos e produtos sem slug continuam abrindo. */
const buscarProduto = async (slug: string): Promise<Produto | null> => {
  const payload = await getPayload({ config: await config })

  const porSlug = await payload.find({
    collection: 'produtos',
    depth: 2,
    limit: 1,
    where: { and: [{ ativo: { equals: true } }, { slug: { equals: slug } }] },
  })
  if (porSlug.docs[0]) return porSlug.docs[0]

  const id = Number(slug)
  if (!Number.isInteger(id)) return null

  const porId = await payload.find({
    collection: 'produtos',
    depth: 2,
    limit: 1,
    where: { and: [{ ativo: { equals: true } }, { id: { equals: id } }] },
  })
  return porId.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const produto = await buscarProduto(slug)

  if (!produto) return { title: 'Produto não encontrado' }

  return {
    title: produto.nome,
    description: produto.descricao ?? undefined,
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await buscarProduto(slug)

  if (!produto) notFound()

  const payload = await getPayload({ config: await config })
  const categoria = typeof produto.categoria === 'object' ? produto.categoria : null

  const { docs: relacionados } = await payload.find({
    collection: 'produtos',
    depth: 1,
    limit: RELACIONADOS,
    sort: ['-destaque', 'nome'],
    where: {
      and: [
        { ativo: { equals: true } },
        { id: { not_equals: produto.id } },
        { categoria: { equals: categoria?.id ?? produto.categoria } },
      ],
    },
  })

  const fotos: Foto[] = [produto.imagem, ...(produto.galeria ?? [])]
    .map((media) => ({ url: urlDaMedia(media), alt: altDaMedia(media) }))
    .filter((f): f is Foto => f.url !== null)

  const itensRelacionados: ProdutoItem[] = relacionados.map(paraProdutoItem)

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Trilha" className="mb-8 text-sm text-neutral-500">
        <Link href="/catalogo" className="hover:text-neutral-900">
          Todos os produtos
        </Link>
        {categoria && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/catalogo?categoria=${categoria.id}`} className="hover:text-neutral-900">
              {categoria.nome}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{produto.nome}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <GaleriaProduto fotos={fotos} nome={produto.nome} />

        <div>
          {categoria && (
            <Link
              href={`/catalogo?categoria=${categoria.id}`}
              className="text-xs uppercase tracking-wide text-neutral-400 hover:text-neutral-900"
            >
              {categoria.nome}
            </Link>
          )}

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{produto.nome}</h1>

          {produto.marca && <p className="mt-1 text-neutral-500">{produto.marca}</p>}

          <p className="mt-4 text-2xl font-semibold">
            {produto.preco == null ? (
              <span className="text-lg font-normal text-neutral-500">sob consulta</span>
            ) : (
              formatarPreco(produto.preco)
            )}
          </p>

          {produto.descricao && (
            <p className="mt-6 text-neutral-600">{produto.descricao}</p>
          )}

          {produto.especificacoes && produto.especificacoes.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Especificações
              </h2>
              <dl className="divide-y divide-neutral-200 border-y border-neutral-200 text-sm">
                {produto.especificacoes.map((spec) => (
                  <div key={spec.id ?? spec.rotulo} className="flex gap-4 py-2.5">
                    <dt className="w-40 shrink-0 text-neutral-500">{spec.rotulo}</dt>
                    <dd>{spec.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {produto.detalhes && (
            <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold">
              <RichText data={produto.detalhes} />
            </div>
          )}
        </div>
      </div>

      {itensRelacionados.length > 0 && (
        <section className="mt-20 border-t border-neutral-200 pt-10">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Produtos relacionados</h2>
            {categoria && (
              <Link
                href={`/catalogo?categoria=${categoria.id}`}
                className="whitespace-nowrap text-sm font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                Ver tudo em {categoria.nome} &rarr;
              </Link>
            )}
          </div>
          <GradeDeProdutos produtos={itensRelacionados} />
        </section>
      )}
    </article>
  )
}
