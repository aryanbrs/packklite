'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Package, MapPin, User } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  productName: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  variant: {
    product: {
      name: string;
      category: string;
    };
  };
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  deliveryPincode: string | null;
  status: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  notes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  items: OrderItem[];
}

interface OrderDetailProps {
  order: Order;
  session: any;
}

const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY_TO_SHIP',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function OrderDetail({ order: initialOrder, session }: OrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [showNotesForm, setShowNotesForm] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change order status to ${newStatus.replace('_', ' ')}?`)) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrder(updated);
        alert('Order status updated successfully!');
        router.refresh();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrder(updated);
        setShowNotesForm(false);
        alert('Admin notes saved successfully!');
      } else {
        alert('Failed to save notes');
      }
    } catch (error) {
      alert('Error saving notes');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      READY_TO_SHIP: 'bg-indigo-100 text-indigo-800',
      SHIPPED: 'bg-cyan-100 text-cyan-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to Orders
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={24} />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                </div>

                {order.companyName && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <Building2 size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{order.companyName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${order.customerPhone}`} className="font-medium text-primary hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded">
                    <Mail size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${order.customerEmail}`} className="font-medium text-primary hover:underline">
                      {order.customerEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Delivery Address
                </h2>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">{order.customerName}</p>
                  {order.companyName && <p className="text-sm text-gray-600">{order.companyName}</p>}
                  <p className="mt-2">{order.deliveryAddress}</p>
                  <p>{order.deliveryCity}, {order.deliveryState} - {order.deliveryPincode}</p>
                  <p className="mt-2 text-sm">Phone: {order.customerPhone}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package size={24} />
                Order Items ({order.items.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">{item.variant.product.category}</p>
                        </td>
                        <td className="px-4 py-4">{item.variantSize}</td>
                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-4 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right">Subtotal:</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(order.subtotal)}</td>
                    </tr>
                    {order.discount > 0 && (
                      <tr className="text-green-600">
                        <td colSpan={4} className="px-4 py-2 text-right">Discount:</td>
                        <td className="px-4 py-2 text-right">-{formatCurrency(order.discount)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-right">Delivery Charge:</td>
                      <td className="px-4 py-2 text-right">{order.deliveryCharge > 0 ? formatCurrency(order.deliveryCharge) : 'FREE'}</td>
                    </tr>
                    <tr className="text-lg">
                      <td colSpan={4} className="px-4 py-3 text-right border-t-2">Total Amount:</td>
                      <td className="px-4 py-3 text-right text-primary border-t-2">{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3">Customer Notes</h3>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Admin Notes</h3>
                <button
                  onClick={() => setShowNotesForm(!showNotesForm)}
                  className="text-sm text-primary hover:underline"
                >
                  {showNotesForm ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {showNotesForm ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add internal notes about this order..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    Save Notes
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-700">{order.adminNotes || 'No admin notes yet'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Order Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Update Status</p>
                  <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={updating || order.status === status}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          order.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        Mark as {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="block w-full px-4 py-2 text-center bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Call Customer
                </a>
                <a
                  href={`mailto:${order.customerEmail}?subject=Order ${order.orderNumber}`}
                  className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Email Customer
                </a>
                <a
                  href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hello ${order.customerName}, regarding your order ${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.confirmedAt && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Confirmed</p>
                      <p className="text-xs text-gray-500">{formatDate(order.confirmedAt)}</p>
                    </div>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-100 rounded">
                      <Calendar size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shipped</p>
                      <p className="text-xs text-gray-500">{formatDate(order.shippedAt)}</p>
                    </div>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <Calendar size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delivered</p>
                      <p className="text-xs text-gray-500">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
