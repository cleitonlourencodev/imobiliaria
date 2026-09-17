import { NextRequest, NextResponse } from 'next/server';
import { mockFaqs, FaqItem } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, count: mockFaqs.length, data: mockFaqs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { question, answer, link } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: 'Pergunta e resposta são obrigatórias' }, { status: 400 });
    }

    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      link: link || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFaqs.push(newFaq);
    return NextResponse.json({ success: true, data: newFaq });
  } catch (error) {
    console.error('Error creating faq:', error);
    return NextResponse.json({ success: false, error: 'Failed to create faq' }, { status: 500 });
  }
}
