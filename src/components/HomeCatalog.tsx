'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

const filters = ['Todos', 'Esquadrias', 'Vidros', 'Construção'] as const

type CatalogFilter = (typeof filters)[number]

const mobileCategories = ['Todas', 'Portas', 'Janelas', 'Fachadas', 'Coberturas'] as const
type MobileCategory = (typeof mobileCategories)[number]

export type HomeProduct = {
  unit: Exclude<CatalogFilter, 'Todos'>
  category: string
  title: string
  description: string
  tags: string[]
  image: string
}

function Arrow() {
  return <span aria-hidden className="arrow">→</span>
}

export function HomeCatalog({ products }: { products: HomeProduct[] }) {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mobileUnit, setMobileUnit] = useState<CatalogFilter>('Todos')
  const [mobileCategory, setMobileCategory] = useState<MobileCategory>('Todas')
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const visibleProducts = activeFilter === 'Todos'
    ? products
    : products.filter((product) => product.unit === activeFilter)
  const countLabel = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'item' : 'itens'} no catálogo`
  const mobileResultCount = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR')

    return products.filter((product) => {
      const matchesUnit = mobileUnit === 'Todos' || product.unit === mobileUnit
      const matchesCategory = mobileCategory === 'Todas' || product.category.includes(mobileCategory)
      const searchableText = [product.title, product.description, product.category, ...product.tags].join(' ').toLocaleLowerCase('pt-BR')
      const matchesSearch = normalizedSearch.length === 0 || searchableText.includes(normalizedSearch)
      return matchesUnit && matchesCategory && matchesSearch
    }).length
  }, [mobileCategory, mobileUnit, products, searchTerm])

  useEffect(() => {
    const sheet = sheetRef.current
    sheet?.toggleAttribute('inert', !sheetOpen)
    if (!sheetOpen) return

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [sheetOpen])

  const closeSheet = () => {
    setSheetOpen(false)
    window.setTimeout(() => filterButtonRef.current?.focus(), 0)
  }

  const goToCatalog = () => {
    const terms = [
      searchTerm.trim(),
      mobileUnit === 'Todos' ? '' : mobileUnit,
      mobileCategory === 'Todas' ? '' : mobileCategory,
    ].filter(Boolean)
    const query = terms.join(' ')
    router.push(query ? `/catalogo?q=${encodeURIComponent(query)}` : '/catalogo')
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    goToCatalog()
  }

  const clearMobileFilters = () => {
    setSearchTerm('')
    setMobileUnit('Todos')
    setMobileCategory('Todas')
  }

  return (
    <>
      <div className="catalog-intro">
        <div>
          <p className="eyebrow"><i aria-hidden />Catálogo</p>
          <h2>Produtos e serviços<br />que a LM entrega</h2>
          <p>Um catálogo amplo de esquadrias, vidros e obra — cada peça medida, fabricada e instalada pela nossa equipe. Filtre por unidade de negócio.</p>
        </div>
        <div className="catalog-filters" role="group" aria-label="Filtros do catálogo">
          {filters.map((filter) => (
            <button
              type="button"
              className={activeFilter === filter ? 'is-active' : ''}
              aria-pressed={activeFilter === filter}
              aria-controls="home-product-grid"
              onClick={() => setActiveFilter(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="catalog-mobile-search">
          <form onSubmit={submitSearch} className="catalog-mobile-search__field" role="search">
            <button type="submit" aria-label="Pesquisar no catálogo">
              <svg viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            </button>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                goToCatalog()
              }}
              type="search"
              inputMode="search"
              placeholder="Buscar no catálogo"
              aria-label="Buscar no catálogo"
            />
          </form>
          <button ref={filterButtonRef} type="button" className="catalog-mobile-search__filter" aria-label="Abrir filtros do catálogo" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
          </button>
        </div>
      </div>
      <div className="catalog-meta" aria-live="polite"><span>{countLabel}</span></div>
      <ul className="product-grid" id="home-product-grid">
        {visibleProducts.map((product) => (
          <li key={product.title} className="product-card">
            <Link href="/catalogo" aria-label={`Ver ${product.title}`}>
              <div className="product-card__image">
                <Image src={product.image} alt={product.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 282px" />
                <span>{product.category}</span>
              </div>
              <div className="product-card__body">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-card__tags">{product.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="product-card__footer"><small>Sob orçamento</small><strong>Solicitar <Arrow /></strong></div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="catalog-cta"><Link href="/catalogo" className="button button--gold">Ver catálogo completo <Arrow /></Link></div>
      <div ref={sheetRef} className={`mobile-filter-sheet ${sheetOpen ? 'is-open' : ''}`} aria-hidden={!sheetOpen}>
        <button type="button" className="mobile-filter-sheet__backdrop" aria-label="Fechar filtros" onClick={closeSheet} />
        <div className="mobile-filter-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title">
          <div className="mobile-filter-sheet__handle" aria-hidden />
          <div className="mobile-filter-sheet__header">
            <h3 id="mobile-filter-title">Filtrar catálogo</h3>
            <button ref={closeButtonRef} type="button" onClick={closeSheet} aria-label="Fechar filtros">×</button>
          </div>
          <fieldset>
            <legend><i aria-hidden />Unidade</legend>
            <div className="mobile-filter-sheet__chips">
              {filters.map((filter) => <button type="button" className={mobileUnit === filter ? 'is-active' : ''} aria-pressed={mobileUnit === filter} onClick={() => setMobileUnit(filter)} key={filter}>{filter === 'Todos' ? 'Todas' : filter}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend><i aria-hidden />Categoria</legend>
            <div className="mobile-filter-sheet__chips">
              {mobileCategories.map((category) => <button type="button" className={mobileCategory === category ? 'is-active' : ''} aria-pressed={mobileCategory === category} onClick={() => setMobileCategory(category)} key={category}>{category}</button>)}
            </div>
          </fieldset>
          <div className="mobile-filter-sheet__actions">
            <button type="button" className="button mobile-filter-sheet__clear" onClick={clearMobileFilters}>Limpar</button>
            <button type="button" className="button button--dark" onClick={goToCatalog}>Ver {mobileResultCount} {mobileResultCount === 1 ? 'item' : 'itens'}</button>
          </div>
        </div>
      </div>
    </>
  )
}
