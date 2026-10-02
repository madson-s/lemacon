import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

export const metadata = {
  title: 'Localização',
  description: 'A região que a LM atende e como a equipe chega até a sua obra na Chapada Diamantina.',
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


// A página fala da região atendida, não de um endereço: o mapa mostra a Chapada
// Diamantina inteira e o ponto de encontro é combinado antes da visita.
const MAPA_DA_CHAPADA = 'https://www.google.com/maps?q=Chapada%20Diamantina%2C%20Bahia&z=8&output=embed'
const LINK_DA_CHAPADA = 'https://www.google.com/maps/search/?api=1&query=Chapada%20Diamantina%2C%20Bahia'

export default async function LocalizacaoPage() {
  const payload = await getPayload({ config: await config })
  const local = await payload.findGlobal({ slug: 'localizacao', depth: 1 })
  const region = local.regiao?.trim() || 'Toda a Chapada Diamantina'
  const cobertura = local.cobertura
  const cartaoMapa = local.cartaoMapa
  const destaques = (local.destaques ?? []).filter((linha) => linha.valor?.trim())

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
              src={MAPA_DA_CHAPADA}
              title="Mapa do Google Maps centralizado na Chapada Diamantina"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <span className="location-map-stage__veil" aria-hidden />
          <article className="location-map-card">
            <span className="location-map-card__icon"><PinIcon /></span>
            {cartaoMapa?.chapeu && <p className="eyebrow"><i aria-hidden />{cartaoMapa.chapeu}</p>}
            <h2>{region}</h2>
            {cartaoMapa?.semEndereco && <p>{cartaoMapa.semEndereco}</p>}
          </article>
          <a className="location-map-stage__credit" href={LINK_DA_CHAPADA} target="_blank" rel="noreferrer">
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
            <article>
              <span>01</span>
              <div>
                {cobertura?.regiaoRotulo && <small>{cobertura.regiaoRotulo}</small>}
                <h3>{region}</h3>
                {cobertura?.regiaoTexto && <p>{cobertura.regiaoTexto}</p>}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
