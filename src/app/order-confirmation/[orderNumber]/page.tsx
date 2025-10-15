// src/app/order-confirmation/[orderNumber]/page.tsx
import Link from 'next/link';
import { CheckCircle, Package, Phone, Mail, MapPin } from 'lucide-react';
import { PrismaClient } from '@/generated/prisma';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    redirect('/');
  }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've sent a confirmation email to{' '}
            <strong>{order.customerEmail}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
            <p className="text-2xl font-bold text-primary">{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package size={24} />
            Order Details
          </h2>

          <div className="border-t pt-4">
            {order.items.map((item, index) => (
              <div key={item.id} className="flex justify-between py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600">Size: {item.variantSize}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">₹{item.unitPrice.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bulk Discount</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Amount</span>
              <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin size={24} />
            Delivery Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Customer:</strong> {order.customerName}</p>
            {order.companyName && <p><strong>Company:</strong> {order.companyName}</p>}
            <p><strong>Phone:</strong> {order.customerPhone}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            {order.deliveryAddress && (
              <p>
                <strong>Delivery Address:</strong><br />
                {order.deliveryAddress}<br />
                {order.deliveryCity}, {order.deliveryState} - {order.deliveryPincode}
              </p>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h3>
          <ul className="space-y-2 text-blue-900">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Our team will review your order and contact you within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>We'll confirm payment details and delivery schedule</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Your order will be prepared and dispatched</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>You'll receive tracking information once shipped</span>
            </li>
          </ul>
        </div>

        {/* Order Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-600">
          <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Order Status:</strong> <span className="text-yellow-600 font-semibold">{order.status}</span></p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <span>+91 75035 42703</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              <span>packlite.aryan@gmail.com</span>
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Please save your order number <strong>{order.orderNumber}</strong> for future reference.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 py-3 bg-primary text-white text-center rounded-md hover:bg-primary-dark font-semibold"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 bg-gray-200 text-gray-700 text-center rounded-md hover:bg-gray-300 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
