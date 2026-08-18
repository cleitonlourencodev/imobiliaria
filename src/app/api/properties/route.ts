import { NextRequest, NextResponse } from 'next/server';
import { mockProperties } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const parkingSpaces = searchParams.get('parkingSpaces');
    const city = searchParams.get('city');
    const neighborhood = searchParams.get('neighborhood');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || 'newest';

    let filtered = [...mockProperties];

    if (type && type !== 'todos') {
      if (type === 'venda') {
        filtered = filtered.filter(p => p.type === 'venda' || p.type === 'ambos');
      } else if (type === 'aluguel') {
        filtered = filtered.filter(p => p.type === 'aluguel' || p.type === 'ambos');
      } else {
        filtered = filtered.filter(p => p.type === type);
      }
    }

    if (category && category !== 'todos') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (minPrice) {
      filtered = filtered.filter(p => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice));
    }

    if (bedrooms && bedrooms !== 'todos') {
      const bNum = parseInt(bedrooms, 10);
      if (!isNaN(bNum)) filtered = filtered.filter(p => p.bedrooms >= bNum);
    }

    if (bathrooms && bathrooms !== 'todos') {
      const bNum = parseInt(bathrooms, 10);
      if (!isNaN(bNum)) filtered = filtered.filter(p => p.bathrooms >= bNum);
    }

    if (parkingSpaces && parkingSpaces !== 'todos') {
      const pNum = parseInt(parkingSpaces, 10);
      if (!isNaN(pNum)) filtered = filtered.filter(p => p.parkingSpaces >= pNum);
    }

    if (city && city !== 'todos') {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (neighborhood && neighborhood !== 'todos') {
      filtered = filtered.filter(p => p.neighborhood.toLowerCase().includes(neighborhood.toLowerCase()));
    }

    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured === true);
    }

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    if (q) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.code.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(q.toLowerCase()) ||
        p.city.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'views') {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = `prop-${Date.now()}`;
    const code = body.code || `IMV-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = body.title
      ? body.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + `-${Date.now().toString().slice(-4)}`
      : `imovel-${id}`;

    const newProperty = {
      id,
      code,
      title: body.title || 'Sem Título',
      slug,
      description: body.description || '',
      type: body.type || 'venda',
      category: body.category || 'casa',
      price: body.price ? body.price.toString() : '0.00',
      condoFee: body.condoFee ? body.condoFee.toString() : '0.00',
      iptu: body.iptu ? body.iptu.toString() : '0.00',
      bedrooms: Number(body.bedrooms || 0),
      suites: Number(body.suites || 0),
      bathrooms: Number(body.bathrooms || 0),
      parkingSpaces: Number(body.parkingSpaces || 0),
      totalArea: Number(body.totalArea || 0),
      builtArea: Number(body.builtArea || 0),
      address: body.address || '',
      neighborhood: body.neighborhood || '',
      city: body.city || 'São Paulo',
      state: body.state || 'SP',
      zipCode: body.zipCode || '',
      latitude: body.latitude ? body.latitude.toString() : null,
      longitude: body.longitude ? body.longitude.toString() : null,
      status: body.status || 'disponivel',
      featured: Boolean(body.featured),
      whatsappDirectEnabled: body.whatsappDirectEnabled !== undefined ? Boolean(body.whatsappDirectEnabled) : true,
      brokerId: body.brokerId || null,
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'],
      videoUrl: body.videoUrl || '',
      virtualTourUrl: body.virtualTourUrl || '',
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      broker: null,
    };

    mockProperties.push(newProperty);
    return NextResponse.json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}
