import type { Localizacao } from '@/payload-types'

type Endereco = NonNullable<Localizacao['endereco']>

const limpo = (valor: string | null | undefined): string => valor?.trim() ?? ''

/** Só faz sentido montar mapa e rota quando dá para chegar: rua e cidade. */
export const temEndereco = (endereco: Endereco | null | undefined): boolean =>
  Boolean(endereco && limpo(endereco.logradouro) && limpo(endereco.cidade))

/** Duas linhas, como se lê num envelope. */
export const enderecoEmLinhas = (endereco: Endereco | null | undefined): string[] => {
  if (!endereco) return []

  const numero = limpo(endereco.numero)
  const rua = [limpo(endereco.logradouro), numero].filter(Boolean).join(', ')
  const primeira = [rua, limpo(endereco.complemento)].filter(Boolean).join(' · ')

  const cidade = [limpo(endereco.cidade), limpo(endereco.estado)].filter(Boolean).join(' — ')
  const segunda = [limpo(endereco.bairro), cidade, limpo(endereco.cep)].filter(Boolean).join(' · ')

  return [primeira, segunda].filter(Boolean)
}

const paraBusca = (endereco: Endereco): string =>
  [
    [limpo(endereco.logradouro), limpo(endereco.numero)].filter(Boolean).join(', '),
    limpo(endereco.bairro),
    limpo(endereco.cidade),
    limpo(endereco.estado),
    limpo(endereco.cep),
  ]
    .filter(Boolean)
    .join(', ')

/**
 * O Google recusa exibir num iframe os links normais de compartilhamento, então
 * só reaproveitamos o link salvo quando ele já é de incorporação; caso contrário
 * o mapa é montado a partir do endereço, que sempre funciona.
 */
export const mapaIncorporado = (
  mapaUrl: string | null | undefined,
  endereco: Endereco | null | undefined,
): string | null => {
  const salvo = limpo(mapaUrl)
  if (salvo && (salvo.includes('output=embed') || salvo.includes('/maps/embed'))) return salvo
  if (!temEndereco(endereco)) return null

  return `https://www.google.com/maps?q=${encodeURIComponent(paraBusca(endereco!))}&output=embed`
}

/** Abre o app de mapas já com a rota traçada a partir de onde a pessoa está. */
export const linkDaRota = (
  mapaUrl: string | null | undefined,
  endereco: Endereco | null | undefined,
): string | null => {
  const salvo = limpo(mapaUrl)
  if (salvo && !salvo.includes('output=embed') && !salvo.includes('/maps/embed')) return salvo
  if (!temEndereco(endereco)) return null

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(paraBusca(endereco!))}`
}

export const linkDoWhatsApp = (numero: string | null | undefined): string | null => {
  const digitos = limpo(numero).replace(/\D/g, '')
  return digitos ? `https://wa.me/${digitos}` : null
}

/** (75) 90000-0000 — só para exibir; o link usa os dígitos crus. */
export const formatarTelefone = (numero: string | null | undefined): string => {
  const digitos = limpo(numero).replace(/\D/g, '')
  const local = digitos.startsWith('55') ? digitos.slice(2) : digitos
  if (local.length < 10 || local.length > 11) return limpo(numero)

  const ddd = local.slice(0, 2)
  const resto = local.slice(2)
  const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4)
  const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4)

  return `(${ddd}) ${meio}-${fim}`
}
