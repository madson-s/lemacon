import Link from 'next/link'

import { BrandLogo } from './BrandLogo'

const footerGroups = [
  { title: 'Unidades', links: ['Esquadrias de alumínio', 'Vidros temperados', 'Tec Construção'] },
  { title: 'Catálogo', links: ['Portas & janelas', 'Fachadas de vidro', 'Box & guarda-corpo', 'Espelhos & coberturas'] },
  { title: 'Contato', links: ['WhatsApp', 'Chapada Diamantina — BA'] },
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
              {group.links.map((label) => (
                <li key={label}>
                  <Link href={label === 'WhatsApp' ? '/#orcamento' : '/catalogo'}>{label}</Link>
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
