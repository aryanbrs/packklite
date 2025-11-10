// src/app/api/customer/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { createCustomerSession, verifyPassword } from '@/lib/customer-auth';

export const runtime = 'nodejs';

 

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, customer.password);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    await createCustomerSession({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
