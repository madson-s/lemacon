import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

import { limparMarcadorDev } from './limpar-marcador-dev'
import { MIDIA_DE_PRODUTOS } from './seed-midia'

/** Uma foto: nome do arquivo em `public/produtos/` e o texto alternativo. */
export type Foto = [arquivo: string, alt: string]

export type MidiaDeProduto = {
  produto: string
  capa: Foto
  galeria: Foto[]
}

/**
 * Conteúdo real da LM: marcas, categorias e produtos.
 *
 *   pnpm payload run scripts/seed-lm.ts
 *
 * É idempotente — roda quantas vezes precisar, sem duplicar. Serve para levar
 * a produção o que hoje só existe no banco de desenvolvimento. Não cria preço,
 * foto nem ficha técnica: esses dados são do cliente e entram pelo painel.
 */
const CATEGORIAS: { nome: string; unidade: 'Esquadrias' | 'Vidros' | 'Construção'; descricao: string }[] = [
  {
    nome: 'Telhas Térmicas',
    unidade: 'Construção',
    descricao: 'Telhas com núcleo isolante para conforto térmico e acústico.',
  },
  {
    nome: 'Telhas Metálicas',
    unidade: 'Construção',
    descricao: 'Telhas em aço e alumínio para cobertura e fechamento.',
  },
  {
    nome: 'Telhas Translúcidas',
    unidade: 'Construção',
    descricao: 'Telhas que deixam a luz natural entrar sem abrir o vão.',
  },
  {
    nome: 'Madeira Plástica',
    unidade: 'Construção',
    descricao: 'Perfis e palanques de madeira plástica para cercamento, deck e guarda-corpo.',
  },
  {
    nome: 'Fachadas e Revestimentos',
    unidade: 'Construção',
    descricao: 'Painéis e revestimentos para fachada ventilada e acabamento.',
  },
]

const PRODUTOS: { nome: string; categoria: string; marca: string; descricao: string; tags: string[] }[] = [
  {
    nome: 'Isotelha® Trapezoidal',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao:
      'Recomendada para quem busca conforto térmico com economia de energia e a consequente redução de investimento nos equipamentos de climatização. Vence maiores vãos, economizando na estrutura da cobertura.',
    tags: ['Trapezoidal', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Isotelha® Colonial (5 ondas)',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao:
      'Recomendada para obras que necessitam de diferencial estético. Possui resistência e durabilidade aliadas à estética das telhas coloniais convencionais.',
    tags: ['Colonial', '5 ondas', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Isotelha® Colonial (6 ondas)',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao:
      'Desenvolvida em Cambuí, Minas Gerais, mantém as características da linha com suaves mudanças em suas curvas superiores.',
    tags: ['Colonial', '6 ondas', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Telha Ondulada',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao:
      'A Telha Ondulada PIR AP é recomendada para obras que necessitam de diferencial estético. Possui resistência e durabilidade aliadas à estética das telhas onduladas convencionais.',
    tags: ['Ondulada', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Telha Residence',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao:
      'Solução sofisticada e inovadora, projetada para elevar a qualidade e o estilo da sua cobertura. Modernidade, leveza e encaixe perfeito entre as telhas são algumas das características que fazem dela a opção ideal para a sua casa.',
    tags: ['Residencial', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Colonial (Standard - 5 ondas)',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao:
      'Telha de aço indicada para residências ou construções que têm forro.',
    tags: ['Colonial', '5 ondas', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Colonial (Standard - 6 ondas)',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao:
      'Com design clássico e a resistência do aço-galvalume, é um sistema de cobertura indicado para residências ou construções que possuem forro. Tem baixo custo de aplicação e uma estética diferenciada, que valoriza o imóvel.',
    tags: ['Colonial', '6 ondas', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Isoluz',
    categoria: 'Telhas Translúcidas',
    marca: 'Kingspan',
    descricao:
      'Desenvolvida para ser parte integral da cobertura com as Isotelhas, a Isoluz é uma Isotelha translúcida co-extrudada de policarbonato na espessura de 30 mm. A disposição do policarbonato em seu núcleo permite uma dispersão da luz de até 90%.',
    tags: ['Translúcida', 'Luz natural', 'Kingspan'],
  },
  {
    nome: 'Palanque / Estaca 90x90',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Com os palanques e estacas em madeira plástica In Brasil dá para estruturar a parreira de forma eficiente, com um visual padronizado. Mantenha a propriedade segura, proteja as nascentes de água e deixe algo para as próximas gerações: o palanque não apodrece.',
    tags: ['Madeira plástica', '90x90 mm', 'Parreira', 'Cercamento', 'In Brasil'],
  },
  {
    nome: 'Palanque / Estaca 120x120',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Para embelezar a entrada da sua fazenda, unindo elegância e exclusividade. Com dimensão de 120x120 mm, alia robustez, beleza e durabilidade, e aceita arame liso, arame farpado ou o perfil 136x30 mm para o cercamento. A madeira plástica In Brasil não leva madeira natural na composição e, por isso, não apodrece com a exposição ao tempo.',
    tags: ['Madeira plástica', '120x120 mm', 'Cercamento', 'In Brasil'],
  },
  {
    nome: 'Perfil 136x32',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'O perfil tradicional da In Brasil é multifuncional e vai até onde a sua imaginação levar. Não prolifera fungos e bactérias, garantindo de forma efetiva a saúde e o bem-estar animal, além de trazer beleza e nobreza para a sua propriedade.',
    tags: ['Madeira plástica', '136x32 mm', 'Multiuso', 'In Brasil'],
  },
  {
    nome: 'Perfil 100x32',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Destaca-se pela alta durabilidade e pela beleza, reunindo num só produto as características básicas de um produto de qualidade. Pode ser aplicado na horizontal ou na vertical.',
    tags: ['Madeira plástica', '100x32 mm', 'Horta', 'In Brasil'],
  },
  {
    nome: 'Perfil 220x32',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Com o perfil em madeira plástica In Brasil dá para fabricar portões sob medida, firmes, seguros e resistentes para o acesso às baias de animais. A versatilidade também permite construir escamoteadores para suínos, troncos, balanças, reboques e carrocerias — embelezando produtos que até então só eram lembrados pela funcionalidade.',
    tags: ['Madeira plástica', '220x32 mm', 'Portões', 'Reboques', 'In Brasil'],
  },
  {
    nome: 'Tampa de Coluna 120x120',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Acabamento para o topo das colunas e palanques de 120x120 mm: fecha o perfil, protege o interior da peça e dá arremate à cerca.',
    tags: ['Madeira plástica', '120x120 mm', 'Acabamento', 'In Brasil'],
  },
  {
    nome: 'Tampa de Coluna 90x90',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Acabamento para o topo das colunas e palanques de 90x90 mm: fecha o perfil, protege o interior da peça e dá arremate à cerca.',
    tags: ['Madeira plástica', '90x90 mm', 'Acabamento', 'In Brasil'],
  },
  {
    nome: 'Coluna 90x60',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Ideal para estruturar o piso plástico. As colunas de madeira plástica In Brasil podem ser submetidas à umidade, ficar submersas e ter contato com os dejetos dos animais sem apodrecer nem ressecar. Use apenas produtos de procedência.',
    tags: ['Madeira plástica', '90x60 mm', 'Piso plástico', 'Suínos', 'In Brasil'],
  },
  {
    nome: 'Módulo para Suínos',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Para ter sucesso no confinamento de suínos e cabritos, use os módulos In Brasil, produzidos sob medida conforme o seu projeto. O espaçamento entre os perfis é definido por você, para melhor higienização e conforto dos animais. A madeira plástica In Brasil não sofre com a amônia presente nos dejetos.',
    tags: ['Madeira plástica', 'Suínos', 'Confinamento', 'Sob medida', 'In Brasil'],
  },
  {
    nome: 'Divisória Macho/Fêmea 180x73',
    categoria: 'Madeira Plástica',
    marca: 'In Brasil',
    descricao:
      'Divisória para baias de suínos In Brasil: aplicação rápida e limpeza muito mais fácil. Não prolifera fungos, facilita a manutenção quando necessário e não sofre com a ação dos dejetos dos animais.',
    tags: ['Madeira plástica', '180x73 mm', 'Baias', 'Suínos', 'In Brasil'],
  },
  {
    nome: 'Perfil Ribbon',
    categoria: 'Fachadas e Revestimentos',
    marca: 'Kingspan',
    descricao:
      'Perfil de fixação oculta e resistente às intempéries, para compor desenhos de fachada em vãos grandes ou pequenos.',
    tags: ['Fachada', 'Fixação oculta', 'Revestimento', 'Kingspan'],
  },
  {
    nome: 'Perfil Lystra',
    categoria: 'Fachadas e Revestimentos',
    marca: 'Kingspan',
    descricao:
      'Linha arquitetônica de perfil linear ripado, ideal para criar volume e grafismo no ambiente. Traz a estética natural da madeira e é projetado em aço galvalume para durar uma vida inteira.',
    tags: ['Fachada', 'Revestimento', 'Kingspan'],
  },
]

const MARCAS = ['Kingspan', 'In Brasil']

const payload = await getPayload({ config })

// --- Categorias -----------------------------------------------------------
const { docs: existentes } = await payload.find({ collection: 'categorias', limit: 500, pagination: false })
let ordem = Math.max(0, ...existentes.map((c) => c.ordem ?? 0))
const idPorNome = new Map(existentes.map((c) => [c.nome, c.id]))

for (const cat of CATEGORIAS) {
  const atual = existentes.find((c) => c.nome === cat.nome)
  if (atual) {
    if (atual.unidade !== cat.unidade) {
      await payload.update({ collection: 'categorias', id: atual.id, data: { unidade: cat.unidade } })
      console.log('categoria atualizada:', cat.nome, '->', cat.unidade)
    }
    continue
  }
  ordem += 1
  const doc = await payload.create({ collection: 'categorias', data: { ...cat, ordem } })
  idPorNome.set(doc.nome, doc.id)
  console.log('categoria criada:', doc.nome)
}

// --- Produtos -------------------------------------------------------------
for (const prod of PRODUTOS) {
  const categoriaId = idPorNome.get(prod.categoria)
  if (!categoriaId) {
    console.warn('categoria ausente, produto ignorado:', prod.nome)
    continue
  }
  const achado = await payload.find({ collection: 'produtos', where: { nome: { equals: prod.nome } }, limit: 1 })
  if (achado.docs[0]) {
    // Já existe: sincroniza só o texto, preservando fotos, preço e o que o
    // cliente tenha editado no painel.
    const atual = achado.docs[0]
    if (atual.descricao !== prod.descricao || atual.marca !== prod.marca) {
      await payload.update({
        collection: 'produtos',
        id: atual.id,
        data: { descricao: prod.descricao, marca: prod.marca },
      })
      console.log('produto atualizado:', prod.nome)
    } else {
      console.log('produto já existia:', prod.nome)
    }
    continue
  }
  const doc = await payload.create({
    collection: 'produtos',
    data: {
      nome: prod.nome,
      categoria: categoriaId,
      marca: prod.marca,
      descricao: prod.descricao,
      tags: prod.tags.map((valor) => ({ valor })),
      ativo: true,
    },
  })
  console.log('produto criado:', doc.nome, '->', doc.slug)
}

// --- Faixa de marcas da home ---------------------------------------------
const home = await payload.findGlobal({ slug: 'home' })
const atuais = (home.marcas ?? []).map(({ nome }) => nome)
const faltando = MARCAS.filter((m) => !atuais.includes(m))
if (faltando.length > 0) {
  await payload.updateGlobal({
    slug: 'home',
    data: { marcas: [...atuais, ...faltando].map((nome) => ({ nome })) },
  })
  console.log('marcas adicionadas:', faltando.join(', '))
}

// --- Fotos dos produtos ---------------------------------------------------
// Só sobe o que falta: uma foto já associada é deixada como está, para não
// duplicar mídia nem sobrescrever o que foi trocado pelo painel.
const PASTA_FOTOS = path.resolve(process.cwd(), 'public/produtos')

const subirFoto = async ([arquivo, alt]: Foto) => {
  const achado = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  if (achado.docs[0]) return achado.docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(PASTA_FOTOS, arquivo),
  })
  return doc.id
}

for (const midia of MIDIA_DE_PRODUTOS) {
  const achado = await payload.find({ collection: 'produtos', where: { nome: { equals: midia.produto } }, limit: 1 })
  const produto = achado.docs[0]
  if (!produto) {
    console.warn('produto ausente, fotos ignoradas:', midia.produto)
    continue
  }
  if (produto.imagem) continue

  const capa = await subirFoto(midia.capa)
  const galeria: number[] = []
  for (const foto of midia.galeria) galeria.push(await subirFoto(foto))

  await payload.update({ collection: 'produtos', id: produto.id, data: { imagem: capa, galeria } })
  console.log('fotos aplicadas:', midia.produto, `(1 capa + ${galeria.length})`)
}

console.log('seed concluído')
await limparMarcadorDev(payload)

process.exit(0)
