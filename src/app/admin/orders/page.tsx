// src/app/admin/orders/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';
import AdminLayout from '@/components/AdminLayout';
import OrdersList from '@/components/OrdersList';

const prisma = new PrismaClient();

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all orders with items
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <p className="text-sm text-gray-600">View and manage customer orders</p>
          </div>
          <OrdersList orders={orders} session={session} />
        </div>
      </div>
    </AdminLayout>
  );
}
