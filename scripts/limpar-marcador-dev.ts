import type { Payload } from 'payload'

/**
 * Remove o marcador `dev` da tabela de migrations.
 *
 * Por que isso existe: `payload run` abre o Payload em modo de desenvolvimento
 * e faz push do schema, deixando uma linha `name='dev', batch=-1` em
 * `payload_migrations`. Com ela presente, o `payload migrate` do build pergunta
 *
 *   "It looks like you've run Payload in dev mode..."
 *
 * e, num build não interativo como o da Vercel, fica travado nesse prompt até
 * estourar o tempo. O deploy falha sem erro aparente.
 *
 * A linha não carrega schema — é só um aviso de que houve push dinâmico. Todo
 * script que roda via `payload run` contra um banco de produção deve chamar
 * isto no fim, senão quebra o próximo deploy.
 */
export const limparMarcadorDev = async (payload: Payload) => {
  const { rowCount } = await payload.db.drizzle.execute(
    `delete from payload_migrations where name = 'dev'`,
  )

  if (rowCount) console.log('marcador `dev` removido — o próximo deploy não vai travar')
  return rowCount ?? 0
}
