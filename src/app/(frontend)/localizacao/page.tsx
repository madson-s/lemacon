import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import {
  enderecoEmLinhas,
  formatarTelefone,
  linkDaRota,
  linkDoWhatsApp,
  temEndereco,
} from '@/lib/localizacao'
import { altDaMedia, urlDaMedia } from '@/lib/produtos'
import config from '@/payload.config'

export const metadata = {
  title: 'Localização',
  description: 'Onde fica a LM, a região atendida e os canais para planejar uma visita ou avaliação.',
}

export const dynamic = 'force-dynamic'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 1.7,
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <path d="M12 21c4.5-4.4 6.7-7.9 6.7-10.6A6.7 6.7 0 0 0 5.3 10.4C5.3 13.1 7.5 16.6 12 21Z" />
    <circle cx="12" cy="10.3" r="2.5" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.4V12l3.1 2" />
  </svg>
)

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <path d="M20 11.6a7.7 7.7 0 0 1-11.2 6.9L4 19.6l1.2-4.6A7.7 7.7 0 1 1 20 11.6Z" />
    <path d="M9.4 10.1c.3 1.6 1.6 3 3.3 3.5l.9-1.2 2 .7-.3 1.6c-2.9.5-6.2-2.4-6.5-5.3l1.6-.4.7 2-1.7-.9Z" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <path d="M6.2 4.5h3l1.4 3.6-1.9 1.4a10.4 10.4 0 0 0 5.1 5.1l1.4-1.9 3.6 1.4v3a1.6 1.6 0 0 1-1.8 1.6A14.6 14.6 0 0 1 4.6 6.3a1.6 1.6 0 0 1 1.6-1.8Z" />
  </svg>
)

const FormIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <path d="M15.4 4.6H7a2 2 0 0 0-2 2v10.8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2Z" />
    <path d="M15.2 4.7v3.4h3.6M8.6 12.4h6.8M8.6 15.6h4.4" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
    <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.2" />
    <path d="m4.4 7.4 7.6 5.3 7.6-5.3" />
  </svg>
)

export default async function LocalizacaoPage() {
  const payload = await getPayload({ config: await config })
  const local = await payload.findGlobal({ slug: 'localizacao', depth: 1 })
  const address = local.endereco
  const addressLines = enderecoEmLinhas(address)
  const route = linkDaRota(local.mapaUrl, address)
  const whatsapp = linkDoWhatsApp(local.contato?.whatsapp)
  const phone = local.contato?.telefone?.trim() || ''
  const email = local.contato?.email?.trim() || ''
  const hours = local.horarios ?? []
  const facade = urlDaMedia(local.imagem, 'card')
  const city = address?.cidade?.trim()
    ? [address.cidade.trim(), address.estado?.trim()].filter(Boolean).join(' — ')
    : ''
  const region = local.regiao?.trim() || 'Toda a Chapada Diamantina'
  const noContactData = !temEndereco(address) && !whatsapp && !phone && !email
  const primaryCta = route ?? whatsapp ?? '/#orcamento'
  const primaryExternal = Boolean(route ?? whatsapp)
  const chapadaGoogleMap = 'https://www.google.com/maps?q=Chapada%20Diamantina%2C%20Bahia&z=8&output=embed'

  const locationCards = [
    {
      label: 'Região atendida',
      title: region,
      text: 'Projeto, fabricação e instalação chegam até a sua obra.',
    },
    city && {
      label: 'Base da equipe',
      title: city,
      text: 'É daqui que saem as peças produzidas pela LM.',
    },
    local.referencia?.trim() && {
      label: 'Ponto de referência',
      title: local.referencia.trim(),
      text: 'Uma orientação simples para reconhecer a chegada.',
    },
  ].filter(Boolean) as { label: string; title: string; text: string }[]

  return (
    <main className="location-page">
      <section className="location-hero">
        <div className="lm-container location-hero__intro">
          <p className="eyebrow"><i aria-hidden />{local.chapeu || 'Onde estamos'}</p>
          <h1>{local.titulo || 'Onde encontrar a LM'}</h1>
          <p>{local.lead || 'Planeje uma visita ou peça uma avaliação: a equipe LM atende toda a Chapada Diamantina.'}</p>

          <div className="location-hero__finder">
            <span><PinIcon /></span>
            <p><small>Área de atendimento</small><strong>{region}</strong></p>
            <a href={primaryCta} target={primaryExternal ? '_blank' : undefined} rel={primaryExternal ? 'noreferrer' : undefined}>
              {route ? 'Traçar rota' : whatsapp ? 'Falar com a LM' : 'Pedir avaliação'} <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="lm-container location-map-stage">
          <div className="location-map-stage__media">
            <iframe
              src={chapadaGoogleMap}
              title="Mapa do Google Maps centralizado na Chapada Diamantina"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <span className="location-map-stage__veil" aria-hidden />
          <article className="location-map-card">
            <span className="location-map-card__icon"><PinIcon /></span>
            <p className="eyebrow"><i aria-hidden />Ponto de atendimento</p>
            <h2>{city || region}</h2>
            <p>{temEndereco(address) ? addressLines.join(' · ') : 'A equipe combina o melhor ponto de encontro com você antes da visita.'}</p>
            {route && <a href={route} target="_blank" rel="noreferrer">Abrir no mapa <span aria-hidden>→</span></a>}
          </article>
          <a
            className="location-map-stage__credit"
            href="https://www.google.com/maps/search/?api=1&query=Chapada%20Diamantina%2C%20Bahia"
            target="_blank"
            rel="noreferrer"
          >
            Abrir no Google Maps
          </a>
        </div>

        <dl className="lm-container location-stats">
          <div><dt>Atendimento</dt><dd>{region}</dd></div>
          <div><dt>Escopo</dt><dd>Projeto · fabricação · instalação</dd></div>
          <div><dt>Avaliação</dt><dd>No local e sem compromisso</dd></div>
        </dl>
      </section>

      <section className="location-coverage">
        <div className="lm-container location-coverage__grid">
          <div className="location-coverage__copy">
            <p className="eyebrow"><i aria-hidden />A LM vai até você</p>
            <h2>Da primeira medida à instalação no seu endereço</h2>
            <p>Antes de fabricar, entendemos o ambiente, os acessos e o uso de cada abertura. Assim, a visita já começa com contexto e termina com uma solução possível de executar.</p>
            <Link href="/catalogo" className="button button--dark">Conhecer o catálogo <span aria-hidden>→</span></Link>
          </div>
          <div className="location-coverage__cards">
            {locationCards.map((card, index) => (
              <article key={card.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(hours.length > 0 || facade) && (
        <section className="location-visit">
          <div className={`lm-container location-visit__grid${hours.length && facade ? '' : ' is-solo'}`}>
            {hours.length > 0 && (
              <div className="location-hours">
                <p className="eyebrow"><i aria-hidden />Planeje a visita</p>
                <h2><ClockIcon /> Horário de atendimento</h2>
                <dl>
                  {hours.map((range) => (
                    <div key={range.id ?? range.dias}><dt>{range.dias}</dt><dd>{range.horario}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            {facade && (
              <div className="location-visit__image">
                <Image src={facade} alt={altDaMedia(local.imagem) || 'Fachada da LM'} fill sizes="(max-width: 800px) 100vw, 50vw" />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="local-canais">
        <div className="lm-container local-canais__inner">
          <div className="local-canais__copy">
            <p className="eyebrow"><i aria-hidden />Contato direto</p>
            <h2>Fale com quem vai cuidar do seu projeto</h2>
            <p>{noContactData ? 'Conte o que você precisa e a equipe retorna com a especificação e o próximo passo.' : 'Mande as medidas, uma foto do vão ou apenas a dúvida. Quem responde entende da fabricação.'}</p>
          </div>

          <ul className="local-canais__lista">
            {whatsapp && <li><a href={whatsapp} target="_blank" rel="noreferrer"><ChatIcon /><span><small>WhatsApp</small>{formatarTelefone(local.contato?.whatsapp)}</span><span aria-hidden className="arrow arrow--diagonal">→</span></a></li>}
            {phone && <li><a href={`tel:${phone.replace(/\D/g, '')}`}><PhoneIcon /><span><small>Telefone</small>{phone}</span><span aria-hidden className="arrow arrow--diagonal">→</span></a></li>}
            {email && <li><a href={`mailto:${email}`}><MailIcon /><span><small>E-mail</small>{email}</span><span aria-hidden className="arrow arrow--diagonal">→</span></a></li>}
            {noContactData && <li><Link href="/#orcamento"><FormIcon /><span><small>Formulário</small>Contar o meu projeto</span><span aria-hidden className="arrow arrow--diagonal">→</span></Link></li>}
          </ul>
        </div>
      </section>
    </main>
  )
}
