// src/app/api/admin/create-admin/route.ts
/**
 * Admin Account Creation Endpoint
 * WARNING: This is for development/testing only!
 * In production, remove this endpoint and create admin accounts manually via secure methods
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@packlite.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin account already exists',
        email: 'admin@packlite.com',
        note: 'Use existing credentials to login',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create admin account
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@packlite.com',
        password: hashedPassword,
        name: 'Admin User',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully!',
      credentials: {
        email: 'admin@packlite.com',
        password: 'Admin123!',
        note: 'Please change this password after first login in production!',
      },
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create admin account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST method for programmatic creation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin account
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create admin account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
