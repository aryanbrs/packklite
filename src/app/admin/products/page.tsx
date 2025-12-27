// src/app/admin/products/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

const prisma = getPrismaClient();

export default async function AdminProductsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { category: 'asc' },
  });

  return (
    <AdminLayout session={session}>
      <AdminDashboard session={session} products={products} />
    </AdminLayout>
  );
}
