import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { altDaMedia, urlDaMedia } from '@/lib/produtos'
import type { Solucao } from '@/payload-types'
import config from '@/payload.config'

export const metadata = {
  title: 'Soluções',
  description:
    'O que a LM faz: leitura do espaço, projeto de iluminação, curadoria de mobiliário e execução — cada etapa resolvendo uma parte do ambiente.',
}

export const dynamic = 'force-dynamic'

export default async function SolucoesPage() {
  const payload = await getPayload({ config: await config })

  const { docs: solucoes } = await payload.find({
    collection: 'solucoes',
    depth: 1,
    limit: 50,
    pagination: false,
    sort: 'ordem',
    where: { publicado: { equals: true } },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Soluções LM</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Do diagnóstico do espaço à última peça instalada
        </h1>
        <p className="mt-5 text-pretty text-lg text-neutral-600">
          Nem todo ambiente precisa de tudo. Cada solução abaixo resolve uma etapa — você entra na
          que faz sentido para o seu espaço e para o seu momento.
        </p>
      </header>

      {solucoes.length === 0 ? (
        <p className="my-20 rounded-lg border border-dashed border-neutral-300 px-4 py-16 text-center text-neutral-500">
          Nenhuma solução publicada ainda. Cadastre em{' '}
          <Link href="/admin/collections/solucoes" className="underline">
            Soluções
          </Link>{' '}
          no painel.
        </p>
      ) : (
        <div className="mt-16">
          {solucoes.map((solucao, i) => (
            <SolucaoBloco
              key={solucao.id}
              solucao={solucao}
              indice={i + 1}
              invertido={i % 2 === 1}
              primeiro={i === 0}
            />
          ))}
        </div>
      )}

      <section className="mt-20 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Veja como isso fica pronto
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-neutral-600">
          Os trabalhos executados mostram essas etapas aplicadas em ambientes reais.
        </p>
        <Link
          href="/trabalhos"
          className="mt-8 inline-block rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Ver trabalhos executados
        </Link>
      </section>
    </div>
  )
}

function SolucaoBloco({
  solucao,
  indice,
  invertido,
  primeiro,
}: {
  solucao: Solucao
  indice: number
  invertido: boolean
  primeiro: boolean
}) {
  const imagem = urlDaMedia(solucao.imagem)
  const entregaveis = solucao.entregaveis ?? []

  return (
    <article className="border-t border-neutral-200 py-14 first:border-t-0 first:pt-0 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className={invertido ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'}>
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden
              className="text-4xl font-semibold tabular-nums leading-none text-neutral-300"
            >
              {String(indice).padStart(2, '0')}
            </span>
            <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
              {solucao.titulo}
            </h2>
          </div>

          {solucao.resumo && (
            <p className="mt-5 text-pretty text-lg text-neutral-600">{solucao.resumo}</p>
          )}

          {solucao.descricao && (
            <div className="prose prose-neutral mt-4 max-w-none prose-p:text-neutral-600">
              <RichText data={solucao.descricao} />
            </div>
          )}

          {entregaveis.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                O que está incluso
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {entregaveis.map((entregavel) => (
                  <li
                    key={entregavel.id ?? entregavel.item}
                    className="flex gap-2.5 text-sm text-neutral-700"
                  >
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-900" />
                    {entregavel.item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {imagem && (
          <div className={invertido ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'}>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={imagem}
                alt={altDaMedia(solucao.imagem) || solucao.titulo}
                fill
                preload={primeiro}
                sizes="(max-width: 1024px) 100vw, 41vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
