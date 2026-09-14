import Image from 'next/image'
import Link from 'next/link'

import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import { urlDaMedia } from '@/lib/produtos'
import type { Home } from '@/payload-types'

type Banner = NonNullable<Home['bannersHero']>[number]

/**
 * Banners sobre a foto do topo. Mesmo modelo das faixas entre as seções: a arte
 * é um PNG do painel e a página só enquadra e liga. No desktop o primeiro item
 * ocupa o cartão grande e os seguintes viram faixas mais baixas abaixo dele; no
 * celular e no tablet em retrato, viram um slideshow com bolinhas.
 */
export function BannerHero({ banners }: { banners: Banner[] }) {
  const comArte = banners.filter((banner) => urlDaMedia(banner.imagem, 'card'))
  if (comArte.length === 0) return null

  return (
    <HorizontalCarousel trackClassName="hero-promotions" label="Destaques da LM">
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
    </HorizontalCarousel>
  )
}
