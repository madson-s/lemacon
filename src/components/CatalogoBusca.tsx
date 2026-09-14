'use client'

import Fuse from 'fuse.js'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import {
  catalogUnits,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogUnit,
} from '@/lib/catalogo-design'

const fuseOptions = {
  threshold: 0.32,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.42 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.15 },
    { name: 'unit', weight: 0.08 },
    { name: 'description', weight: 0.15 },
  ],
}

const searchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  </svg>
)

const filtersIcon = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)

function labelCount(count: number) {
  return `${count} ${count === 1 ? 'item' : 'itens'}`
}

export function CatalogoBusca({
  products,
  categorias,
  initialTerm = '',
  initialUnit = 'Todas',
  initialCategory = 'Todas',
  initialPage = 1,
}: {
  products: CatalogProduct[]
  categorias: CatalogCategory[]
  initialTerm?: string
  initialUnit?: CatalogUnit
  initialCategory?: CatalogCategory
  initialPage?: number
}) {
  const [term, setTerm] = useState(initialTerm)
  const [unit, setUnit] = useState<CatalogUnit>(initialUnit)
  const [category, setCategory] = useState<CatalogCategory>(initialCategory)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterSheetRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filterCloseRef = useRef<HTMLButtonElement>(null)
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products])

  const results = useMemo(() => {
    const query = term.trim()
    const buscando = query.length >= 2
    const searched = buscando ? fuse.search(query).map((entry) => entry.item) : products

    const filtrados = searched.filter((item) => {
      const matchesUnit = unit === 'Todas' || item.unit === unit
      const matchesCategory = category === 'Todas' || item.category === category
      return matchesUnit && matchesCategory
    })

    // Durante a busca a ordem é a relevância do Fuse: reordenar por promoção
    // colocaria itens pouco parecidos à frente do que a pessoa procurou.
    if (buscando) return filtrados

    // Promoções primeiro, e dentro de cada grupo em ordem alfabética.
    return [...filtrados].sort(
      (a, b) =>
        Number(b.promocao) - Number(a.promocao) || a.name.localeCompare(b.name, 'pt-BR'),
    )
  }, [category, fuse, products, term, unit])

  // Paginação pela URL: `?pagina=2` é a fonte da verdade, então o estado
  // sobrevive a recarregar, compartilhar o link e ao voltar do navegador.
  const POR_PAGINA = 12
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPaginas = Math.max(1, Math.ceil(results.length / POR_PAGINA))

  // Na primeira renderização o servidor já leu o parâmetro; depois quem manda é
  // a URL do cliente, que muda sem recarregar a página.
  const daUrl = Number.parseInt(searchParams.get('pagina') ?? '', 10)
  const pedida = Number.isNaN(daUrl) ? initialPage : daUrl
  // Filtrar pode encurtar a lista e deixar a página pedida fora do intervalo.
  const paginaAtual = Math.min(Math.max(1, pedida), totalPaginas)

  const inicio = (paginaAtual - 1) * POR_PAGINA
  const mostrados = results.slice(inicio, inicio + POR_PAGINA)

  const escreverNaUrl = (mudancas: Record<string, string | null>, opcoes?: { replace?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor === null || valor === '') params.delete(chave)
      else params.set(chave, valor)
    }
    const query = params.toString()
    const destino = query ? `${pathname}?${query}` : pathname
    // `scroll: false` porque a rolagem é tratada aqui, até o topo da lista.
    if (opcoes?.replace) router.replace(destino, { scroll: false })
    else router.push(destino, { scroll: false })
  }

  const irParaPagina = (destino: number) => {
    const alvo = Math.max(1, Math.min(destino, totalPaginas))
    // Página 1 não entra na URL: o endereço limpo é o estado padrão.
    escreverNaUrl({ pagina: alvo === 1 ? null : String(alvo) })
    document.querySelector<HTMLElement>('.catalog-page__results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Mudar de filtro ou buscar invalida a página atual: volta para a primeira,
  // com `replace` para não encher o histórico a cada tecla digitada. O ref evita
  // guardar isso em estado, que dispararia render em cascata dentro do efeito.
  const chaveFiltros = `${term}|${unit}|${category}`
  const chaveAnteriorRef = useRef(chaveFiltros)
  useEffect(() => {
    if (chaveAnteriorRef.current === chaveFiltros) return
    chaveAnteriorRef.current = chaveFiltros
    if (searchParams.get('pagina')) escreverNaUrl({ pagina: null }, { replace: true })
  })

  const normalizedTerm = term.trim()
  const activeFilterTags = [
    ...(normalizedTerm.length >= 2 ? [`Busca: “${normalizedTerm}”`] : []),
    ...(unit !== 'Todas' ? [unit] : []),
    ...(category !== 'Todas' ? [category] : []),
  ]
  const hasActiveFilters = activeFilterTags.length > 0

  const listaCategorias: CatalogCategory[] = ['Todas', ...categorias]

  const countForUnit = (candidate: CatalogUnit) => candidate === 'Todas' ? products.length : products.filter((item) => item.unit === candidate).length
  const countForCategory = (candidate: CatalogCategory) => candidate === 'Todas' ? products.length : products.filter((item) => item.category === candidate).length

  const openFilters = () => setFiltersOpen(true)
  const closeFilters = () => {
    setFiltersOpen(false)
    window.setTimeout(() => filterButtonRef.current?.focus(), 0)
  }

  const clearFilters = () => {
    setTerm('')
    setUnit('Todas')
    setCategory('Todas')
  }

  useEffect(() => {
    filterSheetRef.current?.toggleAttribute('inert', !filtersOpen)
    if (!filtersOpen) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFilters()
        return
      }

      if (event.key !== 'Tab') return
      const activeRoot = filterSheetRef.current
      const focusable = Array.from(
        activeRoot?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    filterCloseRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [filtersOpen])

  const submitMobileSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    document.querySelector<HTMLElement>('.catalog-page__results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="catalog-page__catalog" aria-labelledby="catalog-results-title">
        <div className="lm-container catalog-page__layout">
          <aside className="catalog-sidebar" aria-label="Filtros do catálogo">
            <label className="catalog-search">
              {searchIcon}
              <span className="sr-only">Buscar no catálogo</span>
              <input type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Buscar no catálogo" />
            </label>

            <FilterState tags={activeFilterTags} hasActiveFilters={hasActiveFilters} onReset={clearFilters} />

            <FilterGroup title="Unidades">
              {catalogUnits.map((candidate) => (
                <FilterButton key={candidate} active={unit === candidate} count={countForUnit(candidate)} onClick={() => setUnit(candidate)}>
                  {candidate === 'Todas' ? 'Todas as unidades' : candidate}
                </FilterButton>
              ))}
            </FilterGroup>

            <FilterGroup title="Categorias">
              {listaCategorias.map((candidate) => (
                <FilterButton key={candidate} active={category === candidate} count={countForCategory(candidate)} onClick={() => setCategory(candidate)}>
                  {candidate === 'Todas' ? 'Todas as categorias' : candidate}
                </FilterButton>
              ))}
            </FilterGroup>
          </aside>

          <div className="catalog-page__results">
            <div className="catalog-page__results-head">
              <h2 id="catalog-results-title">Catálogo completo</h2>
              <span aria-live="polite">
                {labelCount(results.length)}
              </span>
            </div>

            <div className="catalog-page__mobile-tools">
              <form role="search" className="catalog-page__mobile-search" onSubmit={submitMobileSearch}>
                <button type="submit" aria-label="Pesquisar no catálogo">{searchIcon}</button>
                <input type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Buscar no catálogo" aria-label="Buscar no catálogo" />
              </form>
              <button ref={filterButtonRef} type="button" className="catalog-page__filter-trigger" aria-label="Abrir filtros do catálogo" aria-expanded={filtersOpen} onClick={openFilters}>{filtersIcon}</button>
            </div>

            <div className="catalog-page__active-filters" aria-live="polite">
              <div>
                <small>Filtros ativos</small>
                <div className="catalog-filter-tags">
                  {(hasActiveFilters ? activeFilterTags : ['Todos os itens']).map((tag) => <span className={!hasActiveFilters ? 'is-default' : ''} key={tag}>{tag}</span>)}
                </div>
              </div>
              <button type="button" disabled={!hasActiveFilters} onClick={clearFilters}>Redefinir filtros</button>
            </div>

            {results.length > 0 ? (
              <>
                <ul className="catalog-page__grid">
                  {mostrados.map((item) => <CatalogCard item={item} key={item.id} />)}
                </ul>

                {totalPaginas > 1 && (
                  <nav className="catalog-pagination" aria-label="Paginação do catálogo">
                    <button
                      type="button"
                      className="catalog-pagination__seta"
                      onClick={() => irParaPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                      aria-label="Página anterior"
                    >
                      <span aria-hidden>←</span>
                    </button>

                    <ol className="catalog-pagination__paginas">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                        <li key={n}>
                          <button
                            type="button"
                            onClick={() => irParaPagina(n)}
                            aria-label={`Página ${n} de ${totalPaginas}`}
                            aria-current={n === paginaAtual ? 'page' : undefined}
                            className={n === paginaAtual ? 'is-active' : undefined}
                          >
                            {n}
                          </button>
                        </li>
                      ))}
                    </ol>

                    <button
                      type="button"
                      className="catalog-pagination__seta"
                      onClick={() => irParaPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                      aria-label="Próxima página"
                    >
                      <span aria-hidden>→</span>
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="catalog-page__empty">
                <p>Nenhum serviço encontrado com esses filtros.</p>
                <button type="button" className="button button--dark" onClick={clearFilters}>Limpar filtros</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div ref={filterSheetRef} className={`mobile-filter-sheet catalog-filter-sheet ${filtersOpen ? 'is-open' : ''}`} aria-hidden={!filtersOpen}>
        <button type="button" className="mobile-filter-sheet__backdrop" aria-label="Fechar filtros" onClick={closeFilters} />
        <div className="mobile-filter-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="catalog-filter-title">
          <div className="mobile-filter-sheet__handle" aria-hidden />
          <div className="mobile-filter-sheet__header">
            <h3 id="catalog-filter-title">Filtrar catálogo</h3>
            <button ref={filterCloseRef} type="button" onClick={closeFilters} aria-label="Fechar filtros">×</button>
          </div>
          <fieldset>
            <legend><i aria-hidden />Unidade</legend>
            <div className="mobile-filter-sheet__chips">
              {catalogUnits.map((candidate) => {
                const total = countForUnit(candidate)
                return (
                  <button
                    type="button"
                    className={unit === candidate ? 'is-active' : ''}
                    aria-pressed={unit === candidate}
                    disabled={total === 0 && unit !== candidate}
                    onClick={() => setUnit(candidate)}
                    key={candidate}
                  >
                    {candidate}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend><i aria-hidden />Categoria</legend>
            <div className="mobile-filter-sheet__chips">
              {listaCategorias.map((candidate) => {
                const total = countForCategory(candidate)
                return (
                  <button
                    type="button"
                    className={category === candidate ? 'is-active' : ''}
                    aria-pressed={category === candidate}
                    disabled={total === 0 && category !== candidate}
                    onClick={() => setCategory(candidate)}
                    key={candidate}
                  >
                    {candidate}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <div className="mobile-filter-sheet__actions">
            <button type="button" className="button mobile-filter-sheet__clear" disabled={!hasActiveFilters} onClick={clearFilters}>Redefinir</button>
            <button type="button" className="button button--dark" onClick={closeFilters}>Ver {labelCount(results.length)}</button>
          </div>
        </div>
      </div>
    </>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="catalog-sidebar__group"><legend>{title}</legend><div>{children}</div></fieldset>
}

function FilterState({ tags, hasActiveFilters, onReset }: { tags: string[]; hasActiveFilters: boolean; onReset: () => void }) {
  return (
    <div className="catalog-filter-state" aria-live="polite">
      <small>Filtros ativos</small>
      <div className="catalog-filter-tags">
        {(hasActiveFilters ? tags : ['Todos os itens']).map((tag) => <span className={!hasActiveFilters ? 'is-default' : ''} key={tag}>{tag}</span>)}
      </div>
      <button type="button" disabled={!hasActiveFilters} onClick={onReset}><span aria-hidden>↺</span> Redefinir filtros</button>
    </div>
  )
}

function FilterButton({ active, count, onClick, children }: { active: boolean; count: number; onClick: () => void; children: ReactNode }) {
  // Filtro sem nenhum item não leva a lugar nenhum: fica desabilitado em vez de
  // levar o visitante a uma lista vazia.
  const vazio = count === 0
  return (
    <button
      type="button"
      className={active ? 'is-active' : ''}
      aria-pressed={active}
      onClick={onClick}
      disabled={vazio && !active}
      title={vazio ? 'Nenhum item nesta seleção' : undefined}
    >
      <span>{children}</span>
      <small>{count}</small>
    </button>
  )
}

function CatalogCard({ item }: { item: CatalogProduct }) {
  return (
    <li>
      <Link
        href={`/catalogo/${item.slug}`}
        className="catalog-product-card"
        aria-label={`Conhecer ${item.name}`}
      >
        <div className="catalog-product-card__image">
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1200px) 33vw, 276px" />
          <span>{item.unit} · {item.category}</span>
          {item.promocao && <em className="catalog-product-card__promo">Promoção</em>}
        </div>
        <div className="catalog-product-card__body">
          <h3>{item.name}</h3>
          <div className="catalog-product-card__tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="catalog-product-card__footer"><small>Sob orçamento</small><strong>Ver detalhes <span aria-hidden>→</span></strong></div>
        </div>
      </Link>
    </li>
  )
}
