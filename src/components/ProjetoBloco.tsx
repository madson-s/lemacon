import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { legendaDoProjeto, rotuloDoTipo, type ProjetoItem } from '@/lib/projetos'
import { linkDoProduto, type ProdutoItem } from '@/lib/produtos'
import type { Projeto } from '@/payload-types'

/**
 * Um trabalho por bloco, alternando o lado da foto principal. Tudo mora numa
 * página só — por isso a galeria fica em faixa, e não em página de detalhe.
 */
export function ProjetoBloco({
  projeto,
  descricao,
  produtos,
  invertido,
  primeiro,
}: {
  projeto: ProjetoItem
  descricao: Projeto['descricao']
  produtos: ProdutoItem[]
  invertido: boolean
  primeiro: boolean
}) {
  const legenda = legendaDoProjeto(projeto)
  const tipo = rotuloDoTipo(projeto.tipo)

  return (
    <article className="border-t border-neutral-200 py-16 first:border-t-0 first:pt-0 lg:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className={invertido ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'}>
          {projeto.capaUrl ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={projeto.capaUrl}
                alt={projeto.capaAlt}
                fill
                preload={primeiro}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500">
              sem foto
            </div>
          )}

          {projeto.fotos.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-4">
              {projeto.fotos.slice(0, 3).map((foto) => (
                <li key={foto.url} className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={foto.url}
                    alt={foto.alt}
                    fill
                    sizes="(max-width: 1024px) 33vw, 19vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={invertido ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'}>
          {(tipo || legenda) && (
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              {[tipo, legenda].filter(Boolean).join(' — ')}
            </p>
          )}

          <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
            {projeto.titulo}
          </h2>

          {projeto.resumo && (
            <p className="mt-4 text-pretty text-neutral-600">{projeto.resumo}</p>
          )}

          {descricao && (
            <div className="prose prose-neutral mt-5 max-w-none prose-p:text-neutral-600">
              <RichText data={descricao} />
            </div>
          )}

          {produtos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Peças usadas
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {produtos.map((produto) => (
                  <li key={produto.id}>
                    <Link
                      href={linkDoProduto(produto)}
                      className="inline-block rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                    >
                      {produto.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
