// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

 

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
      <AdminDashboard session={session} products={products} quoteStats={quoteStats} />
    </AdminLayout>
  );
}
