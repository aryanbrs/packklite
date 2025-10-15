// src/app/api/admin/quotes/[id]/send-response/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getSession } from '@/lib/auth';
import { sendQuoteResponse } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, pricing, deliveryInfo } = await request.json();

    // Get quote details
    const quote = await prisma.quoteRequest.findUnique({
      where: { id: parseInt(params.id) },
      include: { items: true },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!quote.email) {
      return NextResponse.json(
        { error: 'Customer email not available' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendQuoteResponse({
      quoteTo: quote.email,
      customerName: quote.fullName,
      quoteId: quote.id,
      message,
      pricing,
      deliveryInfo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update quote status to 'quoted'
    await prisma.quoteRequest.update({
      where: { id: parseInt(params.id) },
      data: { status: 'quoted' },
    });

    return NextResponse.json({
      success: true,
      message: 'Quote response sent successfully',
    });

  } catch (error) {
    console.error('Error sending quote response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
