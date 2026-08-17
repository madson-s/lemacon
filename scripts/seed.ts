import sharp from 'sharp'
import { getPayload } from 'payload'

import type { Categoria, Produto } from '../src/payload-types'
import config from '../src/payload.config'

/**
 * Dados de teste para conferir o catálogo, a busca e a página de produto.
 *   pnpm payload run scripts/seed.ts                 -> só semeia se o catálogo estiver vazio
 *   SEED_RESET=1 pnpm payload run scripts/seed.ts    -> apaga produtos/categorias/mídia e semeia de novo
 *
 * É variável de ambiente e não flag porque o `payload run` não repassa argv para o script.
 *
 * As fotos são placeholders gerados na hora (retângulos coloridos com o nome da peça),
 * só para as telas terem imagem real sem precisar de arquivos no repositório.
 */
const categorias = [
  {
    nome: 'Móveis',
    ordem: 1,
    descricao: 'Peças de mobiliário para casa e escritório.',
    cor: '#8b6f52',
  },
  {
    nome: 'Iluminação',
    ordem: 2,
    descricao: 'Luminárias, pendentes e abajures.',
    cor: '#b08d3f',
  },
  {
    nome: 'Decoração',
    ordem: 3,
    descricao: 'Objetos e acessórios de ambiente.',
    cor: '#6b7f6e',
  },
]

const produtos = [
  {
    nome: 'Cadeira Estofada Nórdica',
    marca: 'Lindberg',
    categoria: 'Móveis',
    descricao: 'Estrutura em madeira maciça com assento estofado em linho.',
    preco: 890,
    tags: ['cadeira', 'sala de jantar', 'madeira'],
    destaque: true,
    detalhes: [
      'Feita para durar: a estrutura é de madeira maciça com encaixes cavilhados, sem parafuso aparente.',
      'O estofado em linho é removível, o que facilita a limpeza e a troca do tecido anos depois.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'Madeira maciça de freijó' },
      { rotulo: 'Revestimento', valor: 'Linho natural' },
      { rotulo: 'Dimensões', valor: '46 × 52 × 82 cm' },
      { rotulo: 'Peso', valor: '5,4 kg' },
    ],
  },
  {
    nome: 'Mesa de Centro Carvalho',
    marca: 'Marcenaria Vale',
    categoria: 'Móveis',
    descricao: 'Tampo em carvalho natural com acabamento fosco.',
    preco: 1450.9,
    tags: ['mesa', 'sala de estar'],
    destaque: false,
    detalhes: [
      'O tampo é lâmina de carvalho sobre MDF, escolha que evita o empenamento comum em tampos maciços largos.',
      'O acabamento fosco à base de água não deixa brilho e pode ser retocado com lixa fina.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'Carvalho sobre MDF' },
      { rotulo: 'Acabamento', valor: 'Verniz fosco à base de água' },
      { rotulo: 'Dimensões', valor: '110 × 60 × 40 cm' },
    ],
  },
  {
    nome: 'Estante Modular',
    marca: 'Cubo',
    categoria: 'Móveis',
    descricao: 'Seis nichos, montagem sem ferramentas.',
    preco: null,
    tags: ['estante', 'organização', 'nicho'],
    destaque: false,
    detalhes: [
      'Os módulos encaixam por pressão e podem ser empilhados na horizontal ou na vertical.',
      'Preço sob consulta porque a configuração é fechada com o cliente: o número de módulos varia.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'MDF revestido' },
      { rotulo: 'Módulos', valor: '6 nichos' },
      { rotulo: 'Montagem', valor: 'Encaixe, sem ferramentas' },
    ],
  },
  {
    nome: 'Pendente de Vidro Fosco',
    marca: 'Lumini',
    categoria: 'Iluminação',
    descricao: 'Cúpula em vidro jateado, soquete E27.',
    preco: 320,
    tags: ['pendente', 'luminária', 'teto'],
    destaque: true,
    detalhes: [
      'O vidro jateado espalha a luz sem ofuscar, o que faz diferença em mesa de jantar e bancada.',
      'Acompanha 1,5 m de cabo têxtil, encurtável no momento da instalação.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'Vidro jateado e metal' },
      { rotulo: 'Soquete', valor: 'E27' },
      { rotulo: 'Potência máxima', valor: '15 W (LED)' },
      { rotulo: 'Cabo', valor: '1,5 m têxtil' },
    ],
  },
  {
    nome: 'Abajur de Mesa Latão',
    marca: 'Brass & Co',
    categoria: 'Iluminação',
    descricao: 'Base em latão escovado com cúpula de tecido.',
    preco: 265.5,
    tags: ['abajur', 'luminária', 'criado-mudo'],
    destaque: false,
    detalhes: [
      'O latão escovado ganha pátina com o tempo — é esperado, não é defeito.',
      'Interruptor no próprio cabo, a 30 cm da base.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'Latão escovado' },
      { rotulo: 'Cúpula', valor: 'Tecido algodão cru' },
      { rotulo: 'Altura', valor: '38 cm' },
    ],
  },
  {
    nome: 'Vaso Cerâmica Artesanal',
    marca: 'Atelier Barro',
    categoria: 'Decoração',
    descricao: 'Peça torneada à mão, esmaltada internamente.',
    preco: 149.9,
    tags: ['vaso', 'cerâmica', 'planta'],
    destaque: false,
    detalhes: [
      'Torneada à mão, então pequenas variações de altura e espessura são parte da peça.',
      'O esmalte interno deixa o vaso estanque; pode receber planta com terra direto.',
    ],
    especificacoes: [
      { rotulo: 'Material', valor: 'Cerâmica esmaltada' },
      { rotulo: 'Altura', valor: '24 cm' },
      { rotulo: 'Boca', valor: '12 cm de diâmetro' },
    ],
  },
]

const projetos = [
  {
    titulo: 'Apartamento de 92 m² no Meireles',
    local: 'Meireles, Fortaleza',
    ano: 2025,
    tipo: 'residencial' as const,
    ordem: 1,
    destaque: true,
    cor: '#7a6a58',
    resumo:
      'Sala e jantar integrados num vão estreito, resolvidos sem fechar a passagem nem escurecer o fundo.',
    descricao: [
      'O apartamento tinha 3,4 m de largura na área social — qualquer sofá de encosto alto criava um corredor. Trocamos a barreira por peças de linha baixa e mantivemos a circulação livre de ponta a ponta.',
      'A iluminação foi refeita em três camadas: pendente sobre a mesa, abajur de leitura e luz indireta na estante. À noite o ambiente deixa de depender da luz central.',
    ],
    produtos: ['Cadeira Estofada Nórdica', 'Mesa de Centro Carvalho', 'Pendente de Vidro Fosco'],
  },
  {
    titulo: 'Escritório LM — recepção e sala de reunião',
    local: 'Aldeota, Fortaleza',
    ano: 2025,
    tipo: 'corporativo' as const,
    ordem: 2,
    destaque: true,
    cor: '#5f6b63',
    resumo:
      'Recepção que precisava acomodar espera e reunião rápida no mesmo espaço, sem parecer sala de aula.',
    descricao: [
      'Duas funções no mesmo ambiente pedem separação sem parede. Usamos a estante modular como divisor vazado: separa a espera da mesa de reunião e continua deixando a luz da janela atravessar.',
      'A paleta ficou em madeira clara e latão, para o espaço não cair no cinza corporativo padrão.',
    ],
    produtos: ['Estante Modular', 'Abajur de Mesa Latão'],
  },
  {
    titulo: 'Loja de arquitetura no Bairro de Fátima',
    local: 'Fátima, Fortaleza',
    ano: 2024,
    tipo: 'comercial' as const,
    ordem: 3,
    destaque: false,
    cor: '#6d6070',
    resumo: 'Vitrine e área de atendimento pensadas para a peça exposta ser o que chama, não a placa.',
    descricao: [
      'O ponto tinha pé-direito alto e vitrine voltada para o poente. Recuamos a exposição um metro e usamos o vidro jateado para quebrar o sol da tarde sem escurecer a loja.',
      'O balcão de atendimento saiu do centro: quem entra vê o produto primeiro, o vendedor depois.',
    ],
    produtos: ['Vaso Cerâmica Artesanal', 'Pendente de Vidro Fosco'],
  },
]

const solucoes = [
  {
    titulo: 'Leitura do espaço',
    ordem: 1,
    cor: '#6b6257',
    resumo:
      'Antes de escolher qualquer peça, entender o que o ambiente já tem: proporção, luz natural, circulação e o que trava o uso hoje.',
    descricao: [
      'Uma visita ao local, medição e registro fotográfico. O que sai daqui é um diagnóstico escrito: o que está no lugar certo, o que atrapalha e onde há espaço para ganhar.',
      'É a etapa que evita o erro mais caro do processo — comprar bem uma peça que não cabe naquele ambiente.',
    ],
    entregaveis: [
      'Visita técnica e medição',
      'Diagnóstico escrito do ambiente',
      'Planta de layout com a circulação',
      'Recomendação de prioridades',
    ],
  },
  {
    titulo: 'Projeto de iluminação',
    ordem: 2,
    cor: '#8a7439',
    resumo:
      'Luz em camadas, no lugar da lâmpada central única que achata o ambiente e cansa à noite.',
    descricao: [
      'Definimos três camadas — geral, tarefa e ambiente — e a temperatura de cor de cada uma. O projeto sai com pontos, potências e o tipo de luminária para cada função.',
      'Serve tanto para obra quanto para ambiente pronto: boa parte dos ganhos vem de luminária de piso e mesa, sem quebrar parede.',
    ],
    entregaveis: [
      'Mapa de pontos de luz',
      'Especificação de temperatura e potência',
      'Indicação de luminárias do catálogo',
      'Orientação de instalação',
    ],
  },
  {
    titulo: 'Curadoria de mobiliário',
    ordem: 3,
    cor: '#5f6b63',
    resumo:
      'Seleção de peças que conversam entre si e com o que você já tem — sem trocar a casa inteira.',
    descricao: [
      'A partir do diagnóstico, montamos uma seleção com alternativas em faixas de preço diferentes, para a decisão ser sua e não uma imposição de orçamento único.',
      'Cada indicação vem com medida, material e por que aquela peça resolve aquele ponto do ambiente.',
    ],
    entregaveis: [
      'Seleção com 2 a 3 opções por peça',
      'Ficha com medidas e materiais',
      'Simulação no layout do ambiente',
      'Orçamento consolidado',
    ],
  },
  {
    titulo: 'Execução e montagem',
    ordem: 4,
    cor: '#6d6070',
    resumo: 'Acompanhamento da entrega à montagem, para o ambiente ficar como foi projetado.',
    descricao: [
      'Coordenamos prazos com os fornecedores, recebemos as peças, conferimos e acompanhamos a montagem no dia.',
      'A conferência final é feita contra o projeto — posição, alinhamento e altura —, não contra a nota fiscal.',
    ],
    entregaveis: [
      'Coordenação de prazos e entregas',
      'Conferência das peças no recebimento',
      'Acompanhamento da montagem',
      'Vistoria final contra o projeto',
    ],
  },
]

/** Estado mínimo válido do Lexical com um parágrafo por string. */
const richText = (paragrafos: string[]): NonNullable<Produto['detalhes']> => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragrafos.map((texto) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [
        {
          type: 'text',
          text: texto,
          format: 0,
          style: '',
          mode: 'normal',
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})

const placeholder = (texto: string, cor: string, variacao: number): Promise<Buffer> => {
  const tons = ['', '#00000022', '#ffffff22']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
    <rect width="1200" height="1200" fill="${cor}"/>
    ${tons[variacao] ? `<rect width="1200" height="1200" fill="${tons[variacao]}"/>` : ''}
    <circle cx="${300 + variacao * 300}" cy="${400 + variacao * 150}" r="260" fill="#ffffff1f"/>
    <text x="600" y="1080" font-family="Helvetica, Arial, sans-serif" font-size="56"
          fill="#ffffff" text-anchor="middle">${texto}</text>
  </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}

const payload = await getPayload({ config })
const reset = process.env.SEED_RESET === '1'

const existentes = await payload.count({ collection: 'produtos' })

if (existentes.totalDocs > 0 && !reset) {
  payload.logger.info(
    `Já existem ${existentes.totalDocs} produtos — seed ignorado. Use SEED_RESET=1 para recomeçar.`,
  )
  process.exit(0)
}

if (reset) {
  payload.logger.info('Limpando trabalhos, soluções, produtos, categorias e mídia...')
  // Trabalhos primeiro: eles apontam para produtos.
  for (const collection of ['projetos', 'solucoes', 'produtos', 'categorias', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
}

const idsPorCategoria = new Map<string, Categoria['id']>()
const corPorCategoria = new Map<string, string>()

for (const { cor, ...categoria } of categorias) {
  const criada = await payload.create({ collection: 'categorias', data: categoria })
  idsPorCategoria.set(categoria.nome, criada.id)
  corPorCategoria.set(categoria.nome, cor)
}

const idsPorProduto = new Map<string, number>()

for (const { categoria, tags, detalhes, ...resto } of produtos) {
  const cor = corPorCategoria.get(categoria)!

  // Uma imagem principal + duas de galeria, para a página de produto ter o que mostrar.
  const fotos = await Promise.all(
    [0, 1, 2].map(async (variacao) => {
      const data = await placeholder(resto.nome, cor, variacao)
      return payload.create({
        collection: 'media',
        data: { alt: `${resto.nome} — foto ${variacao + 1}` },
        file: {
          data,
          mimetype: 'image/png',
          name: `${resto.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${variacao + 1}.png`,
          size: data.length,
        },
      })
    }),
  )

  const criado = await payload.create({
    collection: 'produtos',
    data: {
      ...resto,
      categoria: idsPorCategoria.get(categoria)!,
      tags: tags.map((valor) => ({ valor })),
      detalhes: richText(detalhes),
      imagem: fotos[0].id,
      galeria: fotos.slice(1).map((f) => f.id),
      ativo: true,
    },
  })

  idsPorProduto.set(resto.nome, criado.id)
}

for (const { cor, descricao, entregaveis, ...resto } of solucoes) {
  const data = await placeholder(resto.titulo, cor, 0)
  const foto = await payload.create({
    collection: 'media',
    data: { alt: resto.titulo },
    file: {
      data,
      mimetype: 'image/png',
      name: `solucao-${resto.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      size: data.length,
    },
  })

  await payload.create({
    collection: 'solucoes',
    data: {
      ...resto,
      descricao: richText(descricao),
      entregaveis: entregaveis.map((item) => ({ item })),
      imagem: foto.id,
      publicado: true,
    },
  })
}

for (const { cor, descricao, produtos: pecas, ...resto } of projetos) {
  // Capa + três ângulos, que é o que o bloco da página de trabalhos exibe.
  const fotos = await Promise.all(
    [0, 1, 2, 3].map(async (variacao) => {
      const data = await placeholder(resto.titulo, cor, variacao % 3)
      return payload.create({
        collection: 'media',
        data: { alt: `${resto.titulo} — foto ${variacao + 1}` },
        file: {
          data,
          mimetype: 'image/png',
          name: `projeto-${resto.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${variacao + 1}.png`,
          size: data.length,
        },
      })
    }),
  )

  await payload.create({
    collection: 'projetos',
    data: {
      ...resto,
      descricao: richText(descricao),
      capa: fotos[0].id,
      galeria: fotos.slice(1).map((f) => f.id),
      produtos: pecas.map((nome) => idsPorProduto.get(nome)!).filter(Boolean),
      publicado: true,
    },
  })
}

await payload.updateGlobal({
  slug: 'home',
  data: {
    chapeu: 'Design moderno para ambientes reais',
    titulo: 'O ambiente inteiro muda quando cada escolha tem intenção',
    subtitulo:
      'Móveis, iluminação e decoração de linhas modernas, escolhidos para valorizar o espaço que você já tem — não para competir com ele.',
    ctaTexto: 'Ver o catálogo',
    ctaLink: '/catalogo',
    ctaSecundarioTexto: 'Ver trabalhos executados',
    ctaSecundarioLink: '/trabalhos',
    secaoTrabalhos: {
      chapeu: 'Trabalhos executados',
      titulo: 'Soluções que valorizam o ambiente',
      texto:
        'Cada projeto começa lendo o espaço: proporção, luz e circulação. As peças entram depois, para resolver — não para preencher.',
      ctaTexto: 'Ver todos os trabalhos',
    },
    // Lista fixa, curada à mão: não é derivada dos produtos cadastrados.
    marcas: [
      'Lindberg',
      'Marcenaria Vale',
      'Cubo',
      'Lumini',
      'Brass & Co',
      'Atelier Barro',
      'Casa Nove',
      'Estúdio Raiz',
    ].map((nome) => ({ nome })),
  },
})

payload.logger.info(
  `Seed concluído: ${categorias.length} categorias, ${produtos.length} produtos, ` +
    `${solucoes.length} soluções e ${projetos.length} trabalhos.`,
)
process.exit(0)
