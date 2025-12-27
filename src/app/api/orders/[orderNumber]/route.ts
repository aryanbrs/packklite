// src/app/api/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE order (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { status, adminNotes } = data;

    const result = await prisma.$transaction(async tx => {
      const existing = await tx.order.findUnique({
        where: { orderNumber: params.orderNumber },
        select: {
          status: true,
          confirmedAt: true,
        },
      });

      if (!existing) {
        return { error: 'Order not found' } as const;
      }

      const updateData: any = {};
      const now = new Date();
      const isConfirmingNow = status === 'CONFIRMED' && !existing.confirmedAt;

      if (status) {
        updateData.status = status;

        // Set timestamps based on status
        if (status === 'CONFIRMED' && !existing.confirmedAt) {
          updateData.confirmedAt = now;
        } else if (status === 'SHIPPED') {
          updateData.shippedAt = now;
        } else if (status === 'DELIVERED') {
          updateData.deliveredAt = now;
        }
      }
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

      if (isConfirmingNow) {
        const orderItems = await tx.orderItem.findMany({
          where: { order: { orderNumber: params.orderNumber } },
          select: { variantId: true, quantity: true },
        });

        const variantIds = Array.from(new Set(orderItems.map(i => i.variantId)));
        const variants = await tx.variant.findMany({
          where: { id: { in: variantIds } },
          select: { id: true, currentStock: true },
        });
        const byId = new Map(variants.map(v => [v.id, v]));

        const requiredByVariant = new Map<number, number>();
        for (const it of orderItems) {
          requiredByVariant.set(it.variantId, (requiredByVariant.get(it.variantId) || 0) + it.quantity);
        }

        for (const [variantId, requiredQty] of requiredByVariant.entries()) {
          const v = byId.get(variantId);
          if (!v) {
            return { error: 'Variant not found for one or more order items' } as const;
          }
          if (v.currentStock - requiredQty < 0) {
            return { error: 'Insufficient stock for one or more items' } as const;
          }
        }

        for (const [variantId, requiredQty] of requiredByVariant.entries()) {
          const v = byId.get(variantId)!;
          const previousStock = v.currentStock;
          const newStock = previousStock - requiredQty;

          await tx.variant.update({
            where: { id: variantId },
            data: { currentStock: newStock },
          });

          await tx.stockLedger.create({
            data: {
              variantId,
              adminId: session.adminId,
              changeType: 'ADJUST',
              source: 'ORDER_STATUS',
              previousStock,
              newStock,
              delta: newStock - previousStock,
              reason: `Order confirmed: ${params.orderNumber}`,
            },
          });
        }
      }

      const order = await tx.order.update({
        where: { orderNumber: params.orderNumber },
        data: updateData,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      return { order } as const;
    });

    if ('error' in result) {
      const statusCode = result.error === 'Order not found' ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(result.order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE order (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.order.delete({
      where: { orderNumber: params.orderNumber },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
