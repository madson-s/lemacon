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
  searchParams: Promise<{ q?: string; unidade?: string; categoria?: string }>
}) {
  const { q, unidade, categoria } = await searchParams
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
            <Image className="catalog-page__hero-monogram" src="/images/catalog/catalog-monogram.png" alt="" width={510} height={510} priority />
          </div>
        </div>
      </section>

      <CatalogoBusca
        products={products}
        initialTerm={q ?? ''}
        initialUnit={isUnit(unidade) ? unidade : 'Todas'}
        categorias={categorias}
        initialCategory={categoria && categorias.includes(categoria) ? categoria : 'Todas'}
      />

      <section className="contact-section catalog-page__contact" id="orcamento">
        <div className="lm-container contact-section__grid">
          <div className="contact-card">
            <p className="eyebrow"><i aria-hidden />Orçamento</p>
            <h2>Conte o seu<br />projeto</h2>
            <p>Envie as medidas ou peça uma avaliação no local. Retornamos com a especificação e o orçamento pelo WhatsApp.</p>
            <a className="button button--gold" href="https://wa.me/" target="_blank" rel="noreferrer">Falar no WhatsApp <span aria-hidden>→</span></a>
            <dl>
              <div><dt>Atendimento</dt><dd>Toda a Chapada Diamantina</dd></div>
              <div><dt>Escopo</dt><dd>Projeto · fabricação · instalação</dd></div>
              <div><dt>Avaliação</dt><dd>Sem compromisso</dd></div>
            </dl>
          </div>
          <form className="contact-form" action="#orcamento">
            <label>Nome<input name="nome" type="text" placeholder="Como podemos chamar você" /></label>
            <label>Telefone / WhatsApp<input name="telefone" type="tel" placeholder="(00) 0 0000-0000" /></label>
            <label>Unidade de interesse<select name="unidade" defaultValue="Esquadrias de alumínio"><option>Esquadrias de alumínio</option><option>Vidros temperados</option><option>Tec Construção</option></select></label>
            <label>Mensagem<textarea name="mensagem" placeholder="Descreva o ambiente, as medidas ou o que precisa" /></label>
            <button type="submit" className="button button--dark">Solicitar orçamento</button>
            <small>Seus dados ficam protegidos e não são compartilhados.</small>
          </form>
        </div>
      </section>
    </div>
  )
}
