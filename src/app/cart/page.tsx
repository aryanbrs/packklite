// src/app/cart/page.tsx
'use client';

import { useCart, calculateDiscount, roundToValidQuantity } from '@/contexts/CartContext';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});

  const handleQuantityChange = (id: string, value: string) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const handleQuantityBlur = (id: string, currentQty: number) => {
    const inputValue = quantities[id];
    if (!inputValue) {
      setQuantities({ ...quantities, [id]: currentQty.toString() });
      return;
    }

    const parsed = parseInt(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      setQuantities({ ...quantities, [id]: currentQty.toString() });
      return;
    }

    const validQty = roundToValidQuantity(parsed);
    updateQuantity(id, validQty);
    setQuantities({ ...quantities, [id]: validQty.toString() });
  };

  const incrementQuantity = (id: string, currentQty: number) => {
    const newQty = currentQty + 50;
    updateQuantity(id, newQty);
    setQuantities({ ...quantities, [id]: newQty.toString() });
  };

  const decrementQuantity = (id: string, currentQty: number) => {
    const newQty = Math.max(250, currentQty - 50);
    updateQuantity(id, newQty);
    setQuantities({ ...quantities, [id]: newQty.toString() });
  };

  const getItemPrice = (basePrice: number, quantity: number) => {
    const discount = calculateDiscount(quantity);
    return basePrice * (1 - discount / 100);
  };

  const getItemTotal = (basePrice: number, quantity: number) => {
    return getItemPrice(basePrice, quantity) * quantity;
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any products yet. Start browsing!
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Prices per unit decrease with larger quantities (2.5% off for every 500 units). 
          MOQ is 250, increments of 50.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discount = calculateDiscount(item.quantity);
            const discountedPrice = getItemPrice(item.basePrice, item.quantity);
            const itemTotal = getItemTotal(item.basePrice, item.quantity);
            const displayQty = quantities[item.id] || item.quantity.toString();

            return (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.size}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {item.category}
                    </span>
                    
                    {discount > 0 && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {discount}% Bulk Discount Applied
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id, item.quantity)}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={item.quantity <= 250}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        value={displayQty}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        onBlur={() => handleQuantityBlur(item.id, item.quantity)}
                        className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={() => incrementQuantity(item.id, item.quantity)}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">MOQ: 250, +50</p>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    <div className="text-right mt-2">
                      {discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{item.basePrice.toFixed(2)} / unit
                        </p>
                      )}
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{discountedPrice.toFixed(2)} / unit
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Total Items:</span>
                <span className="font-medium">{totalItems} units</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Products:</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Subtotal:</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-xs text-green-800">
              <strong>✓ Free Delivery</strong> on all bulk orders in NCR region
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary text-white text-center py-3 rounded-md hover:bg-primary-dark transition-colors mb-3 font-semibold"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={clearCart}
              className="block w-full bg-gray-200 text-gray-700 text-center py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Clear Cart
            </button>

            <Link
              href="/products"
              className="block w-full text-center py-2 text-primary hover:underline mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
