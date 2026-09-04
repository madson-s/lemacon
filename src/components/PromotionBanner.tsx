import Image from 'next/image'
import Link from 'next/link'

type PromotionBannerProps = {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  cta: string
  align?: 'left' | 'right'
}

export function PromotionBanner({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  href,
  cta,
  align = 'left',
}: PromotionBannerProps) {
  return (
    <article className={`promotion-banner promotion-banner--${align}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(max-width: 800px) calc(100vw - 40px), 1216px"
        className="promotion-banner__image"
      />
      <div className="promotion-banner__shade" aria-hidden />
      <div className="promotion-banner__content">
        <p className="eyebrow">
          <i aria-hidden />
          {eyebrow}
        </p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href={href} className="button button--cream promotion-banner__cta">
          {cta}
          <span aria-hidden className="arrow">→</span>
        </Link>
      </div>
    </article>
  )
}
