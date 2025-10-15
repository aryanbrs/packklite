// src/app/api/quote-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { sendQuoteConfirmation, sendAdminQuoteNotification } from '@/lib/email';

const prisma = new PrismaClient();

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
