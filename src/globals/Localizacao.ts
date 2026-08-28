import type { GlobalConfig } from 'payload'

/**
 * Conteúdo da página /localizacao.
 *
 * Endereço, horários e telefone são dados que só a LM tem. Nada aqui vem
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
        description: 'Primeira etapa do roteiro. Onde a LM atende, mesmo longe da sede.',
      },
    },
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
      name: 'contato',
      label: 'Contato',
      type: 'group',
      admin: {
        description: 'Cada canal preenchido vira um botão na página. Vazio, o botão não aparece.',
      },
      fields: [
        {
          name: 'whatsapp',
          label: 'WhatsApp',
          type: 'text',
          admin: {
            description: 'Só os números, com DDD e o 55 na frente. Ex.: 5575900000000',
            placeholder: '5575900000000',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'telefone',
              label: 'Telefone',
              type: 'text',
              admin: { width: '50%', placeholder: '(75) 3000-0000' },
            },
            {
              name: 'email',
              label: 'E-mail',
              type: 'email',
              admin: { width: '50%' },
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
        description: 'Opcional, mas ajuda muito: é por ela que o cliente reconhece o lugar na rua.',
      },
    },
  ],
}
