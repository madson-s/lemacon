import type { Payload } from 'payload'

import { altDaMedia, urlDaMedia } from '@/lib/produtos'

/** Formato plano de uma unidade, pronto para atravessar para o cliente. */
export type UnidadeItem = {
  id: string
  nome: string
  descricao: string | null
  imagem: string
  imagemAlt: string
}

/** Unidade sem foto cadastrada: o card usa a mesma imagem genérica do catálogo. */
export const IMAGEM_PADRAO_UNIDADE = '/images/catalog/catalog-hero.png'

/**
 * As unidades cadastradas no painel, na ordem definida lá. É a fonte única
 * dos filtros, dos cards da home, da página do produto, do rodapé e do
 * formulário — nenhum desses lugares conhece mais os nomes de cor.
 */
export async function carregarUnidades(payload: Payload): Promise<UnidadeItem[]> {
  const { docs } = await payload.find({
    collection: 'unidades',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'ordem',
  })

  return docs.map((doc) => ({
    id: String(doc.id),
    nome: doc.nome,
    descricao: doc.descricao ?? null,
    imagem: urlDaMedia(doc.imagem, 'card') ?? IMAGEM_PADRAO_UNIDADE,
    imagemAlt: altDaMedia(doc.imagem),
  }))
}

/** O link do catálogo já filtrado por uma unidade. */
export const linkDaUnidade = (nome: string) => `/catalogo?unidade=${encodeURIComponent(nome)}`
