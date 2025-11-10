'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductItem {
  id: string;
  productType: string;
  dimensions: string;
  quantity: string;
  notes: string;
}

const PRODUCT_TYPES = [
  'Corrugated Box',
  'Thermocol Packaging',
  'Foam Sheet/Block',
  'EPE Foam Sheet/Roll',
  'Packaging Tape',
  'Stretch Film',
  'Bubble Wrap',
  'Other (Please specify in notes)',
];

export default function GetQuotePage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    additionalComments: '',
  });

  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize with cart items if available
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialItems: ProductItem[] = cartItems.map(item => ({
        id: Date.now().toString() + Math.random(),
        productType: item.category,
        dimensions: item.size,
        quantity: item.quantity.toString(),
        notes: `${item.productName} - SKU: ${item.variantSku}`,
      }));
      setProductItems(initialItems);
    } else {
      // Add one empty item if no cart items
      addProductItem();
    }
  }, []);

  const addProductItem = () => {
    setProductItems([
      ...productItems,
      {
        id: Date.now().toString() + Math.random(),
        productType: '',
        dimensions: '',
        quantity: '',
        notes: '',
      },
    ]);
  };

  const removeProductItem = (id: string) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter(item => item.id !== id));
    }
  };

  const updateProductItem = (id: string, field: keyof ProductItem, value: string) => {
    setProductItems(
      productItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate product items
    let hasValidProduct = false;
    productItems.forEach((item, index) => {
      if (item.productType && item.quantity) {
        hasValidProduct = true;
      }

      if (item.productType && !item.quantity) {
        newErrors[`product_${index}_quantity`] = 'Quantity is required';
      }

      if (item.quantity && !item.productType) {
        newErrors[`product_${index}_type`] = 'Product type is required';
      }
    });

    if (!hasValidProduct) {
      newErrors.products = 'Please add at least one product item with type and quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productItems: productItems.filter(item => item.productType && item.quantity),
        }),
      });

      if (response.ok) {
        // Clear cart if items came from cart
        if (cartItems.length > 0) {
          clearCart();
        }

        showToast('Quote request submitted successfully! Our team will contact you soon.', 'success');
        setTimeout(() => router.push('/'), 2000);
      } else {
        showToast('Failed to submit quote request. Please try again.', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Request for Quote (RFQ)</h1>
        <p className="text-gray-600 mb-8">
          Describe your packaging needs below. Add products, specify quantities, and we&apos;ll provide a personalized quote.
        </p>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Important Information Regarding Quotes
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• For larger quantity orders, we often provide reduced rates.</li>
            <li>• Free delivery may be applicable for bulk orders within Gurugram & NCR.</li>
            <li>• All details, including final pricing, delivery, and GST, will be communicated by our team after you submit this inquiry.</li>
            <li>• You must add at least one product item to this RFQ.</li>
          </ul>
        </div>

        {errors.products && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{errors.products}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Product Items for Quote</h2>
              <button
                type="button"
                onClick={addProductItem}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                <Plus size={16} />
                Add Product Item
              </button>
            </div>

            <div className="space-y-6">
              {productItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900">Product Item {index + 1}</h3>
                    {productItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors[`product_${index}_type`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={item.productType}
                        onChange={(e) => updateProductItem(item.id, 'productType', e.target.value)}
                      >
                        <option value="">-- Select Product --</option>
                        {PRODUCT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors[`product_${index}_type`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`product_${index}_type`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions (L x W x H or other, Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={item.dimensions}
                        onChange={(e) => updateProductItem(item.id, 'dimensions', e.target.value)}
                        placeholder="e.g., 12in x 10in x 8in"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors[`product_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={item.quantity}
                        onChange={(e) => updateProductItem(item.id, 'quantity', e.target.value)}
                        placeholder="e.g., 1000"
                      />
                      {errors[`product_${index}_quantity`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`product_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Requirements / Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={item.notes}
                        onChange={(e) => updateProductItem(item.id, 'notes', e.target.value)}
                        placeholder="Any specific requirements, custom printing, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overall Additional Information / Comments (Optional)
            </h2>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              placeholder="Any additional information, delivery preferences, timeline, etc."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Request for Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
