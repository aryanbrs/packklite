// src/app/api/admin/stock-adjustments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

type ChangeType = 'SET' | 'ADJUST';
type Source = 'PRODUCT_EDIT' | 'STOCK_UPDATES_PAGE';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const variantId = Number(body.variantId);
    const changeType = body.changeType as ChangeType;
    const source = body.source as Source;
    const value = Number(body.value);
    const reason = body.reason ? String(body.reason) : null;

    if (!Number.isFinite(variantId)) {
      return NextResponse.json({ error: 'Invalid variantId' }, { status: 400 });
    }
    if (changeType !== 'SET' && changeType !== 'ADJUST') {
      return NextResponse.json({ error: 'Invalid changeType' }, { status: 400 });
    }
    if (source !== 'PRODUCT_EDIT' && source !== 'STOCK_UPDATES_PAGE') {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }
    if (!Number.isFinite(value)) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }

    const result = await prisma.$transaction(async tx => {
      const variant = await tx.variant.findUnique({
        where: { id: variantId },
        select: { id: true, currentStock: true },
      });

      if (!variant) {
        throw new Error('Variant not found');
      }

      const previousStock = variant.currentStock;
      const newStock = changeType === 'SET' ? Math.trunc(value) : previousStock + Math.trunc(value);

      if (!Number.isFinite(newStock) || newStock < 0) {
        return { error: 'Resulting stock cannot be negative' } as const;
      }

      if (newStock === previousStock) {
        return { variantId, previousStock, newStock, delta: 0 } as const;
      }

      const updated = await tx.variant.update({
        where: { id: variantId },
        data: { currentStock: newStock },
        select: {
          id: true,
          sku: true,
          size: true,
          currentStock: true,
          minStockThreshold: true,
        },
      });

      const delta = newStock - previousStock;

      await tx.stockLedger.create({
        data: {
          variantId,
          adminId: session.adminId,
          changeType,
          source,
          previousStock,
          newStock,
          delta,
          reason,
        },
      });

      return { updated, previousStock, newStock, delta } as const;
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Internal server error';
    if (message === 'Variant not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error('Error adjusting stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
