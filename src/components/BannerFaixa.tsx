import Image from 'next/image'
import Link from 'next/link'

import { urlDaMedia } from '@/lib/produtos'
import type { Home } from '@/payload-types'

type Banner = NonNullable<Home['bannersFaixa1']>[number]

/**
 * Faixa de banners da home: dois por linha na largura máxima, um por linha no
 * mobile. A arte é um PNG cadastrado no painel — a página só enquadra e liga.
 */
export function BannerFaixa({ banners, rotulo }: { banners: Banner[]; rotulo: string }) {
  const comArte = banners.filter((banner) => urlDaMedia(banner.imagem, 'card'))
  if (comArte.length === 0) return null

  return (
    <section className="promotion-section" aria-label={rotulo}>
      <div className="lm-container promotion-grid">
        {comArte.map((banner) => {
          const src = urlDaMedia(banner.imagem, 'card') as string
          const destino = banner.link?.trim()

          const arte = (
            <Image
              src={src}
              alt={banner.alt}
              fill
              sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1264px) 46vw, 592px"
              className="promotion-card__image"
            />
          )

          return destino ? (
            <Link key={banner.id ?? src} href={destino} className="promotion-card">
              {arte}
            </Link>
          ) : (
            <div key={banner.id ?? src} className="promotion-card">
              {arte}
            </div>
          )
        })}
      </div>
    </section>
  )
}
