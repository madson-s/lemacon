import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { legendaDoProjeto, type ProjetoItem } from '@/lib/projetos'

/**
 * Prévia dos trabalhos na home. Mostra o resultado antes de pedir o clique —
 * é o argumento do posicionamento, não um banner.
 */
export function SecaoTrabalhos({
  projetos,
  chapeu,
  titulo,
  texto,
  ctaTexto,
}: {
  projetos: ProjetoItem[]
  chapeu?: string | null
  titulo?: string | null
  texto?: string | null
  ctaTexto?: string | null
}) {
  if (projetos.length === 0) return null

  const [principal, ...demais] = projetos

  return (
    <section className="border-t border-neutral-200 bg-neutral-950 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          {chapeu && (
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">{chapeu}</p>
          )}
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {titulo ?? 'Soluções que valorizam o ambiente'}
          </h2>
          {texto && <p className="mt-4 text-pretty text-neutral-300">{texto}</p>}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <FotoDoProjeto projeto={principal} destaque />
          {demais.slice(0, 2).map((projeto) => (
            <FotoDoProjeto key={projeto.id} projeto={projeto} />
          ))}
        </div>

        <Link
          href="/trabalhos"
          className="mt-10 inline-block rounded-lg bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          {ctaTexto ?? 'Ver todos os trabalhos'}
        </Link>
      </div>
    </section>
  )
}

function FotoDoProjeto({ projeto, destaque }: { projeto: ProjetoItem; destaque?: boolean }) {
  const legenda = legendaDoProjeto(projeto)

  return (
    <Link
      href="/trabalhos"
      className={`group relative block overflow-hidden rounded-2xl bg-neutral-800 ${
        destaque ? 'lg:col-span-2 lg:row-span-2 aspect-4/3' : 'aspect-4/3 lg:aspect-3/2'
      }`}
    >
      {projeto.capaUrl && (
        <Image
          src={projeto.capaUrl}
          alt={projeto.capaAlt}
          fill
          sizes={destaque ? '(max-width: 1024px) 100vw, 62vw' : '(max-width: 1024px) 100vw, 31vw'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* O degradê garante contraste da legenda em foto clara ou escura. */}
      <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className={`font-medium ${destaque ? 'text-xl' : 'text-base'}`}>{projeto.titulo}</h3>
        {legenda && <p className="mt-0.5 text-sm text-neutral-300">{legenda}</p>}
      </div>
    </Link>
  )
}
