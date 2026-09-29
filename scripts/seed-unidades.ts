import { getPayload } from 'payload'

import config from '../src/payload.config'

import { limparMarcadorDev } from './limpar-marcador-dev'
import { semearUnidades } from './semear-unidades'

/**
 * Só as unidades: garante as três e dá a foto do card às que ainda não têm.
 * Existe para completar o que a migração `unidades` cria em produção — ela
 * cadastra as unidades, mas não consegue subir foto para o storage.
 *
 *   NODE_ENV=production pnpm payload run scripts/seed-unidades.ts
 *
 * O NODE_ENV=production importa: sem ele o `payload run` sincroniza o schema do
 * banco com o código — removendo colunas que o código não conhece, como a
 * coluna antiga de unidade enquanto ela ainda estiver lá — e deixa o marcador
 * `dev`, que trava o próximo deploy.
 */
const payload = await getPayload({ config })

await semearUnidades(payload)
await limparMarcadorDev(payload)

process.exit(0)
