/*
  THESIS: a LM se apresenta na mesma gramática com que vende — uma ficha técnica.
  Recusa a página institucional de linha do tempo com cards de valores.
  OWN-WORLD: mundo LM já existente (ink #1c1b18, paper #f8f5ef, ouro #c59a32,
  .lm-container, .eyebrow, botões pill). Novidade: régua de dados com filetes,
  valores tabulares e o ano em Instrument Serif — face já carregada e nunca usada.
  STORY: o visitante entende que projeto, fábrica e instalação são a mesma equipe,
  confere os dados como confere um perfil de esquadria, e pede orçamento.
  FIRST VIEWPORT: banda ink; à esquerda chapéu, título e abertura; à direita a
  ficha da empresa já legível, sem rolar. Ação primária no fechamento da página.
  FORM: ficha técnica da empresa — candidato 6 da lista ordenada; seed f8a955ee.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/

import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { altDaMedia, urlDaMedia } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: 'Sobre',
  description:
    'Quem é a LM: projeto, fabricação em galpão próprio e instalação com equipe própria, para toda a Chapada Diamantina.',
}

export const dynamic = 'force-dynamic'

type RichTextData = NonNullable<NonNullable<Awaited<ReturnType<typeof carregar>>['historia']>['texto']>

const carregar = async () => {
  const payload = await getPayload({ config: await config })
  return payload.findGlobal({ slug: 'sobre', depth: 1 })
}

/** O Lexical devolve um parágrafo vazio quando o editor nunca foi preenchido. */
const temTexto = (data: RichTextData | null | undefined): boolean => {
  if (!data?.root?.children) return false

  const contemTexto = (no: Record<string, unknown>): boolean => {
    if (typeof no.text === 'string' && no.text.trim() !== '') return true
    const filhos = no.children
    return Array.isArray(filhos) ? filhos.some((f) => contemTexto(f as Record<string, unknown>)) : false
  }

  return data.root.children.some((no) => contemTexto(no as unknown as Record<string, unknown>))
}

const iniciais = (nome: string): string =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')

export default async function SobrePage() {
  const sobre = await carregar()

  const ficha = (sobre.ficha ?? []).filter((linha) => linha.valor?.trim())
  const capacidades = sobre.capacidades ?? []
  const equipe = sobre.equipe ?? []
  const historia = sobre.historia
  const temHistoria = temTexto(historia?.texto)
  const fechamento = sobre.fechamento

  // Sem upload, a faixa cai numa foto do acervo próprio que já está no repositório:
  // a página fica no mesmo material da home em vez de virar uma ilha só de tipografia.
  const abertura = urlDaMedia(sobre.imagem, 'card') ?? '/images/home/aluminium-detail.png'
  const aberturaAlt =
    altDaMedia(sobre.imagem) ||
    'Residência com fechamento em alumínio e madeira executado pela LM, com a entrada iluminada'
  const imagemHistoria = urlDaMedia(historia?.imagem, 'card')

  return (
    <>
      <section className="sobre-sheet">
        <div className="lm-container sobre-sheet__inner">
          <div className="sobre-sheet__copy">
            {sobre.chapeu && (
              <p className="eyebrow">
                <i aria-hidden />
                {sobre.chapeu}
              </p>
            )}
            <h1>{sobre.titulo}</h1>
            {sobre.lead && <p className="sobre-sheet__lead">{sobre.lead}</p>}
          </div>

          {ficha.length > 0 && (
            <div className="sobre-sheet__ficha">
              <p className="sobre-sheet__ficha-titulo">A LM em números e fatos</p>
              <dl>
                {ficha.map((linha) => (
                  <div key={linha.id ?? linha.rotulo}>
                    <dt>{linha.rotulo}</dt>
                    <dd>{linha.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <div className="sobre-band">
        <Image src={abertura} alt={aberturaAlt} fill sizes="100vw" className="sobre-band__image" />
      </div>

      {capacidades.length > 0 && (
        <section className="sobre-exec">
          <div className="lm-container">
            {sobre.capacidadesTitulo && <h2>{sobre.capacidadesTitulo}</h2>}
            <div className="sobre-exec__list">
              {capacidades.map((frente) => (
                <article key={frente.id ?? frente.titulo} className="sobre-exec__row">
                  <h3>
                    <i aria-hidden />
                    {frente.titulo}
                  </h3>
                  {frente.texto && <p>{frente.texto}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {temHistoria && (
        <section className="sobre-historia">
          <div className="lm-container sobre-historia__grid">
            <div className="sobre-historia__aside">
              {historia?.desde && (
                <p className="sobre-historia__ano">
                  <span>No mercado desde</span>
                  <strong>{historia.desde}</strong>
                </p>
              )}
              {imagemHistoria && (
                <div className="sobre-historia__media">
                  <Image
                    src={imagemHistoria}
                    alt={altDaMedia(historia?.imagem) || 'Início da LM'}
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                  />
                </div>
              )}
            </div>

            <div className="sobre-historia__texto">
              {historia?.titulo && <h2>{historia.titulo}</h2>}
              <div className="prose prose-neutral max-w-none">
                <RichText data={historia!.texto!} />
              </div>
            </div>
          </div>
        </section>
      )}

      {equipe.length > 0 && (
        <section className="sobre-equipe">
          <div className="lm-container">
            <div className="sobre-equipe__intro">
              {sobre.equipeTitulo && <h2>{sobre.equipeTitulo}</h2>}
              {sobre.equipeTexto && <p>{sobre.equipeTexto}</p>}
            </div>

            <ul className="sobre-equipe__grid">
              {equipe.map((pessoa) => {
                const foto = urlDaMedia(pessoa.foto, 'thumbnail')

                return (
                  <li key={pessoa.id ?? pessoa.nome} className="sobre-pessoa">
                    {foto ? (
                      <div className="sobre-pessoa__foto">
                        <Image
                          src={foto}
                          alt={altDaMedia(pessoa.foto) || pessoa.nome}
                          fill
                          sizes="72px"
                        />
                      </div>
                    ) : (
                      <span className="sobre-pessoa__iniciais" aria-hidden>
                        {iniciais(pessoa.nome)}
                      </span>
                    )}
                    <span className="sobre-pessoa__nome">
                      <strong>{pessoa.nome}</strong>
                      {pessoa.funcao && <small>{pessoa.funcao}</small>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {fechamento?.titulo && (
        <section className="sobre-cta">
          <div className="lm-container sobre-cta__inner">
            <div>
              <h2>{fechamento.titulo}</h2>
              {fechamento.texto && <p>{fechamento.texto}</p>}
            </div>
            {fechamento.ctaTexto && (
              <Link className="button button--gold" href={fechamento.ctaLink || '/#orcamento'}>
                {fechamento.ctaTexto}
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  )
}
