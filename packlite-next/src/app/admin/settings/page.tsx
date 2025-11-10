// src/app/admin/settings/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import AdminSettingsForm from '@/components/AdminSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            <p className="text-sm text-gray-600">Manage your admin profile and password</p>
          </div>
          <AdminSettingsForm session={session} />
        </div>
      </div>
    </AdminLayout>
  );
}
