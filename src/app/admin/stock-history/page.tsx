// src/app/admin/stock-history/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import StockHistoryTable from '@/components/StockHistoryTable';

export const dynamic = 'force-dynamic';

const prisma = getPrismaClient();

export default async function StockHistoryPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const rows = await prisma.stockLedger.findMany({
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
      variant: {
        select: {
          sku: true,
          size: true,
          product: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 500,
  });

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Stock History</h2>
            <p className="text-sm text-gray-600">Audit log of all stock changes (who/when/what/updated via)</p>
          </div>
          <StockHistoryTable rows={rows as any} />
        </div>
      </div>
    </AdminLayout>
  );
}
