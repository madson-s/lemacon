'use client'

import Fuse from 'fuse.js'
import React, { useMemo, useState } from 'react'

import { GradeDeProdutos } from '@/components/ProdutoCard'
import type { CategoriaItem, ProdutoItem } from '@/lib/produtos'

type Ordenacao = 'relevancia' | 'nome' | 'menor-preco' | 'maior-preco'

const ORDENACOES: { valor: Ordenacao; rotulo: string }[] = [
  { valor: 'relevancia', rotulo: 'Relevância' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
]

// Tolerante a erro de digitação sem virar bagunça: 0.35 ainda casa "cadeira"/"cadera".
const opcoesFuse = {
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'nome', weight: 0.5 },
    { name: 'tags', weight: 0.2 },
    { name: 'categoriaNome', weight: 0.15 },
    { name: 'descricao', weight: 0.15 },
  ],
}

// Sem preço vai para o fim em qualquer direção — "sob consulta" não é nem barato nem caro.
const porPreco = (direcao: 1 | -1) => (a: ProdutoItem, b: ProdutoItem) => {
  if (a.preco === null) return 1
  if (b.preco === null) return -1
  return (a.preco - b.preco) * direcao
}

export function CatalogoBusca({
  produtos,
  categorias,
  termoInicial = '',
  categoriaInicial = 'todas',
}: {
  produtos: ProdutoItem[]
  categorias: CategoriaItem[]
  termoInicial?: string
  categoriaInicial?: string
}) {
  const [termo, setTermo] = useState(termoInicial)
  const [categoria, setCategoria] = useState(categoriaInicial)
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('relevancia')

  const fuse = useMemo(() => new Fuse(produtos, opcoesFuse), [produtos])

  const resultados = useMemo(() => {
    const busca = termo.trim()
    // Fuse já devolve por relevância; só reordenamos quando o usuário pede outra coisa.
    const encontrados = busca.length >= 2 ? fuse.search(busca).map((r) => r.item) : produtos
    const filtrados =
      categoria === 'todas'
        ? encontrados
        : encontrados.filter((p) => p.categoriaId === categoria)

    if (ordenacao === 'nome') {
      return [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    }
    if (ordenacao === 'menor-preco') return [...filtrados].sort(porPreco(1))
    if (ordenacao === 'maior-preco') return [...filtrados].sort(porPreco(-1))
    return filtrados
  }, [termo, categoria, ordenacao, fuse, produtos])

  const filtrando = termo.trim().length > 0 || categoria !== 'todas'
  const nomeDaCategoria = categorias.find((c) => c.id === categoria)?.nome

  const limpar = () => {
    setTermo('')
    setCategoria('todas')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Todos os produtos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} no catálogo
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por nome, categoria ou descrição…"
            aria-label="Buscar no catálogo"
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-base outline-none placeholder:text-neutral-400 focus:border-neutral-900"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="whitespace-nowrap">Ordenar por</span>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
              className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900"
            >
              {ORDENACOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Chip ativo={categoria === 'todas'} onClick={() => setCategoria('todas')}>
              Todas
            </Chip>
            {categorias.map((c) => (
              <Chip key={c.id} ativo={categoria === c.id} onClick={() => setCategoria(c.id)}>
                {c.nome}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-500">
        <p aria-live="polite">
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
          {nomeDaCategoria && ` em ${nomeDaCategoria}`}
          {termo.trim() && ` para "${termo.trim()}"`}
        </p>
        {filtrando && (
          <button
            type="button"
            onClick={limpar}
            className="underline underline-offset-4 hover:text-neutral-900"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {resultados.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-16 text-center">
          <p className="text-neutral-500">Nenhum produto encontrado.</p>
          {filtrando && (
            <button
              type="button"
              onClick={limpar}
              className="mt-3 text-sm font-medium underline underline-offset-4"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <GradeDeProdutos produtos={resultados} />
      )}
    </div>
  )
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={
        ativo
          ? 'rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-white'
          : 'rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-900'
      }
    >
      {children}
    </button>
  )
}
