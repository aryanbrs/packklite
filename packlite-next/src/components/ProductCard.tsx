// src/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product, Variant } from '@/lib/types';
import { ShoppingCart, ChevronsUpDown } from 'lucide-react';
import { useCart, roundToValidQuantity } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

// A small helper to format currency
const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

export default function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState('250');
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    if (product.isCustomInquiryOnly) {
      window.location.href = '/get-quote';
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 250) {
      showToast('Minimum order quantity is 250 units', 'error');
      return;
    }

    const validQty = roundToValidQuantity(qty);
    
    addItem({
      productId: product.id,
      productName: product.name,
      variantSku: selectedVariant.sku,
      size: selectedVariant.size,
      basePrice: selectedVariant.basePrice,
      quantity: validQty,
      category: product.category,
    });

    setQuantity('250'); // Reset to MOQ
    showToast(`Added ${validQty} units of ${product.name} to cart!`, 'success');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
      <div className="relative w-full h-56 bg-gray-200">
        <Image
          src={product.unifiedImage || '/images/placeholder.png'}
          alt={product.name}
          fill
          style={{ objectFit: 'contain' }}
          className="p-2"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-dark mb-2">{product.name}</h3>
        <p className="text-sm text-medium-gray mb-4 flex-grow">{product.description}</p>

        <div className="mt-auto space-y-4">
          <div>
            <label htmlFor={`variant-select-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Size
            </label>
            <div className="relative">
              <select
                id={`variant-select-${product.id}`}
                value={selectedVariant.sku}
                onChange={(e) => {
                  const newVariant = product.variants.find(v => v.sku === e.target.value);
                  if (newVariant) setSelectedVariant(newVariant);
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {product.variants.map((variant) => (
                  <option key={variant.sku} value={variant.sku}>
                    {variant.size}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {!product.isCustomInquiryOnly && (
            <div>
              <label htmlFor={`quantity-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (MOQ: 250)
              </label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                min="250"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            {product.isCustomInquiryOnly ? (
              <span className="text-sm font-medium text-gray-600">Custom Quote</span>
            ) : (
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(selectedVariant.basePrice)}
                <span className="text-xs text-gray-500 block">per unit</span>
              </span>
            )}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.isCustomInquiryOnly ? 'Get Quote' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}