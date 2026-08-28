import type { GlobalConfig } from 'payload'

/**
 * Conteúdo da página /sobre. É um global porque a página é um documento único.
 *
 * Os campos vêm vazios de propósito onde o dado é da empresa e ninguém pode
 * inventar por ela (ano de fundação, cidade, tamanho e nomes da equipe): a
 * página esconde a seção inteira em vez de mostrar um valor de mentira.
 */
export const Sobre: GlobalConfig = {
  slug: 'sobre',
  label: 'Sobre',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Página "Sobre" do site. O que estiver vazio aqui simplesmente não aparece lá. FALTAM DOIS BLOCOS: "História e origem" e "Equipe" — enquanto não forem preenchidos, a página mostra só o que a LM executa.',
  },
  fields: [
    {
      name: 'chapeu',
      label: 'Chapéu',
      type: 'text',
      defaultValue: 'Sobre a LM',
      admin: {
        description: 'Linha curta acima do título.',
      },
    },
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      defaultValue: 'Quem desenha, fabrica e instala é a mesma equipe',
    },
    {
      name: 'lead',
      label: 'Texto de abertura',
      type: 'textarea',
      defaultValue:
        'A LM projeta, produz no próprio galpão e instala com equipe própria. É por isso que conseguimos fechar prazo, ajustar o acabamento na hora e responder por tudo depois da entrega.',
    },
    {
      name: 'imagem',
      label: 'Imagem de abertura',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Uma foto da equipe, do galpão ou de uma obra entregue.',
      },
    },
    {
      name: 'ficha',
      label: 'Ficha da empresa',
      labels: { singular: 'Linha da ficha', plural: 'Linhas da ficha' },
      type: 'array',
      admin: {
        description:
          'Os dados objetivos da LM, na mesma leitura de uma ficha técnica de produto. Preencha só o que for verdade — linha sem valor não aparece no site.',
      },
      defaultValue: [
        { rotulo: 'Atendimento', valor: 'Toda a Chapada Diamantina' },
        { rotulo: 'Escopo', valor: 'Projeto · fabricação · instalação' },
        { rotulo: 'Frentes', valor: 'Esquadrias · Vidros · Construção' },
        { rotulo: 'Fabricação', valor: 'Galpão próprio, equipe própria' },
        { rotulo: 'Fundação', valor: '' },
        { rotulo: 'Sede', valor: '' },
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
              admin: { width: '40%', placeholder: 'Fundação' },
            },
            {
              name: 'valor',
              label: 'Valor',
              type: 'text',
              admin: { width: '60%', placeholder: '2014' },
            },
          ],
        },
      ],
    },
    {
      name: 'capacidadesTitulo',
      label: 'Título da seção de execução',
      type: 'text',
      defaultValue: 'O que sai daqui pronto',
    },
    {
      name: 'capacidades',
      label: 'Capacidade de execução',
      labels: { singular: 'Frente', plural: 'Frentes' },
      type: 'array',
      admin: {
        description: 'O que a LM executa de ponta a ponta. Deixe vazio para esconder a seção.',
      },
      defaultValue: [
        {
          titulo: 'Esquadrias de alumínio',
          texto: 'Portas, janelas, fachadas e coberturas sob medida, do perfil à ferragem.',
        },
        {
          titulo: 'Vidros temperados',
          texto: 'Box, guarda-corpo, espelhos e coberturas de vidro, cortados e temperados para o vão.',
        },
        {
          titulo: 'Tec Construção',
          texto: 'Projeto, execução, reforma e ampliação — a obra inteira sob a mesma coordenação.',
        },
      ],
      fields: [
        {
          name: 'titulo',
          label: 'Título',
          type: 'text',
          required: true,
        },
        {
          name: 'texto',
          label: 'Descrição',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'historia',
      label: 'História e origem',
      type: 'group',
      admin: {
        description:
          'PENDENTE — como a LM começou: de onde veio, há quanto tempo está na estrada, o que mudou. Sem texto aqui, a seção inteira não aparece no site.',
      },
      fields: [
        {
          name: 'titulo',
          label: 'Título',
          type: 'text',
          defaultValue: 'Como a LM começou',
        },
        {
          name: 'desde',
          label: 'No mercado desde',
          type: 'text',
          admin: {
            placeholder: '2014',
            description: 'Só o ano. Aparece em destaque ao lado do texto.',
          },
        },
        {
          name: 'texto',
          label: 'Texto',
          type: 'richText',
        },
        {
          name: 'imagem',
          label: 'Imagem',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'equipeTitulo',
      label: 'Título da seção de equipe',
      type: 'text',
      defaultValue: 'Quem faz',
    },
    {
      name: 'equipeTexto',
      label: 'Texto da seção de equipe',
      type: 'textarea',
    },
    {
      name: 'equipe',
      label: 'Equipe',
      labels: { singular: 'Pessoa', plural: 'Pessoas' },
      type: 'array',
      admin: {
        description:
          'PENDENTE — cadastre só pessoas reais, com o nome como elas querem ser chamadas. Enquanto estiver vazio, a seção não aparece no site.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'nome',
              label: 'Nome',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'funcao',
              label: 'Função',
              type: 'text',
              admin: { width: '50%', placeholder: 'Instalação' },
            },
          ],
        },
        {
          name: 'foto',
          label: 'Foto',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Opcional. Sem foto, aparecem as iniciais do nome.',
          },
        },
      ],
    },
    {
      name: 'fechamento',
      label: 'Fechamento',
      type: 'group',
      admin: {
        description: 'Bloco final da página, que leva para o orçamento.',
      },
      fields: [
        {
          name: 'titulo',
          label: 'Título',
          type: 'text',
          defaultValue: 'Traga o vão, a medida ou só a dúvida',
        },
        {
          name: 'texto',
          label: 'Texto',
          type: 'textarea',
          defaultValue:
            'A avaliação é sem compromisso. Se der para resolver com o que já existe, a gente fala isso também.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaTexto',
              label: 'Texto do botão',
              type: 'text',
              defaultValue: 'Solicitar orçamento',
              admin: { width: '50%' },
            },
            {
              name: 'ctaLink',
              label: 'Link do botão',
              type: 'text',
              defaultValue: '/#orcamento',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
