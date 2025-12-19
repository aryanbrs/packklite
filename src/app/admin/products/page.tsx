// src/app/admin/products/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  // Redirect to dashboard which handles products
  redirect('/admin/dashboard');
}
