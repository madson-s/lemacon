import type { GlobalConfig } from 'payload'

type Dados = {
  endereco?: { logradouro?: string | null; cidade?: string | null } | null
  referencia?: string | null
  horarios?: unknown[] | null
  imagem?: unknown
}

const preenchido = (valor: string | null | undefined) => Boolean(valor?.trim())

// As mesmas regras que a página usa para mostrar cada bloco. O formulário só
// exibe o texto de um bloco quando o bloco vai aparecer no site — senão o campo
// fica lá, editável e sem efeito, e parece que o painel não bate com a página.
const temEndereco = (d: Dados) =>
  preenchido(d?.endereco?.logradouro) && preenchido(d?.endereco?.cidade)
const temCidade = (d: Dados) => preenchido(d?.endereco?.cidade)
const temReferencia = (d: Dados) => preenchido(d?.referencia)
const temVisita = (d: Dados) => (d?.horarios?.length ?? 0) > 0 || Boolean(d?.imagem)

/**
 * Conteúdo da página /localizacao.
 *
 * Endereço e horários são dados que só a LM tem. Nada aqui vem
 * preenchido por chute: a página monta o roteiro de chegada com o que estiver
 * cadastrado e omite cada etapa que ainda estiver vazia, em vez de exibir um
 * endereço inventado — que mandaria um cliente para o lugar errado.
 */
export const Localizacao: GlobalConfig = {
  slug: 'localizacao',
  label: 'Localização',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Página "Localização" do site. Preencha só o que for verdade — o que ficar vazio some da página.',
  },
  fields: [
    {
      // Abas sem nome só organizam o formulário: os campos continuam no topo
      // do documento, então nenhuma coluna do banco muda por causa delas.
      type: 'tabs',
      tabs: [
        {
          label: 'Abertura',
          description: 'O topo da página: título, texto e a região atendida.',
          fields: [
            {
              name: 'chapeu',
              label: 'Chapéu',
              type: 'text',
              defaultValue: 'Onde estamos',
            },
            {
              name: 'titulo',
              label: 'Título',
              type: 'text',
              required: true,
              // O padrão precisa ser verdade com a página ainda vazia: nada aqui promete
              // endereço, rodovia ou WhatsApp antes de esses dados existirem.
              defaultValue: 'Onde encontrar a LM',
              admin: {
                description:
                  'Depois de preencher o endereço, vale reescrever este título falando da visita — algo como "Do asfalto da BR até a nossa porta".',
              },
            },
            {
              name: 'lead',
              label: 'Texto de abertura',
              type: 'textarea',
              defaultValue:
                'Atendemos toda a Chapada Diamantina: projeto, fabricação e instalação chegam até a sua obra. Abaixo estão os canais para falar com a gente.',
              admin: {
                description:
                  'Com o endereço e os horários publicados, troque por um texto que convide o cliente a vir até a base.',
              },
            },
            {
              name: 'regiao',
              label: 'Região atendida',
              type: 'text',
              defaultValue: 'Toda a Chapada Diamantina',
              admin: {
                description:
                  'Onde a LM atende, mesmo longe da sede. Aparece no destaque do topo, no primeiro card da seção "A LM vai até você" e no card do mapa enquanto não houver endereço.',
              },
            },
            {
              name: 'regiaoRotulo',
              label: 'Rótulo da região',
              type: 'text',
              defaultValue: 'Área de atendimento',
              admin: { description: 'Linha pequena acima da região, no destaque do topo.' },
            },
          ],
        },
        {
          label: 'Mapa',
          description: 'O endereço da sede — é ele que posiciona o mapa — e o card por cima dele.',
          fields: [
            {
              name: 'endereco',
              label: 'Endereço',
              type: 'group',
              admin: {
                description:
                  'O endereço da sede. Sem logradouro e cidade preenchidos, o mapa e a rota não aparecem no site.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'logradouro',
                      label: 'Rua / avenida',
                      type: 'text',
                      admin: { width: '70%', placeholder: 'Av. Exemplo' },
                    },
                    {
                      name: 'numero',
                      label: 'Número',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'complemento',
                      label: 'Complemento',
                      type: 'text',
                      admin: { width: '50%', placeholder: 'Galpão 2' },
                    },
                    {
                      name: 'bairro',
                      label: 'Bairro',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cidade',
                      label: 'Cidade',
                      type: 'text',
                      admin: { width: '45%' },
                    },
                    {
                      name: 'estado',
                      label: 'Estado',
                      type: 'text',
                      defaultValue: 'BA',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'cep',
                      label: 'CEP',
                      type: 'text',
                      admin: { width: '35%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'referencia',
              label: 'Ponto de referência',
              type: 'textarea',
              admin: {
                description:
                  'Como quem nunca veio reconhece o lugar: o que tem na esquina, de que lado da pista, o que aparece antes.',
                placeholder: 'Depois do posto, mesmo lado da pista, fachada de vidro.',
              },
            },
            {
              name: 'mapaUrl',
              label: 'Link do mapa',
              type: 'text',
              admin: {
                description:
                  'Opcional. Cole o link do Google Maps da LM se quiser fixar o ponto exato. Vazio, o mapa é montado a partir do endereço acima.',
              },
            },
            {
              name: 'cartaoMapa',
              label: 'Card sobre o mapa',
              type: 'group',
              admin: {
                description:
                  'O card que fica por cima do mapa. Com endereço cadastrado, ele mostra a cidade e o endereço; sem endereço, mostra a região e o texto abaixo.',
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'Ponto de atendimento',
                },
                {
                  name: 'semEndereco',
                  label: 'Texto sem endereço',
                  type: 'textarea',
                  defaultValue:
                    'A equipe combina o melhor ponto de encontro com você antes da visita.',
                  admin: {
                    description:
                      'Aparece no lugar do endereço enquanto ele não estiver cadastrado. Some daqui quando a rua e a cidade forem preenchidas.',
                    condition: (data) => !temEndereco(data as Dados),
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Destaques',
          fields: [
            {
              name: 'destaques',
              label: 'Faixa de destaques',
              labels: { singular: 'Destaque', plural: 'Destaques' },
              type: 'array',
              admin: {
                description:
                  'A faixa logo abaixo do mapa. Linha sem valor não aparece; deixe a lista vazia para esconder a faixa.',
              },
              defaultValue: [
                { rotulo: 'Atendimento', valor: 'Toda a Chapada Diamantina' },
                { rotulo: 'Escopo', valor: 'Projeto · fabricação · instalação' },
                { rotulo: 'Avaliação', valor: 'No local e sem compromisso' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rotulo',
                      label: 'Rótulo',
                      type: 'text',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'valor',
                      label: 'Valor',
                      type: 'text',
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Cobertura',
          fields: [
            {
              name: 'cobertura',
              label: 'Seção "A LM vai até você"',
              type: 'group',
              admin: {
                description:
                  'O texto ao lado dos cards. Cada card só aparece quando o dado dele existe: a região sempre, a base quando houver cidade no endereço, e o ponto de referência quando ele estiver preenchido.',
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'A LM vai até você',
                },
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Da primeira medida à instalação no seu endereço',
                },
                {
                  name: 'texto',
                  label: 'Texto',
                  type: 'textarea',
                  defaultValue:
                    'Antes de fabricar, entendemos o ambiente, os acessos e o uso de cada abertura. Assim, a visita já começa com contexto e termina com uma solução possível de executar.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaTexto',
                      label: 'Texto do botão',
                      type: 'text',
                      defaultValue: 'Conhecer o catálogo',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ctaLink',
                      label: 'Link do botão',
                      type: 'text',
                      defaultValue: '/catalogo',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'regiaoRotulo',
                      label: 'Card da região — rótulo',
                      type: 'text',
                      defaultValue: 'Região atendida',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'regiaoTexto',
                      label: 'Card da região — texto',
                      type: 'text',
                      defaultValue: 'Projeto, fabricação e instalação chegam até a sua obra.',
                      admin: { width: '60%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'baseRotulo',
                      label: 'Card da base — rótulo',
                      type: 'text',
                      defaultValue: 'Base da equipe',
                      admin: { width: '40%', condition: (data) => temCidade(data as Dados) },
                    },
                    {
                      name: 'baseTexto',
                      label: 'Card da base — texto',
                      type: 'text',
                      defaultValue: 'É daqui que saem as peças produzidas pela LM.',
                      admin: { width: '60%', condition: (data) => temCidade(data as Dados) },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'referenciaRotulo',
                      label: 'Card da referência — rótulo',
                      type: 'text',
                      defaultValue: 'Ponto de referência',
                      admin: { width: '40%', condition: (data) => temReferencia(data as Dados) },
                    },
                    {
                      name: 'referenciaTexto',
                      label: 'Card da referência — texto',
                      type: 'text',
                      defaultValue: 'Uma orientação simples para reconhecer a chegada.',
                      admin: { width: '60%', condition: (data) => temReferencia(data as Dados) },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Visita',
          fields: [
            {
              name: 'visita',
              label: 'Seção "Planeje a visita"',
              type: 'group',
              admin: {
                description:
                  'Os textos da seção. Ela só aparece no site com horário ou foto da fachada.',
                condition: (data) => temVisita(data as Dados),
              },
              fields: [
                {
                  name: 'chapeu',
                  label: 'Chapéu',
                  type: 'text',
                  defaultValue: 'Planeje a visita',
                },
                {
                  name: 'titulo',
                  label: 'Título',
                  type: 'text',
                  defaultValue: 'Horário de atendimento',
                },
              ],
            },
            {
              name: 'horarios',
              label: 'Horários de atendimento',
              labels: { singular: 'Horário', plural: 'Horários' },
              type: 'array',
              admin: {
                description: 'Deixe vazio se ainda não quiser publicar horário.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dias',
                      label: 'Dias',
                      type: 'text',
                      required: true,
                      admin: { width: '50%', placeholder: 'Segunda a sexta' },
                    },
                    {
                      name: 'horario',
                      label: 'Horário',
                      type: 'text',
                      required: true,
                      admin: { width: '50%', placeholder: '07h30 às 17h30' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'imagem',
              label: 'Foto da fachada',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Opcional, mas ajuda muito: é por ela que o cliente reconhece o lugar na rua.',
              },
            },
          ],
        },
      ],
    },
  ],
}
