import { NextRequest, NextResponse } from 'next/server';
import { mockLeads } from '@/lib/mock-data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const lead = mockLeads.find(l => l.id === id);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    if (body.status !== undefined) lead.status = body.status;
    if (body.notes !== undefined) lead.notes = body.notes;
    if (body.brokerId !== undefined) lead.brokerId = body.brokerId;

    return NextResponse.json({ success: true, message: 'Lead updated successfully', data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    mockLeads.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}
