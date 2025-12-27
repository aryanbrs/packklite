// src/app/api/quote-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { sendQuoteConfirmation, sendAdminQuoteNotification } from '@/lib/email';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

function extractSkusFromText(text: string): string[] {
  // RFQ notes created from cart include: "... - SKU: <sku>"
  // Keep extraction permissive so existing quote flows remain unaffected.
  const matches = text.match(/SKU\s*:\s*([A-Za-z0-9_-]+)/g) || [];
  return matches
    .map(m => m.split(':')[1]?.trim())
    .filter((sku): sku is string => Boolean(sku));
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { fullName, companyName, phone, email, additionalComments, productItems } = data;

    // Create quote request with items
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        companyName,
        phone,
        email: email || null,
        additionalComments: additionalComments || null,
        items: {
          create: productItems.map((item: any) => ({
            productType: item.productType,
            dimensions: item.dimensions || null,
            quantity: item.quantity,
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Track last movement at SKU-level (used for inventory ageing / stock health)
    // Quote items do not have a dedicated variant reference; when RFQ is created from cart,
    // the SKU is embedded in notes ("SKU: <sku>"). We update movement only when SKUs are detected.
    const now = new Date();
    const skusFromNotes = Array.from(
      new Set(
        (quoteRequest.items || [])
          .flatMap(item => (item.notes ? extractSkusFromText(item.notes) : []))
      )
    );

    if (skusFromNotes.length > 0) {
      await prisma.variant.updateMany({
        where: { sku: { in: skusFromNotes } },
        data: { lastQuoteAt: now },
      });
    }

    // Send email notifications (non-blocking)
    Promise.all([
      sendQuoteConfirmation(quoteRequest),
      sendAdminQuoteNotification(quoteRequest),
    ]).catch(error => {
      console.error('Error sending email notifications:', error);
      // Don't fail the request if emails fail
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Quote request submitted successfully',
        quoteRequest 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to fetch quote requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const quoteRequests = await prisma.quoteRequest.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(quoteRequests);

  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote requests' },
      { status: 500 }
    );
  }
}
