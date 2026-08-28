'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { CategoriaItem } from '@/lib/produtos'

import { BrandLogo } from './BrandLogo'

const navigation = [
  { label: 'Categorias', href: '/#categorias' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Linhas', href: '/#grupo-lm' },
  { label: 'Processo', href: '/#processo' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Localização', href: '/localizacao' },
]

export function Header({ categorias: _categorias }: { categorias: CategoriaItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const onHome = pathname === '/'

  return (
    <header className={`site-header ${onHome ? 'site-header--home' : 'site-header--solid'}`}>
      <div className="lm-container site-header__inner">
        <div className="site-header__identity">
          <BrandLogo />
          <span>Esquadrias · Vidros · Construção</span>
        </div>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav id="site-navigation" className={`site-header__nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button button--gold site-header__cta" href="/#orcamento" onClick={() => setOpen(false)}>
            Solicitar orçamento
          </Link>
        </nav>
      </div>
    </header>
  )
}
