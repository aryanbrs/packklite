// src/app/api/admin/manage/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

// Update admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminId = parseInt(params.id);
    const { name, email, password } = await request.json();

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      admin,
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: 'Failed to update admin' },
      { status: 500 }
    );
  }
}

// Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminId = parseInt(params.id);

    // Prevent deleting yourself
    if (session.adminId === adminId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.admin.delete({
      where: { id: adminId },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
