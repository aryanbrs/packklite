// src/app/admin/manage-admins/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import ManageAdminsComponent from '@/components/ManageAdminsComponent';

export const dynamic = 'force-dynamic';

export default async function ManageAdminsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Administrators</h2>
            <p className="text-sm text-gray-600">Add, edit, or remove admin accounts</p>
          </div>
          <ManageAdminsComponent currentAdminId={session.adminId} />
        </div>
      </div>
    </AdminLayout>
  );
}
