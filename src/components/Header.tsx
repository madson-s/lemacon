'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

import type { CategoriaItem } from '@/lib/produtos'

export function Header({ categorias }: { categorias: CategoriaItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const termoNaUrl = searchParams.get('q') ?? ''
  const categoriaNaUrl = searchParams.get('categoria')
  const [termo, setTermo] = useState(termoNaUrl)
  const [ultimoTermoDaUrl, setUltimoTermoDaUrl] = useState(termoNaUrl)

  // Voltar/avançar do navegador ou clique num link de categoria mudam a URL: o
  // campo precisa acompanhar, senão fica mostrando a busca antiga. Ajustar durante
  // o render (e não num effect) evita o render extra com o valor defasado.
  if (termoNaUrl !== ultimoTermoDaUrl) {
    setUltimoTermoDaUrl(termoNaUrl)
    setTermo(termoNaUrl)
  }

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    const busca = termo.trim()
    router.push(busca ? `/catalogo?q=${encodeURIComponent(busca)}` : '/catalogo')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LM
        </Link>

        <form onSubmit={buscar} role="search" className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <input
            type="search"
            name="q"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar produtos…"
            aria-label="Buscar produtos"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-900"
          />
        </form>

        <nav
          aria-label="Categorias"
          className="order-2 -mx-4 flex max-w-full gap-4 overflow-x-auto px-4 text-sm sm:order-3 sm:mx-0 sm:px-0"
        >
          <LinkDeCategoria href="/catalogo" ativo={pathname === '/catalogo' && !categoriaNaUrl}>
            Todos
          </LinkDeCategoria>
          {categorias.map((categoria) => (
            <LinkDeCategoria
              key={categoria.id}
              href={`/catalogo?categoria=${categoria.id}`}
              ativo={categoriaNaUrl === categoria.id}
            >
              {categoria.nome}
            </LinkDeCategoria>
          ))}
          <span aria-hidden className="w-px shrink-0 self-stretch bg-neutral-200" />
          <LinkDeCategoria href="/solucoes" ativo={pathname === '/solucoes'}>
            Soluções
          </LinkDeCategoria>
          <LinkDeCategoria href="/trabalhos" ativo={pathname === '/trabalhos'}>
            Trabalhos
          </LinkDeCategoria>
        </nav>
      </div>
    </header>
  )
}

function LinkDeCategoria({
  href,
  ativo,
  children,
}: {
  href: string
  ativo: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={
        ativo
          ? 'whitespace-nowrap border-b-2 border-neutral-900 pb-0.5 font-medium text-neutral-900'
          : 'whitespace-nowrap border-b-2 border-transparent pb-0.5 text-neutral-500 hover:text-neutral-900'
      }
    >
      {children}
    </Link>
  )
}
