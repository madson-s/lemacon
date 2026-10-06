'use client'

import type { FormEvent } from 'react'

import { linkDoWhatsApp } from '@/lib/contato'

/**
 * O formulário de orçamento da home. Não há servidor de e-mail: ao enviar, ele
 * abre o WhatsApp da LM com a mensagem já escrita, e a conversa começa no canal
 * que a equipe usa para responder.
 */
export function FormularioOrcamento({ whatsapp, unidades }: { whatsapp: string; unidades: string[] }) {
  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const dados = new FormData(event.currentTarget)
    const campo = (nome: string) => String(dados.get(nome) ?? '').trim()

    // Campo vazio não vira linha: a mensagem leva só o que a pessoa preencheu.
    const detalhes = [
      ['Nome', campo('nome')],
      ['Telefone', campo('telefone')],
      ['Unidade de interesse', campo('unidade')],
      ['Mensagem', campo('mensagem')],
    ]
      .filter(([, valor]) => valor)
      .map(([rotulo, valor]) => `*${rotulo}:* ${valor}`)

    const mensagem = ['Olá! Gostaria de um orçamento.', '', ...detalhes].join('\n')
    const link = linkDoWhatsApp(whatsapp, mensagem)
    if (link) window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <form className="contact-form" onSubmit={enviar}>
      <label>Nome<input name="nome" type="text" placeholder="Como podemos chamar você" required /></label>
      <label>Telefone / WhatsApp<input name="telefone" type="tel" placeholder="(00) 0 0000-0000" /></label>
      <label>Unidade de interesse<select name="unidade">{unidades.map((nome) => <option key={nome}>{nome}</option>)}</select></label>
      <label>Mensagem<textarea name="mensagem" placeholder="Descreva o ambiente, as medidas ou o que precisa" /></label>
      <button type="submit" className="button button--dark">Solicitar orçamento</button>
      <small>O pedido abre no WhatsApp da LM, já com a mensagem escrita.</small>
    </form>
  )
}
