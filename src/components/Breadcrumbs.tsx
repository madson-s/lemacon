import Link from 'next/link'

export type Crumb = { label: string; href?: string }

/**
 * Trilha hierárquica: diz onde a página está no site, e não de onde o visitante
 * veio. É o que dispensa carregar o caminho de volta na URL (`?voltar=`), que
 * sujava o endereço e mudava conforme a origem do clique.
 */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <nav className={`breadcrumbs ${className}`.trim()} aria-label="Você está aqui">
      <ol>
        {items.map((item, index) => {
          const ultimo = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !ultimo ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={ultimo ? 'page' : undefined}>{item.label}</span>
              )}
              {!ultimo && (
                <i aria-hidden className="breadcrumbs__sep">
                  /
                </i>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
