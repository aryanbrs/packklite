// src/app/admin/quotes/[id]/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import QuoteDetail from '@/components/QuoteDetail';

export const dynamic = 'force-dynamic';

 

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      items: true,
    },
  });

  if (!quote) {
    redirect('/admin/quotes');
  }

  return <QuoteDetail quote={quote} session={session} />;
}
