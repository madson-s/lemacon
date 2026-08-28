import Link from 'next/link'

import { BrandLogo } from './BrandLogo'

const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Unidades',
    links: [
      { label: 'Esquadrias de alumínio', href: '/catalogo' },
      { label: 'Vidros temperados', href: '/catalogo' },
      { label: 'Tec Construção', href: '/catalogo' },
    ],
  },
  {
    title: 'Catálogo',
    links: [
      { label: 'Portas & janelas', href: '/catalogo?q=porta%20janela' },
      { label: 'Fachadas de vidro', href: '/catalogo?q=fachada' },
      { label: 'Box & guarda-corpo', href: '/catalogo?q=box%20guarda-corpo' },
      { label: 'Espelhos & coberturas', href: '/catalogo?q=espelho%20cobertura' },
    ],
  },
  {
    title: 'A LM',
    links: [
      { label: 'Sobre a LM', href: '/sobre' },
      { label: 'Onde estamos', href: '/localizacao' },
      { label: 'Solicitar orçamento', href: '/#orcamento' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="lm-container site-footer__grid">
        <div className="site-footer__brand">
          <BrandLogo />
          <p>Projeto, fabricação e instalação sob medida. Atendemos toda a Chapada Diamantina.</p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title} className="site-footer__group">
            <p className="site-footer__eyebrow">{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="lm-container site-footer__bottom">
        <span><i aria-hidden /> Fotos reais de obra executada pela LM · acervo próprio</span>
        <span>© LM Esquadrias · Vidros · Construção</span>
      </div>
    </footer>
  )
}
