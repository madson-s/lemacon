import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { ProjetoBloco } from '@/components/ProjetoBloco'
import { paraProdutoItem } from '@/lib/produtos'
import { paraProjetoItem } from '@/lib/projetos'
import config from '@/payload.config'

export const metadata = {
  title: 'Trabalhos',
  description:
    'Projetos executados pela LM: ambientes resolvidos com design moderno e peças escolhidas para valorizar o espaço.',
}

export const dynamic = 'force-dynamic'

export default async function TrabalhosPage() {
  const payload = await getPayload({ config: await config })

  const { docs: projetos } = await payload.find({
    collection: 'projetos',
    // depth 2 para trazer as peças usadas já com a categoria delas resolvida.
    depth: 2,
    limit: 100,
    pagination: false,
    sort: ['ordem', '-ano'],
    where: { publicado: { equals: true } },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Trabalhos executados</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Ambientes resolvidos, não decorados
        </h1>
        <p className="mt-5 text-pretty text-lg text-neutral-600">
          Cada projeto começa lendo o espaço: proporção, luz e circulação. As peças entram depois,
          para resolver o que o ambiente pede — e é isso que separa um ambiente montado de um
          ambiente pensado.
        </p>
      </header>

      {projetos.length === 0 ? (
        <p className="my-20 rounded-lg border border-dashed border-neutral-300 px-4 py-16 text-center text-neutral-500">
          Nenhum trabalho publicado ainda. Cadastre em{' '}
          <Link href="/admin/collections/projetos" className="underline">
            Trabalhos
          </Link>{' '}
          no painel.
        </p>
      ) : (
        <div className="mt-16">
          {projetos.map((projeto, i) => (
            <ProjetoBloco
              key={projeto.id}
              projeto={paraProjetoItem(projeto)}
              descricao={projeto.descricao}
              produtos={(projeto.produtos ?? [])
                .filter((p) => typeof p === 'object')
                .map(paraProdutoItem)}
              invertido={i % 2 === 1}
              primeiro={i === 0}
            />
          ))}
        </div>
      )}

      <section className="mt-20 rounded-2xl bg-neutral-900 px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          As peças destes ambientes estão no catálogo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-neutral-300">
          Mesmo repertório, mesma curadoria — disponível para o seu espaço.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        >
          Ver o catálogo
        </Link>
      </section>
    </div>
  )
}
