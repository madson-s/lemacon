import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Banners da home.
 *
 *   pnpm payload run scripts/seed-banners.ts
 *
 * A arte sai de `public/banners/`, já recortada na proporção de cada seção,
 * e sobe pelo storage configurado. Os links
 * apontam para páginas que existem hoje: o catálogo e produtos reais. Os
 * banners antigos linkavam `?unidade=Esquadrias` e `?q=fachada`, mas o
 * catálogo só lê `pagina` da URL — os outros parâmetros eram ignorados em
 * silêncio e levavam a uma lista sem filtro.
 *
 * Só escreve se a seção estiver vazia, para não sobrescrever o que for
 * cadastrado pelo painel.
 */
const payload = await getPayload({ config })

type Entrada = { arquivo: string; alt: string; link: string }

const HERO: Entrada[] = [
  {
    arquivo: 'banner-hero-1.webp',
    alt: 'Fachadas e revestimentos que transformam a chegada',
    link: '/catalogo',
  },
  {
    arquivo: 'banner-hero-2.webp',
    alt: 'Soluções que integram ambientes com acabamento de fábrica',
    link: '/catalogo',
  },
]

const FAIXA1: Entrada[] = [
  {
    arquivo: 'banner-faixa1-1.webp',
    alt: 'Projeto, fabricação e instalação com equipe própria',
    link: '/catalogo',
  },
  {
    arquivo: 'banner-faixa1-2.webp',
    alt: 'Revestimentos flexíveis Wallboard para paredes e painéis',
    link: '/catalogo/revestimento-flexivel-calacata-cinza',
  },
]

const FAIXA2: Entrada[] = [
  {
    arquivo: 'banner-faixa2-1.webp',
    alt: 'Madeira plástica para cercamento, deck e guarda-corpo',
    link: '/catalogo/palanque-estaca-90x90',
  },
  {
    arquivo: 'banner-faixa2-2.webp',
    alt: 'Telhas térmicas e metálicas para cobertura e fechamento',
    link: '/catalogo/isotelha-trapezoidal',
  },
]

// A arte foi recortada na proporção de cada seção — 16:6 na hero, 8:3 nas
// faixas — para o enquadramento não cortar o assunto da foto.
const PASTA = path.resolve(process.cwd(), 'public/banners')

const subirArte = async ({ arquivo, alt }: Entrada) => {
  const achado = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
  })
  if (achado.docs[0]) return achado.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(PASTA, arquivo),
  })
  console.log('arte enviada:', arquivo)
  return doc.id
}

const montar = async (entradas: Entrada[]) => {
  const linhas = []
  for (const entrada of entradas) {
    linhas.push({
      imagem: await subirArte(entrada),
      alt: entrada.alt,
      link: entrada.link,
    })
  }
  return linhas
}

const home = await payload.findGlobal({ slug: 'home' })

const secoes = [
  ['bannersHero', HERO, home.bannersHero],
  ['bannersFaixa1', FAIXA1, home.bannersFaixa1],
  ['bannersFaixa2', FAIXA2, home.bannersFaixa2],
] as const

const data: Record<string, unknown> = {}

for (const [campo, entradas, atuais] of secoes) {
  if (Array.isArray(atuais) && atuais.length > 0) {
    console.log(`${campo}: já tem ${atuais.length} banner(s), mantido como está`)
    continue
  }
  data[campo] = await montar([...entradas])
  console.log(`${campo}: ${entradas.length} banner(s) preparados`)
}

if (Object.keys(data).length === 0) {
  console.log('nada a fazer — todas as seções já têm banner')
  process.exit(0)
}

await payload.updateGlobal({ slug: 'home', data })
console.log('banners da home atualizados')

process.exit(0)
