// src/app/admin/sku-performance/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import { extractSkusFromText, safeConversionRate } from '@/lib/inventory';
import SkuPerformanceDashboard, { type SkuPerformanceRow } from '@/components/SkuPerformanceDashboard';

export const dynamic = 'force-dynamic';

const prisma = getPrismaClient();

export default async function SkuPerformancePage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const variants = await prisma.variant.findMany({
    include: {
      product: true,
    },
  });

  const orderCounts = await prisma.orderItem.groupBy({
    by: ['variantId'],
    _count: {
      _all: true,
    },
  });

  const ordersByVariantId = new Map<number, number>();
  for (const row of orderCounts) {
    ordersByVariantId.set(row.variantId, row._count._all);
  }

  const quoteItems = await prisma.quoteRequestItem.findMany({
    where: {
      notes: {
        not: null,
      },
    },
    select: {
      notes: true,
    },
  });

  const quotesBySku = new Map<string, number>();
  for (const item of quoteItems) {
    const notes = item.notes || '';
    const skus = extractSkusFromText(notes);
    for (const sku of skus) {
      quotesBySku.set(sku, (quotesBySku.get(sku) || 0) + 1);
    }
  }

  const rows: SkuPerformanceRow[] = variants.map(v => {
    const totalOrders = ordersByVariantId.get(v.id) || 0;
    const totalQuotes = quotesBySku.get(v.sku) || 0;
    const conversionRate = safeConversionRate(totalOrders, totalQuotes);

    return {
      variantId: v.id,
      sku: v.sku,
      productId: v.productId,
      productName: v.product.name,
      category: v.product.category,
      variantSize: v.size,
      basePrice: v.basePrice,
      currentStock: v.currentStock,
      minStockThreshold: v.minStockThreshold,
      lastOrderAt: v.lastOrderAt,
      lastQuoteAt: v.lastQuoteAt,
      totalQuotes,
      totalOrders,
      conversionRate,
    };
  });

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">SKU Performance</h2>
            <p className="text-sm text-gray-600">Decision support combining conversion, stock risk and stock health</p>
          </div>

          <SkuPerformanceDashboard rows={rows} />
        </div>
      </div>
    </AdminLayout>
  );
}
