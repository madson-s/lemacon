import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Reenvia as fotos dos produtos para o storage configurado.
 *
 *   pnpm payload run scripts/reenviar-midia.ts
 *
 * Por que existe: as mídias foram criadas antes de o projeto ter um storage
 * adapter. Os registros ficaram no banco, mas os arquivos foram para o disco
 * efêmero da Vercel e não existem em lugar nenhum — daí o 500 em
 * `/api/media/file/*`. O seed é idempotente e pula produto que já tem imagem,
 * então não adianta rodá-lo de novo: é preciso desvincular e apagar os
 * registros órfãos primeiro.
 *
 * Depois deste script, rode o seed para subir tudo outra vez:
 *
 *   pnpm payload run scripts/seed-lm.ts
 */
const payload = await getPayload({ config })

const { docs: produtos } = await payload.find({
  collection: 'produtos',
  limit: 500,
  pagination: false,
})

let desvinculados = 0
for (const produto of produtos) {
  const temGaleria = Array.isArray(produto.galeria) && produto.galeria.length > 0
  if (!produto.imagem && !temGaleria) continue

  await payload.update({
    collection: 'produtos',
    id: produto.id,
    data: { imagem: null, galeria: [] },
  })
  desvinculados++
}
console.log('produtos desvinculados:', desvinculados)

const { docs: midias } = await payload.find({
  collection: 'media',
  limit: 1000,
  pagination: false,
})

let removidas = 0
for (const midia of midias) {
  await payload.delete({ collection: 'media', id: midia.id })
  removidas++
}
console.log('mídias removidas:', removidas)
console.log('agora rode: pnpm payload run scripts/seed-lm.ts')

process.exit(0)
