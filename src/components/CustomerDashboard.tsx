'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, User, LogOut, MapPin, Mail, Phone, Building2, Eye } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  productName: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  items: OrderItem[];
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  orders: Order[];
}

interface CustomerDashboardProps {
  customer: Customer;
  session: any;
}

const STATUS_COLORS: { [key: string]: string } = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  READY_TO_SHIP: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function CustomerDashboard({ customer, session }: CustomerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const handleLogout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    router.push('/');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-sm text-gray-600">Welcome back, {customer.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{customer.orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customer.orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customer.orders.filter(o => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="inline mr-2" size={18} />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="inline mr-2" size={18} />
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            {customer.orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {customer.orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} ({item.variantSize}) × {item.quantity}
                          </span>
                          <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/order-confirmation/${order.orderNumber}`}
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded">
                    <Mail size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}

                {customer.companyName && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <Building2 size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{customer.companyName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            {customer.address && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Saved Delivery Address
                </h2>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">{customer.name}</p>
                  {customer.companyName && <p className="text-sm text-gray-600">{customer.companyName}</p>}
                  <p className="mt-2">{customer.address}</p>
                  <p>{customer.city}, {customer.state} - {customer.pincode}</p>
                  {customer.phone && <p className="mt-2 text-sm">Phone: {customer.phone}</p>}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="block w-full px-4 py-3 text-center bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Browse Products
                </Link>
                <Link
                  href="/cart"
                  className="block w-full px-4 py-3 text-center border-2 border-gray-300 text-gray-700 rounded-md hover:border-primary hover:text-primary"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
