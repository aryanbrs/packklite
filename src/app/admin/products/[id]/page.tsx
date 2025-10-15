// src/app/admin/products/[id]/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';

const prisma = new PrismaClient();

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { variants: true },
  });

  if (!product) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-600">Update product details and variants</p>
          </div>
          <ProductForm product={product} mode="edit" />
        </div>
      </div>
    </AdminLayout>
  );
}
