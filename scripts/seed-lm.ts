import { getPayload } from 'payload'

import config from '../src/payload.config'

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
    descricao: 'Telha térmica com perfil trapezoidal, para coberturas de baixa inclinação e grandes vãos.',
    tags: ['Trapezoidal', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Isotelha® Colonial (5 ondas)',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao: 'Telha térmica com desenho colonial de 5 ondas, unindo estética tradicional e isolamento.',
    tags: ['Colonial', '5 ondas', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Isotelha® Colonial (6 ondas)',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao: 'Telha térmica com desenho colonial de 6 ondas, para maior cobertura útil por peça.',
    tags: ['Colonial', '6 ondas', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Telha Ondulada',
    categoria: 'Telhas Térmicas',
    marca: 'Kingspan',
    descricao: 'Telha térmica ondulada, indicada para cobertura e fechamento lateral.',
    tags: ['Ondulada', 'Isolamento térmico', 'Kingspan'],
  },
  {
    nome: 'Telha Residence',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao: 'Telha metálica com perfil residencial, para coberturas aparentes com acabamento uniforme.',
    tags: ['Residencial', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Colonial (Standard - 5 ondas)',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao: 'Telha metálica colonial de 5 ondas, no perfil padrão, com o desenho tradicional em aço.',
    tags: ['Colonial', '5 ondas', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Colonial (Standard - 6 ondas)',
    categoria: 'Telhas Metálicas',
    marca: 'Kingspan',
    descricao: 'Telha metálica colonial de 6 ondas, no perfil padrão, para maior cobertura útil por peça.',
    tags: ['Colonial', '6 ondas', 'Metálica', 'Kingspan'],
  },
  {
    nome: 'Telha Isoluz',
    categoria: 'Telhas Translúcidas',
    marca: 'Kingspan',
    descricao: 'Telha translúcida que leva luz natural para dentro da cobertura, sem abrir o vão.',
    tags: ['Translúcida', 'Luz natural', 'Kingspan'],
  },
  {
    nome: 'Perfil Lystra',
    categoria: 'Fachadas e Revestimentos',
    marca: 'Kingspan',
    descricao: 'Perfil para fachada e revestimento, com encaixe aparente e acabamento arquitetônico.',
    tags: ['Fachada', 'Revestimento', 'Kingspan'],
  },
]

const MARCAS = ['Kingspan']

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
    console.log('produto já existia:', prod.nome)
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

console.log('seed concluído')
process.exit(0)
