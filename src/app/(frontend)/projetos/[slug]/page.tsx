import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { GaleriaProduto, type Foto } from '@/components/GaleriaProduto'
import { altDaMedia, urlDaMedia } from '@/lib/produtos'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const carregar = async (slug: string) => {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'projetos',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { publicado: { equals: true } }] },
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const projeto = await carregar(slug)
  if (!projeto) return { title: 'Projeto não encontrado' }

  return { title: projeto.titulo, description: projeto.resumo ?? undefined }
}

export default async function ProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projeto = await carregar(slug)
  if (!projeto) notFound()

  // A capa abre a galeria, como na página de produto.
  const fotos: Foto[] = [
    { url: urlDaMedia(projeto.capa), alt: altDaMedia(projeto.capa) || projeto.titulo },
    ...(projeto.galeria ?? []).map((media) => ({
      url: urlDaMedia(media),
      alt: altDaMedia(media) || projeto.titulo,
    })),
  ].filter((foto): foto is Foto => Boolean(foto.url))

  // Só peças que continuam ativas no catálogo — um produto tirado do ar não
  // deve virar link quebrado a partir do projeto.
  const pecas = (projeto.produtos ?? []).filter(
    (produto): produto is Exclude<typeof produto, number> =>
      typeof produto === 'object' && produto !== null && produto.ativo !== false,
  )

  const ficha = [
    projeto.local && { rotulo: 'Local', valor: projeto.local },
    projeto.ano && { rotulo: 'Ano', valor: String(projeto.ano) },
    projeto.tipo && { rotulo: 'Tipo', valor: projeto.tipo },
  ].filter(Boolean) as { rotulo: string; valor: string }[]

  return (
    <main className="product-detail">
      <div className="product-detail__topbar">
        <div className="lm-container">
          <Breadcrumbs
            items={[
              { label: 'Início', href: '/' },
              { label: 'Sobre a LM', href: '/sobre' },
              { label: projeto.titulo },
            ]}
          />
        </div>
      </div>

      <section className="product-detail__hero">
        <div className="lm-container product-detail__hero-grid">
          <div className="product-detail__gallery">
            <GaleriaProduto fotos={fotos} nome={projeto.titulo} />
          </div>

          <div className="product-detail__summary">
            <p className="eyebrow"><i aria-hidden />Projeto executado</p>
            <h1>{projeto.titulo}</h1>
            {projeto.resumo && <p className="product-detail__lead">{projeto.resumo}</p>}

            {ficha.length > 0 && (
              <div className="product-detail__price projeto-ficha">
                <dl>
                  {ficha.map((linha) => (
                    <div key={linha.rotulo}>
                      <dt>{linha.rotulo}</dt>
                      <dd>{linha.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <Link href="/#orcamento" className="button button--gold">
              Quero um projeto assim <span aria-hidden>→</span>
            </Link>
            <small className="product-detail__coverage">Atendimento em toda a Chapada Diamantina.</small>
          </div>
        </div>
      </section>

      {projeto.descricao && (
        <section className="product-detail__information">
          <div className="lm-container product-detail__information-grid">
            <div className="product-detail__narrative">
              <p className="eyebrow"><i aria-hidden />O projeto</p>
              <h2>Do desafio do espaço à solução executada</h2>
              <div className="prose product-detail__richtext">
                <RichText data={projeto.descricao} />
              </div>
            </div>
          </div>
        </section>
      )}

      {pecas.length > 0 && (
        <section className="product-detail__related">
          <div className="lm-container">
            <div className="product-detail__related-head">
              <h2>Peças usadas neste projeto</h2>
              <Link href="/catalogo">Ver catálogo completo <span aria-hidden>→</span></Link>
            </div>
            <ul className="product-detail__related-grid">
              {pecas.map((peca) => {
                const foto = urlDaMedia(peca.imagem, 'card')
                return (
                  <li key={peca.id}>
                    <Link className="product-detail__recommendation" href={`/catalogo/${peca.slug ?? peca.id}`}>
                      <span className="product-detail__recommendation-image">
                        {foto && (
                          <Image
                            src={foto}
                            alt={altDaMedia(peca.imagem) || peca.nome}
                            fill
                            sizes="(max-width: 800px) 78vw, 300px"
                          />
                        )}
                      </span>
                      <span className="product-detail__recommendation-copy">
                        <small>{peca.marca ?? 'LM'}</small>
                        <strong>{peca.nome}</strong>
                        <span>Ver produto <i aria-hidden>→</i></span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
