// src/app/customer/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/customer-auth';
import { PrismaClient } from '@/generated/prisma';
import CustomerDashboard from '@/components/CustomerDashboard';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();

  if (!session) {
    redirect('/customer/login');
  }

  // Get customer with orders
  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!customer) {
    redirect('/customer/login');
  }

  return <CustomerDashboard customer={customer} session={session} />;
}
