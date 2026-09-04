import Image from 'next/image'
import Link from 'next/link'

export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`brand-logo ${className}`} aria-label="LM Tecnologia e Construção — início">
      <span className="brand-logo__art" aria-hidden>
        <Image src="/images/brand/lm-tecnologia-on-dark.svg" alt="" width={187} height={33} priority />
      </span>
    </Link>
  )
}
