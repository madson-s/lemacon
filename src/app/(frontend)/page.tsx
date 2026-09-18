import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { BannerFaixa } from '@/components/BannerFaixa'
import { BannerHero } from '@/components/BannerHero'
import { HomeCatalog, type HomeProduct } from '@/components/HomeCatalog'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import { mergePublishedProducts } from '@/lib/catalogo-design'
import { paraProdutoItem } from '@/lib/produtos'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const units = [
  {
    title: 'Esquadrias',
    description: 'Portas, janelas, fachadas e coberturas em alumínio.',
    image: '/images/home/category-doors.png',
  },
  {
    title: 'Vidros',
    description: 'Box, guarda-corpo, espelhos e coberturas de vidro.',
    image: '/images/home/category-box.png',
  },
  {
    title: 'Construção',
    description: 'Projeto, execução, reforma e ampliação com equipe própria.',
    image: '/images/catalog/ampliacao-area-externa.png',
  },
] as const

const process = [
  { number: '01', title: 'Medição e projeto', text: 'Visitamos o local ou recebemos as suas medidas. Definimos perfil, vidro, ferragens e enviamos o orçamento com prazo fechado.' },
  { number: '02', title: 'Fabricação', text: 'A peça é produzida sob medida pela nossa equipe, no nosso galpão. Você acompanha o andamento pelo WhatsApp.' },
  { number: '03', title: 'Instalação e entrega', text: 'Instalamos, ajustamos o acabamento e conferimos cada detalhe com você antes de encerrar.' },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden className={diagonal ? 'arrow arrow--diagonal' : 'arrow'}>→</span>
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><i aria-hidden />{children}</p>
}

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const home = await payload.findGlobal({ slug: 'home', depth: 1 })

  const { docs: produtos } = await payload.find({
    collection: 'produtos',
    depth: 1,
    limit: 2000,
    pagination: false,
    where: { ativo: { equals: true } },
  })
  const doCatalogo = mergePublishedProducts(produtos.map(paraProdutoItem))
  const porUnidade = doCatalogo.reduce<Record<string, number>>(
    (acc, item) => (item.unit ? { ...acc, [item.unit]: (acc[item.unit] ?? 0) + 1 } : acc),
    {},
  )

  // A vitrine da home é gerenciada pelo painel: mostra os produtos marcados como
  // "Mostrar na home". Sem nenhum marcado, cai nos mais recentes do catálogo,
  // para a seção nunca ficar vazia por esquecimento.
  const marcados = new Set(
    produtos.filter((produto) => produto.destaque).map((produto) => String(produto.id)),
  )
  const vitrine = doCatalogo.filter((item) => marcados.has(item.id))
  const produtosDaHome: HomeProduct[] = (vitrine.length > 0 ? vitrine : doCatalogo)
    .slice(0, 8)
    .map((item) => ({
      unit: item.unit ?? 'Construção',
      category: item.unit ? `${item.unit} · ${item.category}` : item.category,
      title: item.name,
      description: item.description,
      tags: item.tags,
      image: item.image,
    }))

  return (
    <>
      <section className="home-hero">
        <Image src="/images/home/hero.png" alt="Casa contemporânea com grandes esquadrias e vista para a Chapada Diamantina" fill priority sizes="100vw" className="home-hero__image" />
        <div className="home-hero__shade" />
        <div className="lm-container home-hero__content">
          <Eyebrow>Catálogo LM</Eyebrow>
          <h1>Tudo o que a <span className="home-hero__brand-word">LM</span><br />fabrica, em um<br />só lugar.</h1>
          <div className="button-row">
            <Link href="/catalogo" className="button button--cream">Ver catálogo <Arrow /></Link>
            <Link href="#orcamento" className="button button--dark">Entre em contato <Arrow /></Link>
          </div>
          <BannerHero banners={home.bannersHero ?? []} />
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="lm-container">
          <HomeCatalog
            products={produtosDaHome}
            chapeu={home.secaoCatalogo?.chapeu}
            titulo={home.secaoCatalogo?.titulo}
            texto={home.secaoCatalogo?.texto}
          />
        </div>
      </section>

      <section className="unit-section" id="unidades">
        <div className="unit-section__monogram" aria-hidden>
          <Image src="/images/home/category-monogram.png" alt="" width={884} height={884} />
        </div>
        <div className="lm-container unit-section__inner">
          <div className="unit-section__intro">
            <Eyebrow>Explore</Eyebrow>
            <h2>Comece por<br />unidade</h2>
            <Link href="/catalogo" className="button button--gold">Ver catálogo completo <Arrow /></Link>
          </div>
          <HorizontalCarousel trackClassName="unit-grid" label="Unidades do catálogo">
            {units.map((unit) => {
              const total = porUnidade[unit.title] ?? 0

              return (
                <Link
                  href={`/catalogo?unidade=${encodeURIComponent(unit.title)}`}
                  key={unit.title}
                  className="unit-card"
                  aria-label={`Ver ${total === 1 ? '1 item' : `${total} itens`} da unidade ${unit.title} no catálogo`}
                >
                  <Image src={unit.image} alt={unit.title} fill sizes="(max-width: 800px) 74vw, 270px" />
                  <span className="unit-card__copy">
                    <strong>{unit.title}</strong>
                    <small>{unit.description}</small>
                    <em className="unit-card__count">{total === 1 ? '1 item' : `${total} itens`}</em>
                  </span>
                  <Arrow />
                </Link>
              )
            })}
          </HorizontalCarousel>
        </div>
      </section>

      <BannerFaixa banners={home.bannersFaixa1 ?? []} rotulo="Destaques da LM" />

      <section className="group-section" id="grupo-lm">
        <div className="lm-container group-section__grid">
          <div className="group-section__copy">
            <Eyebrow>Grupo LM</Eyebrow>
            <h2>Três frentes, uma equipe</h2>
            <div className="group-section__visual group-section__visual--mobile" aria-label="Residência contemporânea executada pelo Grupo LM" role="img">
              <div className="group-section__image-base">
                <Image src="/images/home/group-house-background.png" alt="" width={1624} height={913} sizes="100vw" />
              </div>
            </div>
            <p>Esquadrias, vidros e obra sob a mesma marca. Quem projeta, quem fabrica e quem instala trabalham juntos — você não coordena três fornecedores.</p>
            <div className="group-lines">
              <article><i aria-hidden /><span><strong>LM Esquadrias de Alumínio</strong>Portas, janelas, fachadas e coberturas.</span></article>
              <article><i aria-hidden /><span><strong>LM Vidros Temperados</strong>Box, guarda-corpo, espelhos e coberturas de vidro.</span></article>
              <article><i aria-hidden /><span><strong>LM Tec Construção</strong>Projeto, execução, reforma e ampliação.</span></article>
            </div>
            <Link href="#orcamento" className="text-link"><Arrow diagonal /> Pedir avaliação no local</Link>
          </div>
          <div className="group-section__visual group-section__visual--desktop" aria-label="Residência contemporânea executada pelo Grupo LM" role="img">
            <div className="group-section__image-base">
              <Image src="/images/home/group-house-background.png" alt="" width={1624} height={913} sizes="(max-width: 900px) 100vw, 1624px" />
            </div>
            <div className="group-section__image-overhang" aria-hidden>
              <Image src="/images/home/group-house-foreground.png" alt="" width={1624} height={913} sizes="(max-width: 900px) 100vw, 1624px" />
            </div>
          </div>
        </div>
      </section>

      <section className="process-section" id="processo">
        <div className="process-section__media">
          <Image src="/images/home/process-background-exact.png" alt="Vista da Chapada Diamantina através de esquadrias" fill sizes="147vw" />
        </div>
        <div className="process-section__shade" />
        <div className="lm-container process-section__inner">
          <div className="process-section__intro">
            <Eyebrow>Como funciona</Eyebrow>
            <h2>Três passos<br />até a instalação</h2>
            <div className="button-row"><Link href="/catalogo" className="button button--cream">Ver catálogo</Link><Link href="#orcamento" className="button button--dark">Entre em contato</Link></div>
          </div>
          <HorizontalCarousel trackClassName="process-grid" label="Etapas do processo">
            {process.map((step) => <article key={step.number}><div><strong>{step.number}</strong><Arrow diagonal /></div><h3>{step.title}</h3><p>{step.text}</p></article>)}
          </HorizontalCarousel>
        </div>
      </section>

      <BannerFaixa banners={home.bannersFaixa2 ?? []} rotulo="Mais destaques da LM" />

      <section className="contact-section" id="orcamento">
        <div className="lm-container contact-section__grid">
          <div className="contact-card">
            <Eyebrow>Orçamento</Eyebrow>
            <h2>Conte o seu<br />projeto</h2>
            <p>Envie as medidas ou peça uma avaliação no local. Retornamos com a especificação e o orçamento pelo WhatsApp.</p>
            <a className="button button--gold" href="https://wa.me/" target="_blank" rel="noreferrer">Falar no WhatsApp <Arrow /></a>
            <dl><div><dt>Atendimento</dt><dd>Toda a Chapada Diamantina</dd></div><div><dt>Escopo</dt><dd>Projeto · fabricação · instalação</dd></div><div><dt>Avaliação</dt><dd>Sem compromisso</dd></div></dl>
          </div>
          <form className="contact-form" action="#orcamento">
            <label>Nome<input name="nome" type="text" placeholder="Como podemos chamar você" /></label>
            <label>Telefone / WhatsApp<input name="telefone" type="tel" placeholder="(00) 0 0000-0000" /></label>
            <label>Unidade de interesse<select name="unidade" defaultValue="Esquadrias de alumínio"><option>Esquadrias de alumínio</option><option>Vidros temperados</option><option>Tec Construção</option></select></label>
            <label>Mensagem<textarea name="mensagem" placeholder="Descreva o ambiente, as medidas ou o que precisa" /></label>
            <button type="submit" className="button button--dark">Solicitar orçamento</button>
            <small>Seus dados ficam protegidos e não são compartilhados.</small>
          </form>
        </div>
      </section>
    </>
  )
}
