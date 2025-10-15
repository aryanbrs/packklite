// src/app/api/customer/session/route.ts
import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ customer: null });
    }

    // Get full customer data
    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ customer: null });
  }
}
