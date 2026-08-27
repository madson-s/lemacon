import Image from 'next/image'
import Link from 'next/link'

import { HomeCatalog, type HomeProduct } from '@/components/HomeCatalog'
import { HorizontalCarousel } from '@/components/HorizontalCarousel'

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

const categories = [
  { title: 'Fachadas de vidro', image: '/images/home/category-facades.png', href: '/catalogo?q=fachada' },
  { title: 'Portas & janelas', image: '/images/home/category-doors.png', href: '/catalogo?q=porta%20janela' },
  { title: 'Box & espelhos', image: '/images/home/category-box.png', href: '/catalogo?q=box%20espelho' },
  { title: 'Guarda-corpo', image: '/images/home/category-railings.png', href: '/catalogo?q=guarda-corpo' },
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

export default function HomePage() {
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
          <div className="hero-features">
            <Link href="/catalogo?q=fachada%20pele%20de%20vidro" aria-label="Ver fachada pele de vidro no catálogo">
              <Image src="/images/home/product-glass-facade.png" alt="Fachada pele de vidro" width={64} height={81} />
              <span><small>Direto da fábrica</small>Fachada pele de vidro</span>
              <Arrow diagonal />
            </Link>
            <Link href="/catalogo?q=porta-balc%C3%A3o%20sanfonada" aria-label="Ver porta-balcão sanfonada no catálogo">
              <Image src="/images/home/product-folding-door.png" alt="Porta-balcão sanfonada integrando sala e varanda" width={64} height={81} />
              <span><small>Integração total</small>Porta-balcão sanfonada</span>
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="lm-container">
          <HomeCatalog products={products} />
        </div>
      </section>

      <section className="category-section" id="categorias">
        <div className="category-section__monogram" aria-hidden>
          <Image src="/images/home/category-monogram.png" alt="" width={884} height={884} />
        </div>
        <div className="lm-container category-section__inner">
          <div className="category-section__intro">
            <Eyebrow>Explore</Eyebrow>
            <h2>Comece por<br />categoria</h2>
            <Link href="/catalogo" className="button button--gold">Ver catálogo completo <Arrow /></Link>
          </div>
          <HorizontalCarousel trackClassName="category-grid" label="Categorias do catálogo">
            {categories.map((category) => (
              <Link href={category.href} key={category.title} className="category-card" aria-label={`Abrir ${category.title} no catálogo`}>
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 800px) 50vw, 196px" />
                <span className="category-card__label">{category.title}</span><Arrow />
              </Link>
            ))}
          </HorizontalCarousel>
        </div>
      </section>

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
