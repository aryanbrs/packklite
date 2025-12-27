// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';
import {
  combineStockHealth,
  getDaysSince,
  getInventoryValue,
  getLastMovementAt,
  getStockHealthFromMovementDays,
  isLowStock,
} from '@/lib/inventory';

export const dynamic = 'force-dynamic';

const prisma = getPrismaClient();

type StockHealth = 'ACTIVE' | 'SLOW' | 'DEAD';

type DashboardVariant = {
  id: number;
  sku: string;
  size: string;
  basePrice: number;
  currentStock: number;
  minStockThreshold: number;
  lastOrderAt: Date | null;
  lastQuoteAt: Date | null;
  lastMovementAt: Date | null;
  daysSinceMovement: number | null;
  stockHealth: StockHealth;
  lowStock: boolean;
};

type DashboardProduct = {
  id: number;
  productCode: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  isCustomInquiry: boolean;
  stockHealth: StockHealth;
  variants: DashboardVariant[];
};

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all products with variants
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  const now = new Date();
  const productsWithInventory: DashboardProduct[] = products.map(product => {
    const variantsWithInventory = product.variants.map(variant => {
      const lastMovementAt = getLastMovementAt(variant.lastOrderAt, variant.lastQuoteAt);
      const daysSinceMovement = getDaysSince(lastMovementAt, now);
      const stockHealth = getStockHealthFromMovementDays(daysSinceMovement);
      const lowStock = isLowStock(variant.currentStock, variant.minStockThreshold);

      return {
        ...variant,
        lastMovementAt,
        daysSinceMovement,
        stockHealth,
        lowStock,
      };
    });

    const productStockHealth = combineStockHealth(variantsWithInventory.map(v => v.stockHealth));

    return {
      ...product,
      stockHealth: productStockHealth,
      variants: variantsWithInventory,
    };
  });

  const allVariants = productsWithInventory.flatMap(p =>
    p.variants.map(v => ({ ...v, productId: p.id, productName: p.name }))
  );

  const lowStockSkusCount = allVariants.filter(v => v.lowStock).length;
  const deadSkusCount = allVariants.filter(v => v.stockHealth === 'DEAD').length;
  const slowSkusCount = allVariants.filter(v => v.stockHealth === 'SLOW').length;

  const totalInventoryValue = allVariants.reduce(
    (sum, v) => sum + getInventoryValue(v.currentStock, v.basePrice),
    0
  );
  const deadStockValue = allVariants
    .filter(v => v.stockHealth === 'DEAD')
    .reduce((sum, v) => sum + getInventoryValue(v.currentStock, v.basePrice), 0);
  const slowStockValue = allVariants
    .filter(v => v.stockHealth === 'SLOW')
    .reduce((sum, v) => sum + getInventoryValue(v.currentStock, v.basePrice), 0);
  const inventoryValueAtRisk = allVariants
    .filter(v => v.lowStock || v.stockHealth === 'DEAD')
    .reduce((sum, v) => sum + getInventoryValue(v.currentStock, v.basePrice), 0);

  const inventoryAlerts = allVariants
    .filter(v => v.lowStock || v.stockHealth === 'DEAD' || v.stockHealth === 'SLOW')
    .map(v => {
      const issue = v.lowStock ? 'Low Stock' : v.stockHealth;
      return {
        sku: v.sku,
        productName: v.productName,
        issue,
        daysSinceMovement: v.daysSinceMovement,
      };
    })
    .sort((a, b) => {
      const priority = (issue: string) => {
        if (issue === 'Low Stock') return 0;
        if (issue === 'DEAD') return 1;
        if (issue === 'SLOW') return 2;
        return 3;
      };

      const pDiff = priority(a.issue) - priority(b.issue);
      if (pDiff !== 0) return pDiff;

      const aDays = a.daysSinceMovement ?? Number.MAX_SAFE_INTEGER;
      const bDays = b.daysSinceMovement ?? Number.MAX_SAFE_INTEGER;
      return bDays - aDays;
    })
    .slice(0, 25);

  const inventoryStats = {
    lowStockSkusCount,
    deadSkusCount,
    slowSkusCount,
    totalInventoryValue,
    deadStockValue,
    slowStockValue,
    inventoryValueAtRisk,
    inventoryAlerts,
  };

  // Fetch quote statistics
  const totalQuotes = await prisma.quoteRequest.count();
  const pendingQuotes = await prisma.quoteRequest.count({
    where: { status: 'pending' },
  });
  const quotedCount = await prisma.quoteRequest.count({
    where: { status: 'quoted' },
  });
  const convertedCount = await prisma.quoteRequest.count({
    where: { status: 'converted' },
  });

  const quoteStats = {
    total: totalQuotes,
    pending: pendingQuotes,
    quoted: quotedCount,
    converted: convertedCount,
  };

  return (
    <AdminLayout session={session}>
      <AdminDashboard session={session} products={productsWithInventory} quoteStats={quoteStats} inventoryStats={inventoryStats} />
    </AdminLayout>
  );
}
