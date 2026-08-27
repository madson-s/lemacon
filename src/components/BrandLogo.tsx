import Image from 'next/image'
import Link from 'next/link'

export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`brand-logo ${className}`} aria-label="LM Esquadrias de Alumínio — início">
      <span className="brand-logo__art" aria-hidden>
        <Image src="/images/home/logo-word.svg" alt="" width={36} height={30} priority />
        <span className="brand-logo__type">
          <Image src="/images/home/logo-subtitle.svg" alt="" width={123} height={12} priority />
          <Image src="/images/home/logo-mark.svg" alt="" width={75} height={8} priority />
        </span>
      </span>
    </Link>
  )
}
