'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Package, FileText } from 'lucide-react';
import Link from 'next/link';

interface QuoteItem {
  id: number;
  productType: string;
  dimensions: string | null;
  quantity: string;
  notes: string | null;
}

interface Quote {
  id: number;
  fullName: string;
  companyName: string;
  phone: string;
  email: string | null;
  additionalComments: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItem[];
}

interface QuoteDetailProps {
  quote: Quote;
  session: any;
}

export default function QuoteDetail({ quote: initialQuote, session }: QuoteDetailProps) {
  const router = useRouter();
  const [quote, setQuote] = useState(initialQuote);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    message: '',
    pricing: '',
    deliveryInfo: '',
  });
  const [sending, setSending] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setQuote(updated);
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/send-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert('Quote response sent successfully!');
        setShowEmailForm(false);
        setEmailData({ message: '', pricing: '', deliveryInfo: '' });
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send email');
      }
    } catch (error) {
      alert('Error sending email');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/quotes"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to Quotes
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Quote Request #{quote.id}</h1>
              <p className="text-sm text-gray-600">
                Received on {formatDate(quote.createdAt)}
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
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{quote.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Building2 size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-medium">{quote.companyName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${quote.phone}`} className="font-medium text-primary hover:underline">
                      {quote.phone}
                    </a>
                  </div>
                </div>

                {quote.email && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded">
                      <Mail size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${quote.email}`} className="font-medium text-primary hover:underline">
                        {quote.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package size={24} />
                Requested Items ({quote.items.length})
              </h2>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">Item {index + 1}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {item.productType}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-600">Product Type</p>
                        <p className="font-medium">{item.productType}</p>
                      </div>
                      {item.dimensions && (
                        <div>
                          <p className="text-sm text-gray-600">Dimensions</p>
                          <p className="font-medium">{item.dimensions}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-medium">{item.quantity} units</p>
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-sm mt-1">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Comments */}
            {quote.additionalComments && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText size={24} />
                  Additional Comments
                </h2>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-gray-700">{quote.additionalComments}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Quote Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                    quote.status === 'converted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Update Status</p>
                  <div className="space-y-2">
                    {['pending', 'quoted', 'converted', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={updating || quote.status === status}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          quote.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
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
                {quote.email && (
                  <button
                    onClick={() => setShowEmailForm(!showEmailForm)}
                    className="block w-full px-4 py-2 text-center bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    Send Quote Response
                  </button>
                )}
                {quote.phone && (
                  <a
                    href={`tel:${quote.phone}`}
                    className="block w-full px-4 py-2 text-center bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Call Customer
                  </a>
                )}
                <a
                  href={`https://wa.me/${quote.phone.replace(/[^0-9]/g, '')}?text=Hello ${quote.fullName}, regarding your quote request #${quote.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Email Quote Response Form */}
            {showEmailForm && quote.email && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Send Quote Response Email</h3>
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message to Customer *
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your message to the customer..."
                      value={emailData.message}
                      onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pricing Details (Optional)
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Item 1: ₹XX per unit&#10;Item 2: ₹XX per unit&#10;Total: ₹XXXX"
                      value={emailData.pricing}
                      onChange={(e) => setEmailData({ ...emailData, pricing: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Information (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Delivery time: X days&#10;Delivery charges: Free for NCR&#10;Payment terms: 50% advance"
                      value={emailData.deliveryInfo}
                      onChange={(e) => setEmailData({ ...emailData, deliveryInfo: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      {sending ? 'Sending...' : 'Send Email'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Request Received</p>
                    <p className="text-xs text-gray-500">{formatDate(quote.createdAt)}</p>
                  </div>
                </div>
                {quote.updatedAt.toString() !== quote.createdAt.toString() && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(quote.updatedAt)}</p>
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
