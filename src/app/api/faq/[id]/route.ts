import { NextRequest, NextResponse } from 'next/server';
import { mockFaqs } from '@/lib/mock-data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const faq = mockFaqs.find(f => f.id === id);
    if (!faq) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    if (body.question !== undefined) faq.question = body.question;
    if (body.answer !== undefined) faq.answer = body.answer;
    if (body.link !== undefined) faq.link = body.link || null;
    faq.updatedAt = new Date();

    return NextResponse.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) {
    console.error('Error updating faq:', error);
    return NextResponse.json({ success: false, error: 'Failed to update faq' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = mockFaqs.findIndex(f => f.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }
    mockFaqs.splice(index, 1);
    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting faq:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete faq' }, { status: 500 });
  }
}
