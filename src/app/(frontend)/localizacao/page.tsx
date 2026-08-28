/*
  THESIS: a página é o caminho até a porta, não um cartão de visita com um mapa
  ao lado. Recusa o par endereço-à-esquerda/mapa-à-direita como estrutura.
  OWN-WORLD: mundo LM já existente (ink #1c1b18, paper #f8f5ef, ouro #c59a32,
  .lm-container, .eyebrow, botões pill). Novidade: espinha do roteiro com marcos
  numerados e ícones traçados a 1.7, na mesma gramática dos ícones do catálogo.
  STORY: o visitante sabe se a LM atende a região dele, reconhece o lugar na rua,
  traça a rota — ou resolve pelo WhatsApp sem sair de casa.
  FIRST VIEWPORT: chapéu, título, abertura e a fileira de ações reais (rota,
  WhatsApp, telefone) antes de qualquer rolagem; o roteiro começa logo abaixo.
  FORM: roteiro de chegada — candidato 5 da lista ordenada; seed 1f38948c.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/

import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import {
  enderecoEmLinhas,
  formatarTelefone,
  linkDaRota,
  linkDoWhatsApp,
  mapaIncorporado,
  temEndereco,
} from '@/lib/localizacao'
import { altDaMedia, urlDaMedia } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: 'Localização',
  description:
    'Onde fica a LM e como chegar: região atendida, ponto de referência, endereço, horários e contato direto.',
}

export const dynamic = 'force-dynamic'

const traco = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.7 }

const IconePino = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <path d="M12 21c4.5-4.4 6.7-7.9 6.7-10.6A6.7 6.7 0 0 0 5.3 10.4C5.3 13.1 7.5 16.6 12 21Z" />
    <circle cx="12" cy="10.3" r="2.5" />
  </svg>
)

const IconeRelogio = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.4V12l3.1 2" />
  </svg>
)

const IconeConversa = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <path d="M20 11.6a7.7 7.7 0 0 1-11.2 6.9L4 19.6l1.2-4.6A7.7 7.7 0 1 1 20 11.6Z" />
    <path d="M9.4 10.1c.3 1.6 1.6 3 3.3 3.5l.9-1.2 2 .7-.3 1.6c-2.9.5-6.2-2.4-6.5-5.3l1.6-.4.7 2-1.7-.9Z" />
  </svg>
)

const IconeTelefone = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <path d="M6.2 4.5h3l1.4 3.6-1.9 1.4a10.4 10.4 0 0 0 5.1 5.1l1.4-1.9 3.6 1.4v3a1.6 1.6 0 0 1-1.8 1.6A14.6 14.6 0 0 1 4.6 6.3a1.6 1.6 0 0 1 1.6-1.8Z" />
  </svg>
)

const IconeFormulario = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <path d="M15.4 4.6H7a2 2 0 0 0-2 2v10.8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2Z" />
    <path d="M15.2 4.7v3.4h3.6M8.6 12.4h6.8M8.6 15.6h4.4" />
  </svg>
)

const IconeEnvelope = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...traco}>
    <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.2" />
    <path d="m4.4 7.4 7.6 5.3 7.6-5.3" />
  </svg>
)

export default async function LocalizacaoPage() {
  const payload = await getPayload({ config: await config })
  const local = await payload.findGlobal({ slug: 'localizacao', depth: 1 })

  const endereco = local.endereco
  const linhasEndereco = enderecoEmLinhas(endereco)
  const mapa = mapaIncorporado(local.mapaUrl, endereco)
  const rota = linkDaRota(local.mapaUrl, endereco)
  const whatsapp = linkDoWhatsApp(local.contato?.whatsapp)
  const telefone = local.contato?.telefone?.trim() || ''
  const email = local.contato?.email?.trim() || ''
  const horarios = local.horarios ?? []
  const fachada = urlDaMedia(local.imagem, 'card')

  // O estado tem valor padrão no admin, então sozinho ele não prova nada:
  // a etapa da base só existe quando a cidade estiver preenchida.
  const cidade = endereco?.cidade?.trim()
    ? [endereco.cidade.trim(), endereco.estado?.trim()].filter(Boolean).join(' — ')
    : ''

  const etapas = [
    local.regiao?.trim() && {
      chave: 'regiao',
      titulo: 'A região que atendemos',
      texto: local.regiao.trim(),
      nota: 'Projeto, fabricação e instalação chegam até a sua obra.',
    },
    cidade && {
      chave: 'cidade',
      titulo: 'Onde fica a nossa base',
      texto: cidade,
      nota: 'É daqui que sai tudo o que a gente fabrica.',
    },
    local.referencia?.trim() && {
      chave: 'referencia',
      titulo: 'Como reconhecer na rua',
      texto: local.referencia.trim(),
      nota: null,
    },
    temEndereco(endereco) && {
      chave: 'endereco',
      titulo: 'A porta',
      texto: linhasEndereco.join('\n'),
      nota: null,
    },
  ].filter(Boolean) as { chave: string; titulo: string; texto: string; nota: string | null }[]

  const semDados = !temEndereco(endereco) && !whatsapp && !telefone && !email

  return (
    <>
      <section className="local-topo">
        <div className="lm-container local-topo__inner">
          {local.chapeu && (
            <p className="eyebrow">
              <i aria-hidden />
              {local.chapeu}
            </p>
          )}
          <h1>{local.titulo}</h1>
          {local.lead && <p className="local-topo__lead">{local.lead}</p>}

          <div className="button-row local-topo__acoes">
            {rota && (
              <a className="button button--gold" href={rota} target="_blank" rel="noreferrer">
                Traçar rota até a LM
                <span aria-hidden className="arrow">
                  →
                </span>
              </a>
            )}
            {whatsapp && (
              <a className="button button--dark" href={whatsapp} target="_blank" rel="noreferrer">
                Falar no WhatsApp
                <span aria-hidden className="arrow">
                  →
                </span>
              </a>
            )}
            {!rota && !whatsapp && (
              <Link className="button button--gold" href="/#orcamento">
                Pedir uma avaliação
                <span aria-hidden className="arrow">
                  →
                </span>
              </Link>
            )}
            {telefone && (
              <a className="text-link local-topo__telefone" href={`tel:${telefone.replace(/\D/g, '')}`}>
                <span aria-hidden className="arrow">
                  <IconeTelefone />
                </span>
                Ligar: {telefone}
              </a>
            )}
          </div>

          {etapas.length > 0 && (
            <ol className="local-rota__lista">
              {etapas.map((etapa, i) => (
                <li
                  key={etapa.chave}
                  className={etapa.chave === 'endereco' ? 'is-destino' : undefined}
                >
                  <span
                    className={`local-rota__marco${etapas.length === 1 ? ' is-unico' : ''}`}
                    aria-hidden
                  >
                    {etapa.chave === 'endereco' ? (
                      <IconePino />
                    ) : etapas.length > 1 ? (
                      String(i + 1).padStart(2, '0')
                    ) : null}
                  </span>
                  <div className="local-rota__corpo">
                    <h2>{etapa.titulo}</h2>
                    <p className="local-rota__valor">
                      {etapa.texto.split('\n').map((linha, indice) => (
                        <React.Fragment key={linha}>
                          {indice > 0 && <br />}
                          {linha}
                        </React.Fragment>
                      ))}
                    </p>
                    {etapa.nota && <p className="local-rota__nota">{etapa.nota}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* O mapa é o destino do roteiro, em faixa cheia — não uma coluna paralela
          disputando a leitura com ele. */}
      {mapa && (
        <div className="local-mapa">
          <iframe
            src={mapa}
            title="Mapa com a localização da LM"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}

      {!mapa && fachada && (
        <div className="local-mapa local-mapa--foto">
          <Image
            src={fachada}
            alt={altDaMedia(local.imagem) || 'Fachada da LM'}
            fill
            sizes="100vw"
            className="local-mapa__image"
          />
        </div>
      )}

      {(horarios.length > 0 || (mapa && fachada)) && (
        <section className="local-visita">
          <div
            className={`lm-container local-visita__grid${
              horarios.length > 0 && mapa && fachada ? '' : ' is-solo'
            }`}
          >
            {horarios.length > 0 && (
              <div className="local-horarios">
                <h2>
                  <IconeRelogio />
                  Horário de atendimento
                </h2>
                <dl>
                  {horarios.map((faixa) => (
                    <div key={faixa.id ?? faixa.dias}>
                      <dt>{faixa.dias}</dt>
                      <dd>{faixa.horario}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {mapa && fachada && (
              <div className="local-visita__foto">
                <Image
                  src={fachada}
                  alt={altDaMedia(local.imagem) || 'Fachada da LM'}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="local-canais">
        <div className="lm-container local-canais__inner">
          <div className="local-canais__copy">
            <h2>Fale direto com a gente</h2>
            <p>
              {semDados
                ? 'Ainda dá para resolver tudo à distância: conte o que você precisa e a gente retorna com a especificação e o prazo.'
                : 'Mande as medidas, uma foto do vão ou só a dúvida. Quem responde é quem fabrica.'}
            </p>
          </div>

          <ul className="local-canais__lista">
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  <IconeConversa />
                  <span>
                    <small>WhatsApp</small>
                    {formatarTelefone(local.contato?.whatsapp)}
                  </span>
                  <span aria-hidden className="arrow arrow--diagonal">
                    →
                  </span>
                </a>
              </li>
            )}
            {telefone && (
              <li>
                <a href={`tel:${telefone.replace(/\D/g, '')}`}>
                  <IconeTelefone />
                  <span>
                    <small>Telefone</small>
                    {telefone}
                  </span>
                  <span aria-hidden className="arrow arrow--diagonal">
                    →
                  </span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>
                  <IconeEnvelope />
                  <span>
                    <small>E-mail</small>
                    {email}
                  </span>
                  <span aria-hidden className="arrow arrow--diagonal">
                    →
                  </span>
                </a>
              </li>
            )}
            {semDados && (
              <li>
                <Link href="/#orcamento">
                  <IconeFormulario />
                  <span>
                    <small>Formulário</small>
                    Contar o meu projeto
                  </span>
                  <span aria-hidden className="arrow arrow--diagonal">
                    →
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}
