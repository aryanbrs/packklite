// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { variants, ...productData } = data;

    const productId = parseInt(params.id);

    // If variants are present, normalize and validate. If not present, keep existing variants unchanged.
    const normalizedVariants = Array.isArray(variants)
      ? variants.map((v: any) => {
          const currentStock = v.currentStock === undefined || v.currentStock === null ? 0 : Number(v.currentStock);
          const minStockThreshold = v.minStockThreshold === undefined || v.minStockThreshold === null ? 0 : Number(v.minStockThreshold);

          if (!Number.isFinite(currentStock) || currentStock < 0) {
            throw new Error('Invalid currentStock');
          }
          if (!Number.isFinite(minStockThreshold) || minStockThreshold < 0) {
            throw new Error('Invalid minStockThreshold');
          }

          return {
            id: v.id ? Number(v.id) : null,
            sku: v.sku,
            size: v.size,
            basePrice: v.basePrice,
            currentStock,
            minStockThreshold,
          };
        })
      : null;

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: productData,
      include: { variants: true },
    });

    if (normalizedVariants) {
      const existingVariantIds = product.variants.map(v => v.id);
      const incomingIds = normalizedVariants.filter(v => v.id !== null).map(v => v.id as number);

      // Delete removed variants
      const toDelete = existingVariantIds.filter(id => !incomingIds.includes(id));
      if (toDelete.length > 0) {
        await prisma.variant.deleteMany({
          where: { id: { in: toDelete }, productId },
        });
      }

      // Update existing variants
      const toUpdate = normalizedVariants.filter(v => v.id !== null) as Array<{
        id: number;
        sku: string;
        size: string;
        basePrice: number;
        currentStock: number;
        minStockThreshold: number;
      }>;

      const existingById = new Map(product.variants.map(v => [v.id, v]));

      await Promise.all(
        toUpdate.map(v =>
          prisma.variant.update({
            where: { id: v.id },
            data: {
              sku: v.sku,
              size: v.size,
              basePrice: v.basePrice,
              currentStock: v.currentStock,
              minStockThreshold: v.minStockThreshold,
            },
          })
        )
      );

      const stockLedgersToCreate = toUpdate
        .map(v => {
          const existing = existingById.get(v.id);
          if (!existing) return null;

          const previousStock = existing.currentStock;
          const newStock = v.currentStock;
          if (previousStock === newStock) return null;

          return {
            variantId: v.id,
            adminId: session.adminId,
            changeType: 'SET' as const,
            source: 'PRODUCT_EDIT' as const,
            previousStock,
            newStock,
            delta: newStock - previousStock,
            reason: null as string | null,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));

      if (stockLedgersToCreate.length > 0) {
        await prisma.stockLedger.createMany({
          data: stockLedgersToCreate,
        });
      }

      // Create new variants
      const toCreate = normalizedVariants.filter(v => v.id === null);
      if (toCreate.length > 0) {
        await prisma.variant.createMany({
          data: toCreate.map(v => ({
            sku: v.sku,
            size: v.size,
            basePrice: v.basePrice,
            currentStock: v.currentStock,
            minStockThreshold: v.minStockThreshold,
            productId,
          })),
        });
      }

      const refreshed = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      return NextResponse.json(refreshed);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
