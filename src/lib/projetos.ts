import type { Projeto } from '@/payload-types'

import { altDaMedia, urlDaMedia } from './produtos'

export type FotoDoProjeto = {
  url: string
  alt: string
}

export type ProjetoItem = {
  id: string
  slug: string | null
  titulo: string
  resumo: string | null
  local: string | null
  ano: number | null
  tipo: string | null
  capaUrl: string | null
  capaAlt: string
  fotos: FotoDoProjeto[]
}

const ROTULOS_DE_TIPO: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  corporativo: 'Corporativo',
}

export const rotuloDoTipo = (tipo: string | null): string | null =>
  tipo ? (ROTULOS_DE_TIPO[tipo] ?? tipo) : null

export const paraProjetoItem = (projeto: Projeto): ProjetoItem => ({
  id: String(projeto.id),
  slug: projeto.slug ?? null,
  titulo: projeto.titulo,
  resumo: projeto.resumo ?? null,
  local: projeto.local ?? null,
  ano: projeto.ano ?? null,
  tipo: projeto.tipo ?? null,
  capaUrl: urlDaMedia(projeto.capa),
  capaAlt: altDaMedia(projeto.capa) || projeto.titulo,
  fotos: (projeto.galeria ?? [])
    .map((media) => ({ url: urlDaMedia(media), alt: altDaMedia(media) }))
    .filter((f): f is FotoDoProjeto => f.url !== null),
})

/** Local e ano viram uma linha só: "Meireles, Fortaleza · 2025". */
export const legendaDoProjeto = (projeto: ProjetoItem): string =>
  [projeto.local, projeto.ano ? String(projeto.ano) : null].filter(Boolean).join(' · ')
