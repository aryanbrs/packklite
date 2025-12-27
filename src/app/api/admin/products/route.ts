// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

// GET all products
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { category: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CREATE new product
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { variants, ...productData } = data;

    const normalizedVariants = (variants || []).map((v: any) => {
      const currentStock = v.currentStock === undefined || v.currentStock === null ? 0 : Number(v.currentStock);
      const minStockThreshold = v.minStockThreshold === undefined || v.minStockThreshold === null ? 0 : Number(v.minStockThreshold);

      if (!Number.isFinite(currentStock) || currentStock < 0) {
        throw new Error('Invalid currentStock');
      }
      if (!Number.isFinite(minStockThreshold) || minStockThreshold < 0) {
        throw new Error('Invalid minStockThreshold');
      }

      return {
        sku: v.sku,
        size: v.size,
        basePrice: v.basePrice,
        currentStock,
        minStockThreshold,
      };
    });

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: normalizedVariants,
        },
      },
      include: { variants: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
