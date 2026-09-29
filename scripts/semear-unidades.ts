import path from 'path'
import type { Payload } from 'payload'

// As três frentes com que a LM começou. A migração `unidades` já as cria em
// produção; aqui é só para um banco novo chegar no mesmo ponto — e para dar a
// cada uma a foto do card, que uma migração não consegue subir para o storage.
const UNIDADES: {
  nome: string
  descricao: string
  ordem: number
  foto: [arquivo: string, alt: string]
}[] = [
  {
    nome: 'Esquadrias',
    descricao: 'Portas, janelas, fachadas e coberturas em alumínio.',
    ordem: 1,
    foto: ['images/home/category-doors.png', 'Porta de alumínio e vidro fabricada pela LM'],
  },
  {
    nome: 'Vidros',
    descricao: 'Box, guarda-corpo, espelhos e coberturas de vidro.',
    ordem: 2,
    foto: ['images/home/category-box.png', 'Box de vidro temperado instalado pela LM'],
  },
  {
    nome: 'Construção',
    descricao: 'Projeto, execução, reforma e ampliação com equipe própria.',
    ordem: 3,
    foto: [
      'images/catalog/ampliacao-area-externa.png',
      'Ampliação de área externa executada pela LM',
    ],
  },
]

/**
 * Garante as três unidades e a foto do card de cada uma. Não mexe em unidade
 * que já tem foto nem apaga as que forem criadas pelo painel.
 *
 * Usado pelo seed-lm.ts e, sozinho, pelo seed-unidades.ts.
 */
export async function semearUnidades(payload: Payload): Promise<Map<string, number>> {
  const PASTA_PUBLICA = path.resolve(process.cwd(), 'public')
  const idDaUnidade = new Map<string, number>()

  for (const un of UNIDADES) {
    const achada = await payload.find({
      collection: 'unidades',
      where: { nome: { equals: un.nome } },
      limit: 1,
      depth: 0,
    })
    let unidade = achada.docs[0]
    if (!unidade) {
      unidade = await payload.create({
        collection: 'unidades',
        data: { nome: un.nome, descricao: un.descricao, ordem: un.ordem },
      })
      console.log('unidade criada:', un.nome)
    }
    idDaUnidade.set(un.nome, unidade.id)

    // Só põe foto em unidade que ainda não tem — uma trocada pelo painel fica.
    if (!unidade.imagem) {
      const [arquivo, alt] = un.foto
      const midia = await payload.find({
        collection: 'media',
        where: { alt: { equals: alt } },
        limit: 1,
      })
      const imagem =
        midia.docs[0]?.id ??
        (
          await payload.create({
            collection: 'media',
            data: { alt },
            filePath: path.join(PASTA_PUBLICA, arquivo),
          })
        ).id
      await payload.update({ collection: 'unidades', id: unidade.id, data: { imagem } })
      console.log('foto da unidade aplicada:', un.nome)
    }
  }

  return idDaUnidade
}
