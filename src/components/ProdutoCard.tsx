import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { formatarPreco, linkDoProduto, type ProdutoItem } from '@/lib/produtos'

export function ProdutoCard({ produto }: { produto: ProdutoItem }) {
  return (
    <li className="group">
      <Link
        href={linkDoProduto(produto)}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 transition-colors hover:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {produto.imagemUrl ? (
            <Image
              src={produto.imagemUrl}
              alt={produto.imagemAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
              sem imagem
            </div>
          )}
          {produto.destaque && (
            <span className="absolute left-2 top-2 rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
              destaque
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          {produto.categoriaNome && (
            <span className="text-xs uppercase tracking-wide text-neutral-500">
              {produto.categoriaNome}
            </span>
          )}
          <h3 className="font-medium leading-snug">{produto.nome}</h3>
          {produto.descricao && (
            <p className="line-clamp-2 text-sm text-neutral-500">{produto.descricao}</p>
          )}
          <p className="mt-auto pt-2 font-semibold">
            {produto.preco === null ? (
              <span className="font-normal text-neutral-500">sob consulta</span>
            ) : (
              formatarPreco(produto.preco)
            )}
          </p>
        </div>
      </Link>
    </li>
  )
}

export function GradeDeProdutos({
  produtos,
  className = '',
}: {
  produtos: ProdutoItem[]
  className?: string
}) {
  return (
    <ul className={`grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {produtos.map((produto) => (
        <ProdutoCard key={produto.id} produto={produto} />
      ))}
    </ul>
  )
}
