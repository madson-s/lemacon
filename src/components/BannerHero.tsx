import Image from 'next/image'
import Link from 'next/link'

import { urlDaMedia } from '@/lib/produtos'
import type { Home } from '@/payload-types'

type Banner = NonNullable<Home['bannersHero']>[number]

/**
 * Banners sobre a foto do topo. Mesmo modelo das faixas entre as seções: a arte
 * é um PNG do painel e a página só enquadra e liga. O primeiro item ocupa o
 * cartão grande; os seguintes viram faixas mais baixas abaixo dele.
 */
export function BannerHero({ banners }: { banners: Banner[] }) {
  const comArte = banners.filter((banner) => urlDaMedia(banner.imagem, 'card'))
  if (comArte.length === 0) return null

  return (
    <aside className="hero-promotions" aria-label="Destaques da LM">
      {comArte.map((banner, indice) => {
        const src = urlDaMedia(banner.imagem, 'card') as string
        const destino = banner.link?.trim()
        const classe = `hero-promotion-card${indice === 0 ? ' is-featured' : ''}`

        const arte = (
          <Image
            src={src}
            alt={banner.alt}
            fill
            sizes="(max-width: 1100px) 42vw, 510px"
            priority={indice === 0}
          />
        )

        return destino ? (
          <Link key={banner.id ?? src} href={destino} className={classe}>
            {arte}
          </Link>
        ) : (
          <div key={banner.id ?? src} className={classe}>
            {arte}
          </div>
        )
      })}
    </aside>
  )
}
