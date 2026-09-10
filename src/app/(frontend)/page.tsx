import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { BannerFaixa } from '@/components/BannerFaixa'
import { HomeCatalog, type HomeProduct } from '@/components/HomeCatalog'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

const products: HomeProduct[] = [
  {
    unit: 'Esquadrias',
    category: 'Esquadrias · Portas',
    title: 'Porta de correr em alumínio',
    description: 'Folhas amplas que abrem o ambiente para a vista, com perfil reforçado e rolamento suave.',
    tags: ['Perfil reforçado', 'Vidro laminado', 'Sob medida'],
    image: '/images/home/product-sliding-door.png',
  },
  {
    unit: 'Esquadrias',
    category: 'Esquadrias · Portas',
    title: 'Porta pivotante de entrada',
    description: 'Folha larga com eixo pivotante, acabamento anodizado ou pintado e puxador sob medida.',
    tags: ['Folha ampla', 'Anodizado', 'Puxador sob medida'],
    image: '/images/home/product-pivot-door.png',
  },
  {
    unit: 'Esquadrias',
    category: 'Esquadrias · Janelas',
    title: 'Janela maxim-ar',
    description: 'Abertura projetante que ventila sem ocupar espaço interno, com vedação em escova e borracha.',
    tags: ['Projetante', 'Tela opcional', 'Anodizado'],
    image: '/images/home/product-maxim-ar.png',
  },
  {
    unit: 'Esquadrias',
    category: 'Esquadrias · Janelas',
    title: 'Janela de correr 2 folhas',
    description: 'Linha reforçada com marco amplo, vidro incolor ou verde e trilho de rolamento silencioso.',
    tags: ['2 folhas', 'Marco reforçado', 'Sob medida'],
    image: '/images/home/product-sliding-window.png',
  },
  {
    unit: 'Vidros',
    category: 'Vidros · Fachadas',
    title: 'Fachada pele de vidro',
    description: 'Sistema structural glazing para fachadas contínuas, com vidro refletivo ou incolor.',
    tags: ['Structural glazing', 'Refletivo', 'Comercial'],
    image: '/images/home/product-glass-facade.png',
  },
  {
    unit: 'Construção',
    category: 'Construção · Fachadas',
    title: 'Fachada ventilada com brise',
    description: 'Revestimento em alumínio com brise horizontal, para controle solar e conforto térmico.',
    tags: ['Brise de alumínio', 'Controle solar', 'Térmico'],
    image: '/images/home/product-brise-facade.png',
  },
  {
    unit: 'Esquadrias',
    category: 'Esquadrias · Portas',
    title: 'Porta-balcão sanfonada',
    description: 'Abertura total do vão com folhas que recolhem na lateral, integrando interior e varanda.',
    tags: ['Abertura total', 'Alumínio', 'Vidro temperado'],
    image: '/images/home/product-folding-door.png',
  },
  {
    unit: 'Construção',
    category: 'Construção · Coberturas',
    title: 'Cobertura em pergolado',
    description: 'Estrutura de alumínio com fechamento em policarbonato ou vidro, para áreas externas.',
    tags: ['Vidro livre', 'Policarbonato', 'Externo'],
    image: '/images/home/product-pergola.png',
  },
]

const units = [
  {
    title: 'Esquadrias',
    description: 'Portas, janelas, fachadas e coberturas em alumínio.',
    image: '/images/home/category-doors.png',
    href: '/catalogo?unidade=Esquadrias',
  },
  {
    title: 'Vidros',
    description: 'Box, guarda-corpo, espelhos e coberturas de vidro.',
    image: '/images/home/category-box.png',
    href: '/catalogo?unidade=Vidros',
  },
  {
    title: 'Construção',
    description: 'Projeto, execução, reforma e ampliação com equipe própria.',
    image: '/images/catalog/ampliacao-area-externa.png',
    href: '/catalogo?unidade=Constru%C3%A7%C3%A3o',
  },
]

const heroPromotions = [
  {
    eyebrow: 'Promoção do mês',
    title: 'Fachadas que transformam a chegada',
    support: 'Consulte as condições e a disponibilidade para o seu projeto.',
    image: '/images/home/product-glass-facade.png',
    href: '/catalogo?q=fachada%20pele%20de%20vidro',
    featured: true,
  },
  {
    eyebrow: 'Seleção especial',
    title: 'Mais abertura para integrar ambientes',
    image: '/images/home/product-folding-door.png',
    href: '/catalogo?q=porta-balc%C3%A3o%20sanfonada',
    featured: false,
  },
]

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

  return (
    <>
      <section className="home-hero">
        <Image src="/images/home/hero.png" alt="Casa contemporânea com grandes esquadrias e vista para a Chapada Diamantina" fill priority sizes="100vw" className="home-hero__image" />
        <div className="home-hero__shade" />
        <div className="lm-container home-hero__content">
          <Eyebrow>Catálogo LM</Eyebrow>
          <h1>Tudo o que a LM<br />fabrica, em um<br />só lugar.</h1>
          <div className="button-row">
            <Link href="/catalogo" className="button button--cream">Ver catálogo <Arrow /></Link>
            <Link href="#orcamento" className="button button--dark">Entre em contato <Arrow /></Link>
          </div>
          <aside className="hero-promotions" aria-label="Promoções em destaque">
            {heroPromotions.map((promotion) => (
              <Link
                href={promotion.href}
                className={`hero-promotion-card${promotion.featured ? ' is-featured' : ''}`}
                key={promotion.title}
              >
                <Image src={promotion.image} alt="" fill sizes="(max-width: 1100px) 22vw, 286px" />
                <span className="hero-promotion-card__shade" aria-hidden />
                {promotion.featured && (
                  <span className="hero-promotion-card__badge">
                    <i aria-hidden /> Condição especial
                  </span>
                )}
                <span className="hero-promotion-card__copy">
                  <small>{promotion.eyebrow}</small>
                  <strong>{promotion.title}</strong>
                  {'support' in promotion && promotion.support && <span>{promotion.support}</span>}
                  <em>{promotion.featured ? 'Quero conhecer' : 'Ver seleção'} <Arrow /></em>
                </span>
              </Link>
            ))}
          </aside>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="lm-container">
          <HomeCatalog products={products} />
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
            {units.map((unit) => (
              <Link href={unit.href} key={unit.title} className="unit-card" aria-label={`Abrir a unidade ${unit.title} no catálogo`}>
                <Image src={unit.image} alt={unit.title} fill sizes="(max-width: 800px) 74vw, 270px" />
                <span className="unit-card__copy">
                  <strong>{unit.title}</strong>
                  <small>{unit.description}</small>
                </span>
                <Arrow />
              </Link>
            ))}
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
