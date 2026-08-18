import { NextRequest, NextResponse } from 'next/server';
import { mockProperties, mockBrokers } from '@/lib/mock-data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const prop = mockProperties.find(p => p.id === id || p.slug === id);
    if (!prop) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    prop.viewsCount += 1;

    let brokerData = null;
    if (prop.brokerId) {
      brokerData = mockBrokers.find(b => b.id === prop.brokerId) || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...prop,
        broker: brokerData
      }
    });
  } catch (error) {
    console.error('Error fetching property detail:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const prop = mockProperties.find(p => p.id === id);
    if (!prop) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    if (body.title !== undefined) prop.title = body.title;
    if (body.code !== undefined) prop.code = body.code;
    if (body.description !== undefined) prop.description = body.description;
    if (body.type !== undefined) prop.type = body.type;
    if (body.category !== undefined) prop.category = body.category;
    if (body.price !== undefined) prop.price = body.price.toString();
    if (body.condoFee !== undefined) prop.condoFee = body.condoFee.toString();
    if (body.iptu !== undefined) prop.iptu = body.iptu.toString();
    if (body.bedrooms !== undefined) prop.bedrooms = Number(body.bedrooms);
    if (body.suites !== undefined) prop.suites = Number(body.suites);
    if (body.bathrooms !== undefined) prop.bathrooms = Number(body.bathrooms);
    if (body.parkingSpaces !== undefined) prop.parkingSpaces = Number(body.parkingSpaces);
    if (body.totalArea !== undefined) prop.totalArea = Number(body.totalArea);
    if (body.builtArea !== undefined) prop.builtArea = Number(body.builtArea);
    if (body.address !== undefined) prop.address = body.address;
    if (body.neighborhood !== undefined) prop.neighborhood = body.neighborhood;
    if (body.city !== undefined) prop.city = body.city;
    if (body.state !== undefined) prop.state = body.state;
    if (body.zipCode !== undefined) prop.zipCode = body.zipCode;
    if (body.latitude !== undefined) prop.latitude = body.latitude ? body.latitude.toString() : null;
    if (body.longitude !== undefined) prop.longitude = body.longitude ? body.longitude.toString() : null;
    if (body.status !== undefined) prop.status = body.status;
    if (body.featured !== undefined) prop.featured = Boolean(body.featured);
    if (body.whatsappDirectEnabled !== undefined) prop.whatsappDirectEnabled = Boolean(body.whatsappDirectEnabled);
    if (body.brokerId !== undefined) prop.brokerId = body.brokerId;
    if (body.coverImage !== undefined) prop.coverImage = body.coverImage;
    if (body.images !== undefined) prop.images = Array.isArray(body.images) ? body.images : [body.coverImage];
    if (body.videoUrl !== undefined) prop.videoUrl = body.videoUrl;
    if (body.virtualTourUrl !== undefined) prop.virtualTourUrl = body.virtualTourUrl;
    if (body.amenities !== undefined) prop.amenities = Array.isArray(body.amenities) ? body.amenities : [];
    prop.updatedAt = new Date();

    return NextResponse.json({ success: true, message: 'Property updated successfully', data: prop });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = mockProperties.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    mockProperties.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
