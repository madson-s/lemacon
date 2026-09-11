import type { Media, Produto } from '@/payload-types'

/**
 * Formato plano que atravessa a fronteira servidor -> cliente.
 * O Fuse indexa isso no navegador, então tudo aqui precisa ser serializável
 * e pequeno: nada de documentos inteiros do Payload.
 */
export type ProdutoItem = {
  id: string
  slug: string | null
  nome: string
  descricao: string | null
  preco: number | null
  tags: string[]
  categoriaId: string | null
  categoriaNome: string | null
  categoriaUnidade: string | null
  imagemUrl: string | null
  imagemAlt: string
  destaque: boolean
}

export type CategoriaItem = {
  id: string
  nome: string
  slug: string | null
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatarPreco = (preco: number | null): string =>
  preco === null ? 'sob consulta' : moeda.format(preco)

type TamanhoMedia = 'thumbnail' | 'card'

/**
 * O Payload devolve a URL absoluta quando `serverURL` está configurado, e o
 * next/image recusa host não declarado em `images.remotePatterns`. Como a mídia
 * é servida pela própria aplicação, encurtar para caminho relativo resolve sem
 * configuração e ainda evita o otimizador fazer uma requisição HTTP para si mesmo.
 * Ao migrar para S3/R2, o host passa a ser outro e aí sim entra `remotePatterns`.
 */
const paraCaminhoLocal = (url: string): string => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  if (base && url.startsWith(base)) return url.slice(base.length) || '/'
  return url
}

export const urlDaMedia = (
  media: number | Media | null | undefined,
  tamanho: TamanhoMedia = 'card',
): string | null => {
  if (!media || typeof media !== 'object') return null

  const url = media.sizes?.[tamanho]?.url ?? media.url
  return url ? paraCaminhoLocal(url) : null
}

export const altDaMedia = (media: number | Media | null | undefined): string =>
  media && typeof media === 'object' ? (media.alt ?? '') : ''

export const paraProdutoItem = (produto: Produto): ProdutoItem => {
  const categoria = typeof produto.categoria === 'object' ? produto.categoria : null

  return {
    id: String(produto.id),
    slug: produto.slug ?? null,
    nome: produto.nome,
    descricao: produto.descricao ?? null,
    preco: produto.preco ?? null,
    tags: produto.tags?.map((t) => t.valor) ?? [],
    categoriaId: categoria ? String(categoria.id) : String(produto.categoria),
    categoriaNome: categoria?.nome ?? null,
    categoriaUnidade: categoria?.unidade ?? null,
    imagemUrl: urlDaMedia(produto.imagem),
    imagemAlt: altDaMedia(produto.imagem) || produto.nome,
    destaque: produto.destaque ?? false,
  }
}

/** Destaques primeiro, depois alfabético — usado nas vitrines da home. */
export const destaquesPrimeiro = (a: ProdutoItem, b: ProdutoItem): number =>
  Number(b.destaque) - Number(a.destaque) || a.nome.localeCompare(b.nome, 'pt-BR')

export const linkDoProduto = (produto: Pick<ProdutoItem, 'id' | 'slug'>): string =>
  `/catalogo/${produto.slug ?? produto.id}`
