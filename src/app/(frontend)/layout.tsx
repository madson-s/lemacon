import './globals.css'

import { Instrument_Serif, Space_Grotesk } from 'next/font/google'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import { Header } from '@/components/Header'
import { SiteFooter } from '@/components/SiteFooter'
import type { CategoriaItem } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: {
    default: 'LM · Design moderno para ambientes reais',
    template: '%s · LM',
  },
  description:
    'Esquadrias de alumínio, vidros e construção sob medida na Chapada Diamantina.',
}

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

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
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
        {/* Suspense porque o Header lê searchParams; sem isso o Next reclama nas rotas estáticas. */}
        <Suspense fallback={<div className="h-14.25 border-b border-neutral-200" />}>
          <Header categorias={categorias} />
        </Suspense>

        <main className="flex-1">{children}</main>

        <SiteFooter />
      </body>
    </html>
  )
}
