import { NextRequest, NextResponse } from 'next/server';

const mockBrokers = [
  {
    id: 'broker-1',
    name: 'Carlos Eduardo Mendes',
    creci: 'CRECI 128.452-F',
    email: 'carlos.mendes@primeimoveis.com.br',
    phone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    bio: 'Especialista em casas em condomínios fechados e imóveis corporativos na Zona Sul e Oeste. Mais de 12 anos de atuação no mercado imobiliário.',
    specialties: ['Casas em Condomínio', 'Alto Padrão', 'Áreas Comerciais'],
    active: true,
    createdAt: new Date(),
    activeListingsCount: 3,
  },
  {
    id: 'broker-2',
    name: 'Ana Paula Vasconcelos',
    creci: 'CRECI 194.882-F',
    email: 'ana.paula@primeimoveis.com.br',
    phone: '(11) 99123-8899',
    whatsapp: '5511991238899',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    bio: 'Consultora especialista em coberturas, apartamentos de luxo no Itaim Bibi, Jardins e Moema.',
    specialties: ['Coberturas Duplex', 'Lançamentos', 'Apartamentos Luxo'],
    active: true,
    createdAt: new Date(),
    activeListingsCount: 1,
  },
  {
    id: 'broker-3',
    name: 'Roberto Santos Silva',
    creci: 'CRECI 210.339-F',
    email: 'roberto.santos@primeimoveis.com.br',
    phone: '(11) 97455-1122',
    whatsapp: '5511974551122',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    bio: 'Especializado em terrenos, loteamentos e aluguéis residenciais e comerciais. Foco em negociações ágeis.',
    specialties: ['Terrenos & Lotes', 'Locação Residencial', 'Investimentos'],
    active: true,
    createdAt: new Date(),
    activeListingsCount: 3,
  }
];

export async function GET() {
  return NextResponse.json({ success: true, data: mockBrokers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = `broker-${Date.now()}`;
    const newBroker = {
      id,
      name: body.name || 'Novo Corretor',
      creci: body.creci || 'CRECI 00.000-F',
      email: body.email || '',
      phone: body.phone || '',
      whatsapp: body.whatsapp || body.phone || '',
      photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      bio: body.bio || '',
      specialties: Array.isArray(body.specialties) ? body.specialties : ['Residencial'],
      active: body.active !== undefined ? Boolean(body.active) : true,
      createdAt: new Date(),
      activeListingsCount: 0,
    };
    mockBrokers.push(newBroker);
    return NextResponse.json({ success: true, data: newBroker });
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json({ success: false, error: 'Failed to create broker' }, { status: 500 });
  }
}
