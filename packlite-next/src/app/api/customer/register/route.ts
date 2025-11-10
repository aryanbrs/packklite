// src/app/api/customer/register/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { createCustomerSession, hashPassword } from '@/lib/customer-auth';

export const runtime = 'nodejs';

 

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, companyName } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        companyName: companyName || null,
      },
    });

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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}
