// src/app/api/admin/stock-bootstrap/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const value = body?.value === undefined ? 10000 : Number(body.value);

    if (!Number.isFinite(value) || value < 0) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }

    const result = await prisma.$transaction(async tx => {
      const variants = await tx.variant.findMany({
        select: { id: true, currentStock: true },
      });

      await tx.variant.updateMany({
        data: {
          currentStock: Math.trunc(value),
        },
      });

      const ledgers = variants.map(v => ({
        variantId: v.id,
        adminId: session.adminId,
        changeType: 'SET' as const,
        source: 'BOOTSTRAP_INIT' as const,
        previousStock: v.currentStock,
        newStock: Math.trunc(value),
        delta: Math.trunc(value) - v.currentStock,
        reason: 'Initialize stock',
      }));

      if (ledgers.length > 0) {
        await tx.stockLedger.createMany({ data: ledgers });
      }

      return { count: variants.length };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error bootstrapping stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
