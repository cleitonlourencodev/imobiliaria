import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, count: 0, data: [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      ownerName,
      ownerPhone,
      ownerEmail,
      propertyType,
      intent,
      city,
      neighborhood,
      estimatedArea,
      bedrooms,
      notes
    } = body;

    if (!ownerName || !ownerPhone || !ownerEmail) {
      return NextResponse.json({ success: false, error: 'Nome, telefone e e-mail são obrigatórios' }, { status: 400 });
    }

    let baseM2Price = 8500;
    if (city?.toLowerCase().includes('são paulo') || city?.toLowerCase().includes('sp')) {
      if (propertyType === 'cobertura') baseM2Price = 14500;
      else if (propertyType === 'apartamento') baseM2Price = 11000;
      else if (propertyType === 'casa') baseM2Price = 9500;
      else if (propertyType === 'terreno') baseM2Price = 3200;
    }

    const areaNum = Number(estimatedArea || 100);
    const calculatedValue = Math.round(areaNum * baseM2Price);

    const id = `val-${Date.now()}`;
    const newRecord = {
      id,
      ownerName,
      ownerPhone,
      ownerEmail,
      propertyType: propertyType || 'casa',
      intent: intent || 'vender',
      city: city || 'São Paulo',
      neighborhood: neighborhood || 'Centro',
      estimatedArea: areaNum,
      bedrooms: Number(bedrooms || 0),
      estimatedValue: calculatedValue.toString(),
      notes: notes || '',
      status: 'pendente',
      createdAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: newRecord,
      estimatedMarketValue: calculatedValue,
      formattedEstimate: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatedValue)
    });
  } catch (error) {
    console.error('Error submitting valuation request:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit valuation request' }, { status: 500 });
  }
}
