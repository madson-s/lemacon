'use client'

import Fuse from 'fuse.js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import {
  catalogCategories,
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
  initialTerm = '',
  initialUnit = 'Todas',
  initialCategory = 'Todas',
  initialService = '',
}: {
  products: CatalogProduct[]
  initialTerm?: string
  initialUnit?: CatalogUnit
  initialCategory?: CatalogCategory
  initialService?: string
}) {
  const router = useRouter()
  const [term, setTerm] = useState(initialTerm)
  const [unit, setUnit] = useState<CatalogUnit>(initialUnit)
  const [category, setCategory] = useState<CatalogCategory>(initialCategory)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeService, setActiveService] = useState<CatalogProduct | null>(() => products.find((item) => item.slug === initialService) ?? null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const filterSheetRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filterCloseRef = useRef<HTMLButtonElement>(null)
  const detailMobileCloseRef = useRef<HTMLButtonElement>(null)
  const detailCloseRef = useRef<HTMLButtonElement>(null)
  const openedFromCatalogRef = useRef(false)
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products])

  const results = useMemo(() => {
    const query = term.trim()
    const searched = query.length >= 2 ? fuse.search(query).map((entry) => entry.item) : products

    return searched.filter((item) => {
      const matchesUnit = unit === 'Todas' || item.unit === unit
      const matchesCategory = category === 'Todas' || item.category === category
      return matchesUnit && matchesCategory
    })
  }, [category, fuse, products, term, unit])

  const detailImages = useMemo(() => {
    if (!activeService) return []
    const contextual = products.filter((item) => item.slug !== activeService.slug && (item.category === activeService.category || item.unit === activeService.unit))
    return [activeService, ...contextual].slice(0, 3)
  }, [activeService, products])

  const normalizedTerm = term.trim()
  const activeFilterTags = [
    ...(normalizedTerm.length >= 2 ? [`Busca: “${normalizedTerm}”`] : []),
    ...(unit !== 'Todas' ? [unit] : []),
    ...(category !== 'Todas' ? [category] : []),
  ]
  const hasActiveFilters = activeFilterTags.length > 0

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

  const openDetail = (item: CatalogProduct) => {
    openedFromCatalogRef.current = true
    setActiveService(item)
    setGalleryIndex(0)
    const url = new URL(window.location.href)
    url.searchParams.set('servico', item.slug)
    router.push(`${url.pathname}${url.search}`, { scroll: false })
  }

  const closeDetail = () => {
    setActiveService(null)
    setGalleryIndex(0)
    if (openedFromCatalogRef.current) {
      openedFromCatalogRef.current = false
      router.back()
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.delete('servico')
    router.replace(`${url.pathname}${url.search}`, { scroll: false })
  }

  useEffect(() => {
    const syncDetailWithUrl = () => {
      const slug = new URL(window.location.href).searchParams.get('servico')
      setActiveService(products.find((item) => item.slug === slug) ?? null)
      setGalleryIndex(0)
    }

    window.addEventListener('popstate', syncDetailWithUrl)
    return () => window.removeEventListener('popstate', syncDetailWithUrl)
  }, [products])

  useEffect(() => {
    filterSheetRef.current?.toggleAttribute('inert', !filtersOpen)
    detailRef.current?.toggleAttribute('inert', !activeService)
    if (!filtersOpen && !activeService) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (filtersOpen) closeFilters()
        else if (activeService) closeDetail()
        return
      }

      if (event.key !== 'Tab') return
      const activeRoot = filtersOpen ? filterSheetRef.current : detailRef.current
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
    if (filtersOpen) filterCloseRef.current?.focus()
    if (activeService) {
      const mobile = window.matchMedia('(max-width: 800px)').matches
      ;(mobile ? detailMobileCloseRef : detailCloseRef).current?.focus()
    }

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  // The callbacks intentionally close the state captured by this effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeService, filtersOpen])

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
              {catalogCategories.map((candidate) => (
                <FilterButton key={candidate} active={category === candidate} count={countForCategory(candidate)} onClick={() => setCategory(candidate)}>
                  {candidate === 'Todas' ? 'Todas as categorias' : candidate}
                </FilterButton>
              ))}
            </FilterGroup>
          </aside>

          <div className="catalog-page__results">
            <div className="catalog-page__results-head">
              <h2 id="catalog-results-title">Catálogo completo</h2>
              <span aria-live="polite">{labelCount(results.length)}</span>
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
              <ul className="catalog-page__grid">
                {results.map((item) => <CatalogCard item={item} onOpen={() => openDetail(item)} key={item.id} />)}
              </ul>
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
              {catalogUnits.map((candidate) => <button type="button" className={unit === candidate ? 'is-active' : ''} aria-pressed={unit === candidate} onClick={() => setUnit(candidate)} key={candidate}>{candidate}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend><i aria-hidden />Categoria</legend>
            <div className="mobile-filter-sheet__chips">
              {catalogCategories.map((candidate) => <button type="button" className={category === candidate ? 'is-active' : ''} aria-pressed={category === candidate} onClick={() => setCategory(candidate)} key={candidate}>{candidate}</button>)}
            </div>
          </fieldset>
          <div className="mobile-filter-sheet__actions">
            <button type="button" className="button mobile-filter-sheet__clear" disabled={!hasActiveFilters} onClick={clearFilters}>Redefinir</button>
            <button type="button" className="button button--dark" onClick={closeFilters}>Ver {labelCount(results.length)}</button>
          </div>
        </div>
      </div>

      <div ref={detailRef} className={`service-detail ${activeService ? 'is-open' : ''}`} aria-hidden={!activeService}>
        <button type="button" className="service-detail__backdrop" aria-label="Voltar ao catálogo" onClick={closeDetail} />
        {activeService && (
          <article className="service-detail__panel" role="dialog" aria-modal="true" aria-labelledby="service-detail-title">
            <header className="service-detail__mobile-header">
              <button ref={detailMobileCloseRef} type="button" onClick={closeDetail} aria-label="Voltar ao catálogo"><span aria-hidden>←</span> Catálogo</button>
              <span>{activeService.category}</span>
            </header>
            <button ref={detailCloseRef} className="service-detail__close" type="button" onClick={closeDetail} aria-label="Fechar detalhes"><span aria-hidden>×</span></button>

            <div className="service-detail__media">
              <div className="service-detail__main-image">
                <Image src={detailImages[galleryIndex]?.image ?? activeService.image} alt={detailImages[galleryIndex]?.imageAlt ?? activeService.imageAlt} fill sizes="(max-width: 800px) 100vw, 54vw" />
              </div>
              {detailImages.length > 1 && (
                <div className="service-detail__thumbs" aria-label="Imagens relacionadas">
                  {detailImages.map((image, index) => (
                    <button type="button" className={galleryIndex === index ? 'is-active' : ''} onClick={() => setGalleryIndex(index)} aria-label={`Ver imagem ${index + 1}`} aria-pressed={galleryIndex === index} key={image.slug}>
                      <Image src={image.image} alt="" fill sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="service-detail__content">
              <p className="eyebrow"><i aria-hidden />{activeService.unit} · {activeService.category}</p>
              <h2 id="service-detail-title">{activeService.name}</h2>
              <p className="service-detail__lead">{activeService.description}</p>
              <div className="service-detail__tags">{activeService.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

              <div className="service-detail__scope">
                <h3>Do projeto à instalação</h3>
                <ul>
                  <li><span>01</span><p><strong>Medição precisa</strong>Levantamento no local e definição técnica para o seu ambiente.</p></li>
                  <li><span>02</span><p><strong>Fabricação sob medida</strong>Produção pela equipe LM com materiais e acabamento especificados.</p></li>
                  <li><span>03</span><p><strong>Instalação completa</strong>Montagem, regulagem e conferência final antes da entrega.</p></li>
                </ul>
              </div>

              <a
                href="#orcamento"
                className="button button--gold"
                onClick={(event) => {
                  event.preventDefault()
                  setActiveService(null)
                  setGalleryIndex(0)
                  openedFromCatalogRef.current = false
                  router.push('/catalogo#orcamento')
                }}
              >Solicitar orçamento <span aria-hidden>→</span></a>
              <small>Atendimento em toda a Chapada Diamantina.</small>
            </div>
          </article>
        )}
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
  return <button type="button" className={active ? 'is-active' : ''} aria-pressed={active} onClick={onClick}><span>{children}</span><small>{count}</small></button>
}

function CatalogCard({ item, onOpen }: { item: CatalogProduct; onOpen: () => void }) {
  return (
    <li>
      <button type="button" className="catalog-product-card" onClick={onOpen} aria-label={`Conhecer ${item.name}`}>
        <div className="catalog-product-card__image">
          <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1200px) 33vw, 276px" />
          <span>{item.unit} · {item.category}</span>
        </div>
        <div className="catalog-product-card__body">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="catalog-product-card__tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="catalog-product-card__footer"><small>Sob orçamento</small><strong>Ver detalhes <span aria-hidden>→</span></strong></div>
        </div>
      </button>
    </li>
  )
}
