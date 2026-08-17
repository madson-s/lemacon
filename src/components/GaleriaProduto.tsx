'use client'

import Image from 'next/image'
import React, { useState } from 'react'

export type Foto = {
  url: string
  alt: string
}

export function GaleriaProduto({ fotos, nome }: { fotos: Foto[]; nome: string }) {
  const [atual, setAtual] = useState(0)

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">
        sem imagem
      </div>
    )
  }

  const foto = fotos[Math.min(atual, fotos.length - 1)]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={foto.url}
          alt={foto.alt || nome}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {fotos.length > 1 && (
        <ul className="grid grid-cols-5 gap-3">
          {fotos.map((f, i) => (
            <li key={f.url}>
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === atual}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 ${
                  i === atual
                    ? 'ring-2 ring-neutral-900 ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={f.url}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 20vw, 10vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
