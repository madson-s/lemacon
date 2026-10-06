/**
 * Link para abrir uma conversa no WhatsApp da LM. O número é guardado no painel
 * só com DDD (ex.: 75993364665); o 55 do Brasil entra aqui.
 *
 * Com `mensagem`, o WhatsApp já abre com o texto escrito — é o que o formulário
 * de orçamento usa para mandar nome, telefone, unidade e o pedido.
 */
export const linkDoWhatsApp = (numero: string | null | undefined, mensagem?: string): string | null => {
  const digitos = String(numero ?? '').replace(/\D/g, '')
  if (digitos.length < 10) return null

  const base = `https://wa.me/55${digitos}`
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base
}
