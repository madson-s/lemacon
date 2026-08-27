import type { ProdutoItem } from '@/lib/produtos'

export const catalogUnits = ['Todas', 'Esquadrias', 'Vidros', 'Construção'] as const
export const catalogCategories = ['Todas', 'Portas', 'Janelas', 'Fachadas', 'Coberturas', 'Box', 'Guarda-corpo', 'Espelhos', 'Obra', 'Projeto'] as const

export type CatalogUnit = (typeof catalogUnits)[number]
export type CatalogCategory = (typeof catalogCategories)[number]

export type CatalogProduct = {
  id: string
  slug: string
  unit: Exclude<CatalogUnit, 'Todas'>
  category: Exclude<CatalogCategory, 'Todas'>
  name: string
  description: string
  image: string
  imageAlt: string
  tags: string[]
}

const productCategories = catalogCategories.filter(
  (candidate): candidate is CatalogProduct['category'] => candidate !== 'Todas',
)

const product = (
  slug: string,
  unit: CatalogProduct['unit'],
  category: CatalogProduct['category'],
  name: string,
  description: string,
  tags: string[],
): CatalogProduct => ({
  id: slug,
  slug,
  unit,
  category,
  name,
  description,
  image: `/images/catalog/${slug}.png`,
  imageAlt: name,
  tags,
})

export const catalogProducts: CatalogProduct[] = [
  product('porta-correr', 'Esquadrias', 'Portas', 'Porta de correr em alumínio', 'Folhas amplas que abrem o ambiente para a vista, com perfil reforçado e rolamento suave.', ['Perfil reforçado', 'Vidro laminado', 'Sob medida']),
  product('porta-pivotante', 'Esquadrias', 'Portas', 'Porta pivotante de entrada', 'Folha larga com eixo pivotante, acabamento anodizado ou pintado e puxador sob medida.', ['Folha ampla', 'Anodizado', 'Puxador sob medida']),
  product('porta-sanfonada', 'Esquadrias', 'Portas', 'Porta-balcão sanfonada', 'Abertura total do vão com folhas que recolhem na lateral, integrando interior e varanda.', ['Abertura total', 'Alumínio', 'Vidro temperado']),
  product('janela-maxim-ar', 'Esquadrias', 'Janelas', 'Janela maxim-ar', 'Abertura projetante que ventila sem ocupar espaço interno, com vedação em escova e borracha.', ['Projetante', 'Tela opcional', 'Anodizado']),
  product('janela-correr', 'Esquadrias', 'Janelas', 'Janela de correr 2 folhas', 'Linha reforçada com marco amplo, vidro incolor ou verde e trilho de rolamento silencioso.', ['2 folhas', 'Marco reforçado', 'Sob medida']),
  product('fachada-pele-vidro', 'Esquadrias', 'Fachadas', 'Fachada pele de vidro', 'Sistema structural glazing para fachadas contínuas, com vidro refletivo ou incolor.', ['Structural glazing', 'Refletivo', 'Comercial']),
  product('fachada-brise', 'Esquadrias', 'Fachadas', 'Fachada ventilada com brise', 'Revestimento em alumínio com brise horizontal, para controle solar e conforto térmico.', ['Brise de alumínio', 'Controle solar', 'Térmico']),
  product('cobertura-pergolado', 'Esquadrias', 'Coberturas', 'Cobertura em pergolado', 'Estrutura de alumínio com fechamento em policarbonato ou vidro, para áreas externas.', ['Vão livre', 'Policarbonato/vidro', 'Externo']),
  product('box-temperado', 'Vidros', 'Box', 'Box em vidro temperado', 'Vidro temperado de 8 mm com ferragens em inox, no modelo de correr ou fixo.', ['Temperado 8 mm', 'Ferragens inox', 'De correr']),
  product('box-fixo', 'Vidros', 'Box', 'Box fixo minimalista', 'Painel fixo em vidro temperado com ferragem oculta, para um banheiro de linhas limpas.', ['8 mm', 'Ferragem oculta', 'Incolor']),
  product('guarda-corpo-vidro', 'Vidros', 'Guarda-corpo', 'Guarda-corpo de vidro', 'Vidro temperado de 10 mm com fixação em torre ou botão, para sacadas e escadas.', ['Temperado 10 mm', 'Torre ou botão', 'Sacada']),
  product('guarda-corpo-escada', 'Vidros', 'Guarda-corpo', 'Guarda-corpo de escada', 'Painéis de vidro com fixação lateral e corrimão em inox, seguindo o desenho da escada.', ['Fixação lateral', 'Corrimão inox', '10 mm']),
  product('espelho', 'Vidros', 'Espelhos', 'Espelho sob medida', 'Espelho com bordas lapidadas e instalação colada ou com botão, no tamanho do ambiente.', ['Bordas lapidadas', 'Instalação colada', 'Sob medida']),
  product('cobertura-vidro', 'Vidros', 'Coberturas', 'Cobertura de vidro', 'Vidro laminado sobre estrutura de alumínio, para cobrir áreas externas sem perder luz.', ['Vidro laminado', 'Estrutura alumínio', 'Externo']),
  product('execucao-reforma', 'Construção', 'Obra', 'Execução e reforma', 'Obra, reforma e ampliação com projeto e medição da engenharia LM e equipe própria.', ['Projeto técnico', 'Equipe própria', 'Prazo definido']),
  product('projeto-medicao', 'Construção', 'Projeto', 'Projeto e medição', 'Levantamento no local, detalhamento técnico e especificação assinados pela engenharia LM.', ['Levantamento', 'Detalhamento', 'Engenharia LM']),
  product('ampliacao-area-externa', 'Construção', 'Obra', 'Ampliação e área externa', 'Ampliação e áreas externas com integração de esquadrias e vidros no mesmo projeto.', ['Área externa', 'Integração', 'Acabamento']),
]

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

export function mergePublishedProducts(published: ProdutoItem[]): CatalogProduct[] {
  if (published.length === 0) return catalogProducts

  return published.map((item) => {
    const designed = catalogProducts.find((candidate) => normalize(candidate.name) === normalize(item.nome))
    if (designed) {
      return {
        ...designed,
        id: item.id,
        slug: item.slug ?? designed.slug,
        description: item.descricao ?? designed.description,
        image: item.imagemUrl ?? designed.image,
        imageAlt: item.imagemAlt || designed.imageAlt,
        tags: item.tags.length > 0 ? item.tags : designed.tags,
      }
    }

    const categoryName = item.categoriaNome ?? 'Projeto'
    const category = productCategories.find((candidate) => normalize(categoryName).includes(normalize(candidate))) ?? 'Projeto'
    const unit: CatalogProduct['unit'] = /vidro|box|espelho|guarda/i.test(categoryName)
      ? 'Vidros'
      : /obra|projeto|constru/i.test(categoryName)
        ? 'Construção'
        : 'Esquadrias'

    return {
      id: item.id,
      slug: item.slug ?? item.id,
      unit,
      category,
      name: item.nome,
      description: item.descricao ?? 'Projeto executado sob medida pela equipe LM.',
      image: item.imagemUrl ?? '/images/catalog/catalog-hero.png',
      imageAlt: item.imagemAlt || item.nome,
      tags: item.tags,
    }
  })
}
