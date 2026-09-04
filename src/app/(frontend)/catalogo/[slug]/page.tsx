import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { GaleriaProduto, type Foto } from '@/components/GaleriaProduto'
import {
  catalogProducts,
  mergePublishedProducts,
  type CatalogProduct,
} from '@/lib/catalogo-design'
import { altDaMedia, formatarPreco, paraProdutoItem, urlDaMedia } from '@/lib/produtos'
import type { Produto } from '@/payload-types'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

type CatalogData = {
  item: CatalogProduct | null
  document: Produto | null
  products: CatalogProduct[]
}

async function getCatalogData(slug: string): Promise<CatalogData> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'produtos',
    depth: 2,
    limit: 2000,
    pagination: false,
    where: { ativo: { equals: true } },
  })
  const products = mergePublishedProducts(docs.map(paraProdutoItem))
  const item = products.find((product) => product.slug === slug || product.id === slug) ?? null
  const document = item
    ? docs.find((product) => String(product.id) === item.id || product.slug === item.slug) ?? null
    : null

  return { item, document, products: products.length ? products : catalogProducts }
}

function safeReturnPath(value?: string) {
  if (!value || !value.startsWith('/catalogo') || value.startsWith('//')) return '/catalogo'
  return value
}

function ProductRecommendation({ product, returnPath }: { product: CatalogProduct; returnPath: string }) {
  return (
    <li>
      <Link
        className="product-detail__recommendation"
        href={`/catalogo/${product.slug}?voltar=${encodeURIComponent(returnPath)}`}
      >
        <span className="product-detail__recommendation-image">
          <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 800px) 78vw, 300px" />
        </span>
        <span className="product-detail__recommendation-copy">
          <small>{product.unit} · {product.category}</small>
          <strong>{product.name}</strong>
          <span>Conhecer solução <i aria-hidden>→</i></span>
        </span>
      </Link>
    </li>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { item } = await getCatalogData(slug)
  if (!item) return { title: 'Produto não encontrado' }

  return { title: item.name, description: item.description }
}

export default async function ProdutoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ voltar?: string }>
}) {
  const [{ slug }, { voltar }] = await Promise.all([params, searchParams])
  const { item, document, products } = await getCatalogData(slug)
  if (!item) notFound()

  const returnPath = safeReturnPath(voltar)
  const extraPhotos = document?.galeria ?? []
  const photos: Foto[] = [
    { url: item.image, alt: item.imageAlt },
    ...extraPhotos
      .map((media) => ({ url: urlDaMedia(media), alt: altDaMedia(media) || item.name }))
      .filter((photo): photo is Foto => Boolean(photo.url)),
  ].filter((photo, index, all) => all.findIndex((candidate) => candidate.url === photo.url) === index)

  const related = [...products]
    .filter((candidate) => candidate.slug !== item.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === item.category) * 2 + Number(a.unit === item.unit)
      const bScore = Number(b.category === item.category) * 2 + Number(b.unit === item.unit)
      return bScore - aScore
    })
    .slice(0, 4)

  const unitRecommendations = [
    {
      name: 'Esquadrias',
      text: 'Portas, janelas, fachadas e coberturas fabricadas sob medida.',
      image: '/images/home/category-doors.png',
    },
    {
      name: 'Vidros',
      text: 'Box, guarda-corpo, espelhos e coberturas com acabamento preciso.',
      image: '/images/home/category-box.png',
    },
    {
      name: 'Construção',
      text: 'Projeto, execução, reforma e ampliação com a mesma equipe.',
      image: '/images/catalog/ampliacao-area-externa.png',
    },
  ] as const

  return (
    <main className="product-detail">
      <div className="product-detail__topbar">
        <div className="lm-container">
          <Link href={returnPath} className="product-detail__back">
            <span aria-hidden>←</span> Voltar ao catálogo
          </Link>
          <span>{item.unit} · {item.category}</span>
        </div>
      </div>

      <section className="product-detail__hero">
        <div className="lm-container product-detail__hero-grid">
          <div className="product-detail__gallery">
            <GaleriaProduto fotos={photos} nome={item.name} />
          </div>

          <div className="product-detail__summary">
            <p className="eyebrow"><i aria-hidden />{item.unit} · {item.category}</p>
            <h1>{item.name}</h1>
            <p className="product-detail__lead">{item.description}</p>
            <div className="product-detail__tags">
              {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>

            <div className="product-detail__price">
              <span>Investimento</span>
              <strong>{document?.preco == null ? 'Sob orçamento' : formatarPreco(document.preco)}</strong>
              <small>Produção e instalação dimensionadas para o seu projeto.</small>
            </div>

            <Link href="/catalogo#orcamento" className="button button--gold">
              Solicitar orçamento <span aria-hidden>→</span>
            </Link>
            <small className="product-detail__coverage">Atendimento em toda a Chapada Diamantina.</small>
          </div>
        </div>
      </section>

      <section className="product-detail__information">
        <div className="lm-container product-detail__information-grid">
          <div className="product-detail__narrative">
            <p className="eyebrow"><i aria-hidden />Detalhes da solução</p>
            <h2>Do primeiro vão ao acabamento final</h2>
            {document?.detalhes ? (
              <div className="prose product-detail__richtext"><RichText data={document.detalhes} /></div>
            ) : (
              <p>A equipe LM faz a medição, define os materiais e acompanha a fabricação até a instalação. Cada escolha é adaptada ao ambiente para equilibrar uso, estética, vedação e durabilidade.</p>
            )}
          </div>

          <div className="product-detail__technical">
            <h2>Informações técnicas</h2>
            <dl>
              <div><dt>Unidade</dt><dd>{item.unit}</dd></div>
              <div><dt>Categoria</dt><dd>{item.category}</dd></div>
              {document?.marca && <div><dt>Linha ou marca</dt><dd>{document.marca}</dd></div>}
              {document?.especificacoes?.map((spec) => (
                <div key={spec.id ?? spec.rotulo}><dt>{spec.rotulo}</dt><dd>{spec.valor}</dd></div>
              ))}
              <div><dt>Execução</dt><dd>Sob medida</dd></div>
            </dl>
          </div>
        </div>

        <div className="lm-container product-detail__process">
          {[
            ['01', 'Medição precisa', 'Levantamento no local e definição técnica para o ambiente.'],
            ['02', 'Fabricação sob medida', 'Produção pela equipe LM com os materiais especificados.'],
            ['03', 'Instalação completa', 'Montagem, regulagem e conferência antes da entrega.'],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="product-detail__related">
          <div className="lm-container">
            <div className="product-detail__section-heading">
              <div>
                <p className="eyebrow"><i aria-hidden />Continue explorando</p>
                <h2>Soluções que combinam com este projeto</h2>
              </div>
              <Link href={returnPath}>Ver catálogo completo <span aria-hidden>→</span></Link>
            </div>
            <ul className="product-detail__recommendations">
              {related.map((product) => <ProductRecommendation product={product} returnPath={returnPath} key={product.slug} />)}
            </ul>
          </div>
        </section>
      )}

      <section className="product-detail__units">
        <div className="lm-container">
          <div className="product-detail__section-heading">
            <div>
              <p className="eyebrow"><i aria-hidden />Grupo LM</p>
              <h2>Uma solução pode envolver mais de uma unidade</h2>
            </div>
          </div>
          <div className="product-detail__unit-grid">
            {unitRecommendations.map((unit) => (
              <Link href={`/catalogo?unidade=${encodeURIComponent(unit.name)}`} key={unit.name}>
                <Image src={unit.image} alt="" fill sizes="(max-width: 800px) 100vw, 400px" />
                <span aria-hidden className="product-detail__unit-shade" />
                <span><strong>{unit.name}</strong><small>{unit.text}</small></span>
                <i aria-hidden>→</i>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
