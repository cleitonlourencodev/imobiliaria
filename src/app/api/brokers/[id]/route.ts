import { NextRequest, NextResponse } from 'next/server';
import { mockBrokers } from '@/lib/mock-data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const broker = mockBrokers.find(b => b.id === id);
    if (!broker) {
      return NextResponse.json({ success: false, error: 'Broker not found' }, { status: 404 });
    }

    if (body.name !== undefined) broker.name = body.name;
    if (body.creci !== undefined) broker.creci = body.creci;
    if (body.email !== undefined) broker.email = body.email;
    if (body.phone !== undefined) broker.phone = body.phone;
    if (body.whatsapp !== undefined) broker.whatsapp = body.whatsapp;
    if (body.photoUrl !== undefined) broker.photoUrl = body.photoUrl;
    if (body.bio !== undefined) broker.bio = body.bio;
    if (body.specialties !== undefined) broker.specialties = Array.isArray(body.specialties) ? body.specialties : [];
    if (body.active !== undefined) broker.active = Boolean(body.active);

    return NextResponse.json({ success: true, message: 'Broker updated successfully', data: broker });
  } catch (error) {
    console.error('Error updating broker:', error);
    return NextResponse.json({ success: false, error: 'Failed to update broker' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = mockBrokers.findIndex(b => b.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Broker not found' }, { status: 404 });
    }
    mockBrokers.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Broker deleted successfully' });
  } catch (error) {
    console.error('Error deleting broker:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete broker' }, { status: 500 });
  }
}
