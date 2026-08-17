import './globals.css'

import Link from 'next/link'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import { Header } from '@/components/Header'
import type { CategoriaItem } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: {
    default: 'LM · Design moderno para ambientes reais',
    template: '%s · LM',
  },
  description:
    'Móveis, iluminação e decoração de linhas modernas, escolhidos para valorizar o ambiente. Veja o catálogo e os trabalhos executados pela LM.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'categorias',
    depth: 0,
    limit: 200,
    pagination: false,
    sort: 'ordem',
  })

  const categorias: CategoriaItem[] = docs.map((c) => ({
    id: String(c.id),
    nome: c.nome,
    slug: c.slug ?? null,
  }))

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
        {/* Suspense porque o Header lê searchParams; sem isso o Next reclama nas rotas estáticas. */}
        <Suspense fallback={<div className="h-14.25 border-b border-neutral-200" />}>
          <Header categorias={categorias} />
        </Suspense>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-200">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500">
            <span>
              <span className="font-semibold text-neutral-900">LM</span> — design moderno para
              ambientes reais
            </span>
            <nav className="flex flex-wrap gap-5">
              <Link href="/catalogo" className="hover:text-neutral-900">
                Catálogo
              </Link>
              <Link href="/solucoes" className="hover:text-neutral-900">
                Soluções
              </Link>
              <Link href="/trabalhos" className="hover:text-neutral-900">
                Trabalhos
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
