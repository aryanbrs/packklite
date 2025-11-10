// src/app/checkout/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, calculateDiscount } from '@/contexts/CartContext';
import { MapPin, Package, CreditCard, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerSession, setCustomerSession] = useState<any>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestConfirmed, setGuestConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: 'Haryana',
    deliveryPincode: '',
    notes: '',
  });

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/customer/session');
        if (response.ok) {
          const data = await response.json();
          if (data.customer) {
            setCustomerSession(data.customer);
            // Pre-fill form with customer data
            setFormData(prev => ({
              ...prev,
              customerName: data.customer.name || '',
              customerEmail: data.customer.email || '',
              customerPhone: data.customer.phone || '',
              companyName: data.customer.companyName || '',
              deliveryAddress: data.customer.address || '',
              deliveryCity: data.customer.city || '',
              deliveryState: data.customer.state || 'Haryana',
              deliveryPincode: data.customer.pincode || '',
            }));
          } else {
            setIsGuest(true);
          }
        } else {
          setIsGuest(true);
        }
      } catch (error) {
        setIsGuest(true);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();

    // Check if coming from guest checkout button
    if (searchParams.get('guest') === 'true') {
      setIsGuest(true);
      setSessionChecked(true);
    }
  }, [searchParams]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products before checking out</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const totalDiscount = items.reduce((sum, item) => {
    const discountPercent = calculateDiscount(item.quantity);
    return sum + (item.basePrice * item.quantity * discountPercent / 100);
  }, 0);

  const deliveryCharge = 0; // Free delivery
  const totalAmount = subtotal - totalDiscount + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          variantSku: item.variantSku,
          productName: item.productName,
          variantSize: item.size,
          quantity: item.quantity,
          unitPrice: item.basePrice,
          category: item.category,
        })),
        subtotal,
        discount: totalDiscount,
        deliveryCharge,
        totalAmount,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const { order } = await response.json();
        clearCart();
        router.push(`/order-confirmation/${order.orderNumber}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Guest checkout confirmation
  if (isGuest && !guestConfirmed && sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Checkout</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Note:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Order history won't be saved to your account</li>
                <li>• You'll need order number to track your order</li>
                <li>• Cannot view past orders in dashboard</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">✓ We Will:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Send order confirmation to your email</li>
                <li>• Contact you via phone for order confirmation</li>
                <li>• Process your order normally</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setGuestConfirmed(true)}
              className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark font-semibold"
            >
              Continue as Guest
            </button>
            <Link
              href="/customer/login"
              className="block w-full py-3 text-center border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white font-semibold transition-colors"
            >
              <User className="inline mr-2" size={18} />
              Create Account / Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          {customerSession && (
            <div className="text-sm text-gray-600">
              Logged in as: <strong>{customerSession.name}</strong>
            </div>
          )}
          {isGuest && (
            <div className="text-sm text-yellow-600 flex items-center gap-1">
              <AlertCircle size={16} />
              Guest Checkout
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package size={24} />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.deliveryState}
                        onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        placeholder="6-digit pincode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.deliveryPincode}
                        onChange={(e) => setFormData({ ...formData, deliveryPincode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any special instructions or requirements"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white text-lg font-semibold rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard size={24} />
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantSku}`} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-600">Size: {item.size}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.basePrice * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount</span>
                    <span>-₹{totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Our team will contact you within 24 hours to confirm your order and arrange payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
