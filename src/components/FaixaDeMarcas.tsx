import React from 'react'

/** Abaixo disso a lista não preenche a largura da tela e a rolagem mostraria um vão. */
const MINIMO_DE_ITENS = 12

/** Segundos por item — mantém a velocidade constante independente do tamanho da lista. */
const SEGUNDOS_POR_ITEM = 3.5

export function FaixaDeMarcas({ marcas, titulo }: { marcas: string[]; titulo?: string }) {
  if (marcas.length === 0) return null

  // A animação desliza a trilha em -50%, então ela precisa aparecer exatamente
  // duas vezes: no fim do primeiro ciclo a segunda cópia está onde a primeira
  // começou, e o corte fica invisível.
  const repeticoes = Math.ceil(MINIMO_DE_ITENS / marcas.length)
  const trilha = Array.from({ length: repeticoes }, () => marcas).flat()
  const duracao = `${(trilha.length * SEGUNDOS_POR_ITEM).toFixed(1)}s`

  return (
    <section
      aria-label={titulo ?? 'Marcas'}
      className="marquee border-y border-neutral-200 bg-neutral-50 py-8"
    >
      {titulo && (
        <h2 className="mb-5 px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          {titulo}
        </h2>
      )}

      <div className="relative overflow-hidden">
        {/* Esfumaça as pontas para o texto não aparecer/sumir cortado na borda. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-neutral-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-neutral-50 to-transparent" />

        <div
          className="marquee-trilha flex w-max"
          style={{ ['--marquee-duracao' as string]: duracao }}
        >
          <ListaDeMarcas marcas={trilha} />
          {/* A cópia é decorativa: sem aria-hidden o leitor de tela lê tudo duas vezes. */}
          <ListaDeMarcas marcas={trilha} aria-hidden />
        </div>
      </div>
    </section>
  )
}

function ListaDeMarcas({
  marcas,
  'aria-hidden': ariaHidden,
}: {
  marcas: string[]
  'aria-hidden'?: boolean
}) {
  return (
    <ul aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {marcas.map((marca, i) => (
        <li
          key={`${marca}-${i}`}
          className="flex items-center whitespace-nowrap px-8 text-lg font-medium tracking-tight text-neutral-400"
        >
          {marca}
        </li>
      ))}
    </ul>
  )
}
