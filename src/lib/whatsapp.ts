export interface PropertyWhatsAppTarget {
  whatsappDirectEnabled: boolean;
  brokerName?: string | null;
  brokerWhatsapp?: string | null;
  agencyWhatsapp: string;
}

export interface LeadPayload {
  propertyTitle: string;
  propertyCode: string;
  propertyPrice: string | number;
  propertyAddress: string;
  propertyUrl?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  type?: string;
}

export function formatCurrencyBRL(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

export function cleanPhoneForWhatsApp(phone: string): string {
  // Removes all non-digits
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // If starts with 55, keep it, else prepend 55 (Brazil)
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

export function buildWhatsAppLink(target: PropertyWhatsAppTarget, payload: LeadPayload): {
  url: string;
  recipientPhone: string;
  recipientName: string;
  isDirectToBroker: boolean;
  formattedMessage: string;
} {
  const isDirectToBroker = Boolean(target.whatsappDirectEnabled && target.brokerWhatsapp);
  const rawNumber = isDirectToBroker && target.brokerWhatsapp ? target.brokerWhatsapp : target.agencyWhatsapp;
  const recipientPhone = cleanPhoneForWhatsApp(rawNumber);
  const recipientName = isDirectToBroker && target.brokerName ? target.brokerName : 'Central de Atendimento Prime';

  const priceFormatted = formatCurrencyBRL(payload.propertyPrice);
  
  let msgTypeLabel = 'Manifestação de Interesse';
  if (payload.type === 'agendamento_visita') msgTypeLabel = '📅 Agendamento de Visita';
  else if (payload.type === 'simulacao_financiamento') msgTypeLabel = '🏦 Solicitação de Simulação de Financiamento';
  else if (payload.type === 'whatsapp_direto') msgTypeLabel = '📱 Contato Direto via WhatsApp';

  const lines = [
    `Olá, *${recipientName}*! 👋`,
    `Recebi um novo lead pelo site (*${msgTypeLabel}*):`,
    ``,
    `🏡 *IMÓVEL DE INTERESSE:*`,
    `• *Título:* ${payload.propertyTitle}`,
    `• *Código Ref:* ${payload.propertyCode}`,
    `• *Valor:* ${priceFormatted}`,
    `• *Localização:* ${payload.propertyAddress}`,
    payload.propertyUrl ? `• *Link:* ${payload.propertyUrl}` : '',
    ``,
    `👤 *DADOS DO CLIENTE:*`,
    `• *Nome:* ${payload.clientName}`,
    `• *Telefone/WhatsApp:* ${payload.clientPhone}`,
    payload.clientEmail ? `• *E-mail:* ${payload.clientEmail}` : '',
    payload.preferredDate ? `• *Data Preferida:* ${payload.preferredDate} às ${payload.preferredTime || 'A combinar'}` : '',
    payload.message ? `• *Mensagem:* "${payload.message}"` : '',
    ``,
    `⚡ _Aguardando atendimento do corretor responsável._`
  ].filter(line => line !== null && line !== undefined && line !== '');

  const formattedMessage = lines.join('\n');
  const encodedMsg = encodeURIComponent(formattedMessage);
  const url = `https://wa.me/${recipientPhone}?text=${encodedMsg}`;

  return {
    url,
    recipientPhone,
    recipientName,
    isDirectToBroker,
    formattedMessage
  };
}
