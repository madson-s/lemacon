import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { enderecoEmLinhas, linkDaRota, mapaIncorporado, temEndereco } from '@/lib/localizacao'
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

export default async function LocalizacaoPage() {
  const payload = await getPayload({ config: await config })
  const local = await payload.findGlobal({ slug: 'localizacao', depth: 1 })
  const address = local.endereco
  const addressLines = enderecoEmLinhas(address)
  const route = linkDaRota(local.mapaUrl, address)
  const hours = local.horarios ?? []
  const facade = urlDaMedia(local.imagem, 'card')
  const city = address?.cidade?.trim()
    ? [address.cidade.trim(), address.estado?.trim()].filter(Boolean).join(' — ')
    : ''
  const region = local.regiao?.trim() || 'Toda a Chapada Diamantina'
  // Com endereço cadastrado o mapa aponta para a base; sem ele, mostra a região
  // atendida, que é o que a página tem de verdade para dizer.
  const chapadaGoogleMap = 'https://www.google.com/maps?q=Chapada%20Diamantina%2C%20Bahia&z=8&output=embed'
  const mapEmbed = mapaIncorporado(local.mapaUrl, address) ?? chapadaGoogleMap
  const mapTitle = temEndereco(address)
    ? `Mapa do Google Maps com a localização da LM em ${city || region}`
    : 'Mapa do Google Maps centralizado na Chapada Diamantina'
  const mapLink =
    route ??
    'https://www.google.com/maps/search/?api=1&query=Chapada%20Diamantina%2C%20Bahia'

  const cobertura = local.cobertura
  const cartaoMapa = local.cartaoMapa
  const visita = local.visita
  const destaques = (local.destaques ?? []).filter((linha) => linha.valor?.trim())

  // Cada card só existe quando o dado dele existe; rótulo e texto vêm do painel.
  const locationCards = [
    {
      label: cobertura?.regiaoRotulo ?? '',
      title: region,
      text: cobertura?.regiaoTexto ?? '',
    },
    city && {
      label: cobertura?.baseRotulo ?? '',
      title: city,
      text: cobertura?.baseTexto ?? '',
    },
    local.referencia?.trim() && {
      label: cobertura?.referenciaRotulo ?? '',
      title: local.referencia.trim(),
      text: cobertura?.referenciaTexto ?? '',
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
            <p>{local.regiaoRotulo && <small>{local.regiaoRotulo}</small>}<strong>{region}</strong></p>
          </div>
        </div>

        <div className="lm-container location-map-stage">
          <div className="location-map-stage__media">
            <iframe
              src={mapEmbed}
              title={mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <span className="location-map-stage__veil" aria-hidden />
          <article className="location-map-card">
            <span className="location-map-card__icon"><PinIcon /></span>
            {cartaoMapa?.chapeu && <p className="eyebrow"><i aria-hidden />{cartaoMapa.chapeu}</p>}
            <h2>{city || region}</h2>
            {temEndereco(address) ? <p>{addressLines.join(' · ')}</p> : cartaoMapa?.semEndereco && <p>{cartaoMapa.semEndereco}</p>}
            {route && <a href={route} target="_blank" rel="noreferrer">Abrir no mapa <span aria-hidden>→</span></a>}
          </article>
          <a className="location-map-stage__credit" href={mapLink} target="_blank" rel="noreferrer">
            Abrir no Google Maps
          </a>
        </div>

        {destaques.length > 0 && (
          <dl className="lm-container location-stats">
            {destaques.map((linha) => (
              <div key={linha.id ?? linha.rotulo}><dt>{linha.rotulo}</dt><dd>{linha.valor}</dd></div>
            ))}
          </dl>
        )}
      </section>

      <section className="location-coverage">
        <div className="lm-container location-coverage__grid">
          <div className="location-coverage__copy">
            {cobertura?.chapeu && <p className="eyebrow"><i aria-hidden />{cobertura.chapeu}</p>}
            {cobertura?.titulo && <h2>{cobertura.titulo}</h2>}
            {cobertura?.texto && <p>{cobertura.texto}</p>}
            {cobertura?.ctaTexto && (
              <Link href={cobertura.ctaLink || '/catalogo'} className="button button--dark">{cobertura.ctaTexto} <span aria-hidden>→</span></Link>
            )}
          </div>
          <div className="location-coverage__cards">
            {locationCards.map((card, index) => (
              <article key={card.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>{card.label && <small>{card.label}</small>}<h3>{card.title}</h3>{card.text && <p>{card.text}</p>}</div>
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
                {visita?.chapeu && <p className="eyebrow"><i aria-hidden />{visita.chapeu}</p>}
                <h2><ClockIcon /> {visita?.titulo || 'Horário de atendimento'}</h2>
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

    </main>
  )
}
