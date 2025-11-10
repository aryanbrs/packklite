// src/app/admin/orders/[orderNumber]/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import OrderDetail from '@/components/OrderDetail';

export const dynamic = 'force-dynamic';

 

export default async function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    redirect('/admin/orders');
  }

  return <OrderDetail order={order} session={session} />;
}
