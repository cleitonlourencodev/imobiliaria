import { NextRequest, NextResponse } from 'next/server';
import { mockLeads, mockSettings, mockBrokers, mockProperties } from '@/lib/mock-data';

export async function GET() {
  const data = mockLeads.map(l => ({
    ...l,
    property: l.propertyId ? mockProperties.find(p => p.id === l.propertyId) || null : null,
    broker: l.brokerId ? mockBrokers.find(b => b.id === l.brokerId) || null : null,
  }));

  return NextResponse.json({ success: true, count: data.length, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      propertyId,
      clientName,
      clientPhone,
      clientEmail,
      message,
      preferredDate,
      preferredTime,
      type = 'whatsapp_direto'
    } = body;

    if (!clientName || !clientPhone) {
      return NextResponse.json({ success: false, error: 'Nome e telefone são obrigatórios' }, { status: 400 });
    }

    const settings = mockSettings;
    let propertyObj = null;
    let brokerObj = null;
    let whatsappDirectEnabled = false;

    if (propertyId) {
      propertyObj = mockProperties.find(p => p.id === propertyId) || null;
      if (propertyObj) {
        whatsappDirectEnabled = propertyObj.whatsappDirectEnabled;
        if (propertyObj.brokerId) {
          brokerObj = mockBrokers.find(b => b.id === propertyObj.brokerId) || null;
        }
      }
    }

    const leadId = `lead-${Date.now()}`;
    const newLead = {
      id: leadId,
      propertyId: propertyId || null,
      brokerId: brokerObj ? brokerObj.id : null,
      clientName,
      clientPhone,
      clientEmail: clientEmail || null,
      type,
      message: message || null,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      status: 'novo',
      notes: '',
      whatsappDirectTriggered: whatsappDirectEnabled && Boolean(brokerObj?.whatsapp),
      createdAt: new Date(),
      property: propertyObj,
      broker: brokerObj,
    };

    mockLeads.push(newLead);

    let whatsappInfo = null;
    if (propertyObj) {
      const cleanPhone = brokerObj?.whatsapp || settings.whatsappDefault;
      const text = encodeURIComponent(
        `Olá! Tenho interesse no imóvel *${propertyObj.title}* (Cód: *${propertyObj.code}*), no valor de *R$ ${Number(propertyObj.price).toLocaleString('pt-BR')}*. Gostaria de mais informações!`
      );
      whatsappInfo = {
        url: `https://wa.me/${cleanPhone.replace(/\D/g, '')}?text=${text}`,
        recipientPhone: cleanPhone,
        recipientName: brokerObj?.name || settings.agencyName,
        isDirectToBroker: Boolean(brokerObj?.whatsapp),
        formattedMessage: message || 'Contato sobre imóvel'
      };
    } else {
      const cleanPhone = settings.whatsappDefault.replace(/\D/g, '');
      const text = encodeURIComponent(
        `Olá! Meu nome é ${clientName} (${clientPhone}). ${message ? `Gostaria de saber: ${message}` : 'Gostaria de mais informações sobre seus imóveis.'}`
      );
      whatsappInfo = {
        url: `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}?text=${text}`,
        recipientPhone: settings.whatsappDefault,
        recipientName: settings.agencyName,
        isDirectToBroker: false,
        formattedMessage: message || 'Contato Geral'
      };
    }

    return NextResponse.json({
      success: true,
      leadId,
      whatsapp: whatsappInfo
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}
