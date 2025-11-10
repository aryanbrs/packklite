// src/app/admin/quotes/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import AdminLayout from '@/components/AdminLayout';
import QuotesList from '@/components/QuotesList';

export const dynamic = 'force-dynamic';

 

export default async function AdminQuotesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all quote requests with items
  const quotes = await prisma.quoteRequest.findMany({
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
            <h2 className="text-2xl font-bold text-gray-900">Quote Requests</h2>
            <p className="text-sm text-gray-600">Manage customer quote requests</p>
          </div>
          <QuotesList quotes={quotes} session={session} />
        </div>
      </div>
    </AdminLayout>
  );
}
