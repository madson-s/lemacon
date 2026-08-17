import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { FaixaDeMarcas } from '@/components/FaixaDeMarcas'
import { GradeDeProdutos } from '@/components/ProdutoCard'
import { SecaoTrabalhos } from '@/components/SecaoTrabalhos'
import { destaquesPrimeiro, paraProdutoItem, urlDaMedia, altDaMedia } from '@/lib/produtos'
import { paraProjetoItem } from '@/lib/projetos'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const PRODUTOS_POR_SECAO = 4

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const [home, { docs: categorias }, { docs: projetos }] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
    payload.find({
      collection: 'categorias',
      depth: 0,
      limit: 200,
      pagination: false,
      sort: 'ordem',
      where: { destacarNaHome: { equals: true } },
    }),
    payload.find({
      collection: 'projetos',
      depth: 1,
      // Três é o que a prévia mostra: um grande e dois menores.
      limit: 3,
      sort: ['-destaque', 'ordem', '-ano'],
      where: { publicado: { equals: true } },
    }),
  ])

  // Uma consulta por seção, cada uma já limitada — evita puxar o catálogo inteiro
  // só para cortar 4 produtos de cada categoria no servidor.
  const secoes = await Promise.all(
    categorias.map(async (categoria) => {
      const { docs } = await payload.find({
        collection: 'produtos',
        depth: 1,
        limit: PRODUTOS_POR_SECAO,
        sort: ['-destaque', 'nome'],
        where: {
          and: [{ ativo: { equals: true } }, { categoria: { equals: categoria.id } }],
        },
      })

      return {
        categoria,
        produtos: docs.map(paraProdutoItem).sort(destaquesPrimeiro),
      }
    }),
  )

  const comProdutos = secoes.filter((s) => s.produtos.length > 0)
  const imagemHero = urlDaMedia(home.imagem)
  const marcas = home.marcas?.map((m) => m.nome) ?? []

  // A faixa entra depois da primeira seção. Com uma seção só ela iria para o fim,
  // o que não é "entre duas" — nesse caso não aparece.
  const posicaoDaFaixa = comProdutos.length > 1 ? 0 : -1

  return (
    <>
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden border-b border-neutral-200 bg-neutral-950">
        {imagemHero ? (
          <>
            <Image
              src={imagemHero}
              alt={altDaMedia(home.imagem)}
              fill
              preload
              sizes="100vw"
              className="-z-10 object-cover"
            />
            {/* Degradê de baixo para cima: escurece onde o texto fica sem apagar a foto toda. */}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/25" />
          </>
        ) : (
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-neutral-900 to-neutral-700" />
        )}

        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:pb-24 sm:pt-40">
          <div className="max-w-4xl">
            {home.chapeu && (
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-300 sm:text-sm">
                {home.chapeu}
              </p>
            )}

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {home.titulo}
            </h1>

            {home.subtitulo && (
              <p className="mt-6 max-w-2xl text-pretty text-lg text-neutral-300 sm:text-xl">
                {home.subtitulo}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={home.ctaLink}
                className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                {home.ctaTexto}
              </Link>

              {home.ctaSecundarioTexto && (
                <Link
                  href={home.ctaSecundarioLink ?? '/trabalhos'}
                  className="inline-block rounded-lg border border-white/40 px-6 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  {home.ctaSecundarioTexto}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {comProdutos.length === 0 ? (
        <div className="mx-auto max-w-6xl px-4">
          <p className="my-16 rounded-lg border border-dashed border-neutral-300 px-4 py-12 text-center text-neutral-500">
            Nenhuma categoria com produtos ainda. Cadastre produtos no{' '}
            <Link href="/admin" className="underline">
              painel
            </Link>{' '}
            para eles aparecerem aqui.
          </p>
        </div>
      ) : (
        // Cada seção tem seu próprio container: a faixa fica fora dele para ocupar
        // a largura toda da tela, em vez de ficar presa nos 6xl do conteúdo.
        comProdutos.map(({ categoria, produtos }, i) => {
          const faixaLogoAbaixo = i === posicaoDaFaixa && marcas.length > 0
          const ultima = i === comProdutos.length - 1

          return (
            <React.Fragment key={categoria.id}>
              <div className="mx-auto max-w-6xl px-4">
                <section
                  className={`py-14 ${!ultima && !faixaLogoAbaixo ? 'border-b border-neutral-100' : ''}`}
                >
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-2xl font-semibold tracking-tight">{categoria.nome}</h2>
                      <Link
                        href={`/catalogo?categoria=${categoria.id}`}
                        className="shrink-0 whitespace-nowrap text-sm font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
                      >
                        Ver todos &rarr;
                      </Link>
                    </div>
                    {categoria.descricao && (
                      <p className="mt-1 text-sm text-neutral-500">{categoria.descricao}</p>
                    )}
                  </div>

                  <GradeDeProdutos produtos={produtos} />
                </section>
              </div>

              {faixaLogoAbaixo && (
                <FaixaDeMarcas marcas={marcas} titulo="Marcas que trabalhamos" />
              )}
            </React.Fragment>
          )
        })
      )}

      <SecaoTrabalhos
        projetos={projetos.map(paraProjetoItem)}
        chapeu={home.secaoTrabalhos?.chapeu}
        titulo={home.secaoTrabalhos?.titulo}
        texto={home.secaoTrabalhos?.texto}
        ctaTexto={home.secaoTrabalhos?.ctaTexto}
      />
    </>
  )
}
