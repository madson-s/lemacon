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
      <div className="product-gallery__empty">
        sem imagem
      </div>
    )
  }

  const foto = fotos[Math.min(atual, fotos.length - 1)]

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          src={foto.url}
          alt={foto.alt || nome}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="product-gallery__image"
        />
      </div>

      {fotos.length > 1 && (
        <ul className="product-gallery__thumbs">
          {fotos.map((f, i) => (
            <li key={f.url}>
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === atual}
                className={i === atual ? 'is-active' : ''}
              >
                <Image
                  src={f.url}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 20vw, 10vw"
                  className="product-gallery__image"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
