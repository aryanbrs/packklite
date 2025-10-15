// src/app/admin/products/new/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';

export default async function NewProductPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-600">Create a new product with variants</p>
          </div>
          <ProductForm mode="create" />
        </div>
      </div>
    </AdminLayout>
  );
}
