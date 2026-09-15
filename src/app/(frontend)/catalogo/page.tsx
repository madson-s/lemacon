import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'

import { CatalogoBusca } from '@/components/CatalogoBusca'
import {
  categoriasDosProdutos,
  catalogUnits,
  mergePublishedProducts,
  type CatalogUnit,
} from '@/lib/catalogo-design'
import { paraProdutoItem } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata: Metadata = {
  title: 'Catálogo completo',
  description: 'Portas, janelas, fachadas, box, guarda-corpo, coberturas e serviços de construção sob medida.',
}

export const dynamic = 'force-dynamic'

const isUnit = (value: string | undefined): value is CatalogUnit => catalogUnits.includes(value as CatalogUnit)

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; unidade?: string; categoria?: string; pagina?: string }>
}) {
  const { q, unidade, categoria, pagina } = await searchParams
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'produtos',
    depth: 1,
    limit: 2000,
    pagination: false,
    sort: 'nome',
    where: { ativo: { equals: true } },
  })
  const products = mergePublishedProducts(docs.map(paraProdutoItem))
  // O filtro de categorias reflete o que existe cadastrado, não uma lista fixa.
  const categorias = categoriasDosProdutos(products)

  return (
    <div className="catalog-page">
      <section className="catalog-page__hero">
        <div className="lm-container catalog-page__hero-inner">
          <div className="catalog-page__hero-copy">
            <p className="eyebrow"><i aria-hidden />Catálogo LM · sob medida</p>
            <h1>Todo o catálogo de<br />esquadrias, vidros e obra</h1>
            <p>Portas, janelas, fachadas, box, guarda-corpo e serviços de construção. Cada peça é medida, fabricada e instalada pela equipe LM. Atendemos toda a Chapada Diamantina.</p>
          </div>
          <div className="catalog-page__hero-visual" aria-label="Ambiente com esquadrias de alumínio e vidro" role="img">
            <div className="catalog-page__hero-image"><Image src="/images/catalog/catalog-hero.png" alt="" fill priority sizes="(max-width: 800px) 100vw, 508px" /></div>
            <Image className="catalog-page__hero-monogram" src="/images/catalog/catalog-monogram.png?v=205-207" alt="" width={510} height={510} priority />
          </div>
        </div>
      </section>

      <CatalogoBusca
        products={products}
        initialTerm={q ?? ''}
        initialUnit={isUnit(unidade) ? unidade : 'Todas'}
        categorias={categorias}
        initialCategory={categoria && categorias.includes(categoria) ? categoria : 'Todas'}
        initialPage={Number.parseInt(pagina ?? '1', 10) || 1}
      />

    </div>
  )
}
