// src/app/admin/stock-updates/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import StockUpdatesTable from '@/components/StockUpdatesTable';

export const dynamic = 'force-dynamic';

const prisma = getPrismaClient();

export default async function StockUpdatesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const variants = await prisma.variant.findMany({
    include: {
      product: {
        select: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: [{ productId: 'asc' }, { sku: 'asc' }],
  });

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Stock Updates</h2>
            <p className="text-sm text-gray-600">Quickly set or adjust stock per SKU (updates are logged)</p>
          </div>
          <StockUpdatesTable initialVariants={variants as any} />
        </div>
      </div>
    </AdminLayout>
  );
}
