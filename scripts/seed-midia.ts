import type { MidiaDeProduto } from './seed-lm'

/**
 * Fotos dos produtos, geradas a partir do catálogo já montado. Os arquivos ficam
 * em `public/produtos/`, versionados junto do código — sem isso, a mídia viveria
 * só no banco e se perderia com ele.
 */
export const MIDIA_DE_PRODUTOS: MidiaDeProduto[] = [
  {
    produto: 'Coluna 90x60',
    capa: ['coluna-90x60mm_produto.webp', 'Coluna de madeira plástica In Brasil 90x60 mm, vista em perspectiva'],
    galeria: [
      ['coluna-90x60mm_aplicacao-suporte-pisante-suinos-01.webp', 'Colunas de madeira plástica sustentando o piso de baia de suínos'],
      ['coluna-90x60mm_aplicacao-suporte-pisante-suinos-02.webp', 'Estrutura de suporte do piso plástico em granja de suínos'],
      ['coluna-90x60mm_aplicacao-suporte-pisante-suinos-03.webp', 'Vista inferior do piso plástico apoiado em colunas de madeira plástica'],
    ],
  },
  {
    produto: 'Divisória Macho/Fêmea 180x73',
    capa: ['divisoria-macho-femea-180x73mm_produto.webp', 'Divisória macho/fêmea de madeira plástica In Brasil 180x73 mm, mostrando o encaixe lateral'],
    galeria: [
      ['divisoria-macho-femea-180x73mm_aplicacao-granja-suinos-01.webp', 'Baias de suínos divididas por painéis de madeira plástica'],
      ['divisoria-macho-femea-180x73mm_aplicacao-granja-suinos-02.webp', 'Corredor de granja com divisórias de madeira plástica'],
      ['divisoria-macho-femea-180x73mm_aplicacao-granja-suinos-03.webp', 'Detalhe do encaixe entre divisórias em baia de suínos'],
    ],
  },
  {
    produto: 'Isotelha® Colonial (5 ondas)',
    capa: ['isotelha-colonial-01.webp', 'Painel da Isotelha Colonial de 5 ondas na cor cerâmica, em perspectiva, com o núcleo isolante visível na borda'],
    galeria: [
      ['isotelha-colonial-02.webp', 'Vista aérea de telhado extenso em Isotelha Colonial cerâmica sobre residência com varanda e deck'],
      ['isotelha-colonial-03.webp', 'Cobertura em Isotelha Colonial branca sobre residência urbana, vista do terraço vizinho'],
      ['isotelha-colonial-04.webp', 'Casa de campo com telhado em Isotelha Colonial cerâmica, vista aérea com deck e vegetação ao redor'],
    ],
  },
  {
    produto: 'Isotelha® Colonial (6 ondas)',
    capa: ['isotelha-colonial-6-ondas-01.webp', 'Painel da Isotelha Colonial de 6 ondas na cor cerâmica, em perspectiva, com o núcleo isolante visível na borda'],
    galeria: [
      ['isotelha-colonial-6-ondas-02.webp', 'Telhado em Isotelha Colonial na cor marfim, com coletor solar instalado sobre uma das águas'],
      ['isotelha-colonial-6-ondas-03.webp', 'Detalhe do espigão e do encontro das águas em telhado de Isotelha Colonial cerâmica'],
      ['isotelha-colonial-6-ondas-04.webp', 'Cobertura em Isotelha Colonial marfim durante a instalação, vista do beiral'],
    ],
  },
  {
    produto: 'Isotelha® Trapezoidal',
    capa: ['isotelha-trapezoidal-01.webp', 'Painel da Isotelha Trapezoidal em perspectiva, mostrando o perfil trapezoidal e o núcleo isolante entre as duas chapas'],
    galeria: [
      ['isotelha-trapezoidal-02.webp', 'Residência de madeira e vidro com cobertura em Isotelha Trapezoidal branca e grande beiral sobre o deck'],
      ['isotelha-trapezoidal-03.webp', 'Vista aérea de cobertura em Isotelha Trapezoidal sobre residência em estrutura metálica, cercada de mata'],
      ['isotelha-trapezoidal-04.webp', 'Cobertura em Isotelha Trapezoidal em edificação comercial de fachada laranja, vista de cima'],
    ],
  },
  {
    produto: 'Módulo para Suínos',
    capa: ['modulo-para-suinos_produto.webp', 'Módulos de piso para suínos em madeira plástica In Brasil, com perfis alveolados lado a lado'],
    galeria: [
      ['modulo-para-suinos_aplicacao-pisante-suinos-01.webp', 'Baia de suínos com piso modular de madeira plástica'],
      ['modulo-para-suinos_aplicacao-pisante-suinos-02.webp', 'Granja de suínos com piso em módulos de madeira plástica'],
      ['modulo-para-suinos_aplicacao-pisante-suinos-03.webp', 'Detalhe do espaçamento entre perfis do piso para suínos'],
    ],
  },
  {
    produto: 'Palanque / Estaca 120x120',
    capa: ['palanque-estaca-120x120mm_produto.webp', 'Palanque de madeira plástica In Brasil, seção quadrada de 120x120 mm, visto em perspectiva'],
    galeria: [
      ['palanque-estaca-120x120mm_aplicacao-cercado-01.webp', 'Cercamento de pasto com palanques de madeira plástica e arame liso'],
      ['palanque-estaca-120x120mm_aplicacao-cercado-02.webp', 'Cerca de fazenda com palanques e travessas de madeira plástica sobre muro de pedra'],
      ['palanque-estaca-120x120mm_aplicacao-cercado-03.webp', 'Deck e guarda-corpo de madeira plástica à beira de piscina'],
    ],
  },
  {
    produto: 'Palanque / Estaca 90x90',
    capa: ['palanque-estaca-90x90mm_produto.webp', 'Palanque de madeira plástica In Brasil, seção quadrada de 90x90 mm, visto em perspectiva'],
    galeria: [
      ['palanque-estaca-90x90mm_aplicacao-palanque-01.webp', 'Parreira estruturada com palanques de madeira plástica e arame, em vinhedo'],
      ['palanque-estaca-90x90mm_aplicacao-palanque-02.webp', 'Cerca de arame farpado com palanques de madeira plástica dividindo pasto'],
      ['palanque-estaca-90x90mm_aplicacao-cercado-01.webp', 'Cercado de madeira plástica com travessas horizontais em área de manejo'],
    ],
  },
  {
    produto: 'Perfil 100x32',
    capa: ['perfil-100x32mm_produto.webp', 'Perfil de madeira plástica In Brasil 100x32 mm, visto em perspectiva'],
    galeria: [
      ['perfil-100x32mm_aplicacao-horta-01.webp', 'Canteiro de horta contido por perfis de madeira plástica'],
      ['perfil-100x32mm_aplicacao-horta-02.webp', 'Horta com canteiros elevados estruturados em madeira plástica'],
      ['perfil-100x32mm_aplicacao-cercado-01.webp', 'Cercado de madeira plástica em área externa'],
    ],
  },
  {
    produto: 'Perfil 136x32',
    capa: ['perfil-136x32mm_produto.webp', 'Perfil de madeira plástica In Brasil 136x32 mm na cor terracota, mostrando os alvéolos internos na ponta'],
    galeria: [
      ['perfil-136x32mm_aplicacao-cercado-01.webp', 'Cercado de madeira plástica com travessas horizontais em área de manejo'],
      ['perfil-136x32mm_aplicacao-cercado-02.webp', 'Cerca de madeira plástica delimitando piquete'],
      ['perfil-136x32mm_aplicacao-balanca-01.webp', 'Balança de pesagem de animais com piso e laterais em madeira plástica'],
    ],
  },
  {
    produto: 'Perfil 220x32',
    capa: ['perfil-220x32mm_produto.webp', 'Perfil de madeira plástica In Brasil 220x32 mm, visto em perspectiva'],
    galeria: [
      ['perfil-220x32mm_aplicacao-portao-01.webp', 'Portão de acesso fabricado em madeira plástica'],
      ['perfil-220x32mm_aplicacao-reboque-01.webp', 'Carroceria de reboque revestida em madeira plástica'],
      ['perfil-220x32mm_aplicacao-reboque-02.webp', 'Reboque com laterais em madeira plástica'],
    ],
  },
  {
    produto: 'Perfil Lystra',
    capa: ['perfil-lystra-01.webp', 'Perfil Lystra com acabamento amadeirado, em perspectiva, mostrando as ripas e o encaixe lateral'],
    galeria: [
      ['perfil-lystra-02.webp', 'Sala de estar com parede revestida em Perfil Lystra amadeirado, do piso ao teto, com TV embutida'],
      ['perfil-lystra-03.webp', 'Salão de restaurante com parede em Perfil Lystra na cor grafite e iluminação rasante'],
      ['perfil-lystra-04.webp', 'Fachada de residência com revestimento em Perfil Lystra amadeirado ao lado da porta de correr'],
    ],
  },
  {
    produto: 'Perfil Ribbon',
    capa: ['perfil-ribbon-01.webp', 'Perfil Ribbon com acabamento amadeirado, em perspectiva, mostrando a face lisa e a aba de fixação oculta'],
    galeria: [
      ['perfil-ribbon-02.webp', 'Entrada de residência com revestimento em Perfil Ribbon amadeirado, entre portas de vidro e varanda'],
      ['perfil-ribbon-03.webp', 'Empena de residência inteiramente revestida em Perfil Ribbon amadeirado, vista de fora'],
      ['perfil-ribbon-04.webp', 'Interior amplo com paredes revestidas em Perfil Ribbon amadeirado do piso ao teto'],
    ],
  },
  {
    produto: 'Tampa de Coluna 120x120',
    capa: ['tampa-de-coluna-120x120mm_produto.webp', 'Tampa quadrada de madeira plástica In Brasil para coluna de 120x120 mm, em tom amadeirado'],
    galeria: [],
  },
  {
    produto: 'Tampa de Coluna 90x90',
    capa: ['tampa-de-coluna-90x90mm_produto.webp', 'Tampa quadrada de madeira plástica In Brasil para coluna de 90x90 mm, em tom amadeirado'],
    galeria: [],
  },
  {
    produto: 'Telha Colonial (Standard - 5 ondas)',
    capa: ['telha-colonial-6-ondas-01.webp', 'Telha Colonial de 5 ondas na cor cerâmica, em perspectiva, assentada sobre terças metálicas'],
    galeria: [
      ['telha-colonial-6-ondas-02.webp', 'Pousada em estilo enxaimel com cobertura em Telha Colonial cinza'],
      ['telha-colonial-6-ondas-03.webp', 'Detalhe do beiral e do rufo em telhado de Telha Colonial branca'],
      ['telha-colonial-6-ondas-04.webp', 'Vista aérea de conjunto de edificações com cobertura em Telha Colonial cerâmica'],
    ],
  },
  {
    produto: 'Telha Colonial (Standard - 6 ondas)',
    capa: ['telha-colonial-6-ondas-2.webp', 'Telha Colonial de 6 ondas na cor cerâmica, em perspectiva'],
    galeria: [
      ['telha-colonial-6-ondas-3.webp', 'Pousada em estilo enxaimel com cobertura em Telha Colonial cinza'],
      ['telha-colonial-6-ondas-4.webp', 'Detalhe do beiral e do rufo em telhado de Telha Colonial branca'],
      ['telha-colonial-6-ondas-5.webp', 'Vista aérea de conjunto de edificações com cobertura em Telha Colonial cerâmica'],
    ],
  },
  {
    produto: 'Telha Isoluz',
    capa: ['isoluz-01.webp', 'Painel da Telha Isoluz translúcida, em perspectiva, com perfil trapezoidal'],
    galeria: [
      ['isoluz-02.webp', 'Cobertura industrial com faixas de Telha Isoluz iluminando o galpão com luz natural'],
      ['isoluz-03.webp', 'Telha Isoluz vista por baixo em cobertura de área externa, filtrando a luz entre as vigas'],
      ['isoluz-04.webp', 'Faixa de Telha Isoluz sobre estrutura metálica treliçada, vista de dentro do galpão'],
    ],
  },
  {
    produto: 'Telha Ondulada',
    capa: ['telha-ondulada-01.webp', 'Painel da Telha Ondulada na cor cerâmica, em perspectiva, com o núcleo isolante visível na borda'],
    galeria: [
      ['telha-ondulada-02.webp', 'Residência térrea com cobertura em quatro águas de Telha Ondulada cerâmica'],
      ['telha-ondulada-03.webp', 'Fachada de restaurante com cobertura em Telha Ondulada na cor verde'],
      ['telha-ondulada-04.webp', 'Telha Ondulada branca vista por dentro, servindo de forro aparente entre vigas escuras'],
    ],
  },
  {
    produto: 'Telha Residence',
    capa: ['residence-01.webp', 'Desenho técnico da Telha Residence: 1092 mm de largura total, 1047 mm útil, 1178 mm de comprimento total e 1155 mm útil'],
    galeria: [
      ['residence-02.webp', 'Residência com telhado em Telha Residence na cor grafite, vista da fachada'],
      ['residence-03.webp', 'Telha Residence na cor terracota vista de cima, mostrando o encaixe entre as peças'],
      ['residence-04.webp', 'Cobertura extensa em Telha Residence cinza, com mansardas e beiral aparente'],
    ],
  },
]
