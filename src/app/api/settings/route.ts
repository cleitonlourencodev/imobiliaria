import { NextRequest, NextResponse } from 'next/server';
import { mockSettings } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockSettings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updatePayload: Record<string, any> = {
      updatedAt: new Date()
    };

    if (body.agencyName !== undefined) updatePayload.agencyName = body.agencyName;
    if (body.creci !== undefined) updatePayload.creci = body.creci;
    if (body.phone !== undefined) updatePayload.phone = body.phone;
    if (body.whatsappDefault !== undefined) updatePayload.whatsappDefault = body.whatsappDefault;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.address !== undefined) updatePayload.address = body.address;
    if (body.heroTitle !== undefined) updatePayload.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updatePayload.heroSubtitle = body.heroSubtitle;
    if (body.whatsappTemplateMsg !== undefined) updatePayload.whatsappTemplateMsg = body.whatsappTemplateMsg;

    Object.assign(mockSettings, updatePayload);

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
