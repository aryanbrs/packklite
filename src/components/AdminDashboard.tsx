'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';

type StockHealth = 'ACTIVE' | 'SLOW' | 'DEAD';

interface Variant {
  id: number;
  sku: string;
  size: string;
  basePrice: number;
  currentStock?: number;
  minStockThreshold?: number;
  stockHealth?: StockHealth;
  daysSinceMovement?: number | null;
}

interface Product {
  id: number;
  productCode: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  isCustomInquiry: boolean;
  variants: Variant[];
  stockHealth?: StockHealth;
}

interface AdminDashboardProps {
  session: {
    adminId: number;
    email: string;
    name: string;
  };
  products: Product[];
  quoteStats?: {
    total: number;
    pending: number;
    quoted: number;
    converted: number;
  };
  inventoryStats?: {
    lowStockSkusCount: number;
    deadSkusCount: number;
    slowSkusCount: number;
    totalInventoryValue: number;
    deadStockValue: number;
    slowStockValue: number;
    inventoryValueAtRisk: number;
    inventoryAlerts: {
      sku: string;
      productName: string;
      issue: string;
      daysSinceMovement: number | null;
    }[];
  };
}

export default function AdminDashboard({ session, products: initialProducts, quoteStats, inventoryStats }: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStockHealthBadge = (health?: StockHealth) => {
    if (!health) return null;

    const styles =
      health === 'ACTIVE'
        ? 'bg-green-100 text-green-800'
        : health === 'SLOW'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800';

    const label = health === 'ACTIVE' ? 'Active' : health === 'SLOW' ? 'Slow' : 'Dead';

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>
        {label}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Variants</h3>
            <p className="text-3xl font-bold text-gray-900">
              {products.reduce((sum, p) => sum + p.variants.length, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
            <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
          </div>
          {quoteStats && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Quotes</h3>
                <p className="text-3xl font-bold text-gray-900">{quoteStats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">{quoteStats.pending}</p>
              </div>
            </>
          )}
        </div>

        {inventoryStats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Low Stock SKUs</h3>
                <p className="text-3xl font-bold text-gray-900">{inventoryStats.lowStockSkusCount}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Dead SKUs</h3>
                <p className="text-3xl font-bold text-red-600">{inventoryStats.deadSkusCount}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Slow-Moving SKUs</h3>
                <p className="text-3xl font-bold text-yellow-600">{inventoryStats.slowSkusCount}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Inventory Value</h3>
                <p className="text-3xl font-bold text-gray-900">₹{formatCurrency(inventoryStats.totalInventoryValue)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Inventory Value at Risk</h3>
                <p className="text-3xl font-bold text-red-600">₹{formatCurrency(inventoryStats.inventoryValueAtRisk)}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
                <p className="text-sm text-gray-600">Low stock, dead stock, and slow-moving SKUs</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since Movement</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryStats.inventoryAlerts.map((alert, idx) => (
                      <tr key={`${alert.sku}-${idx}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alert.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              alert.issue === 'Low Stock'
                                ? 'bg-red-100 text-red-800'
                                : alert.issue === 'DEAD'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {alert.issue === 'DEAD' ? 'Dead' : alert.issue === 'SLOW' ? 'Slow' : alert.issue}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {alert.daysSinceMovement === null ? 'N/A' : `${alert.daysSinceMovement} days`}
                        </td>
                      </tr>
                    ))}
                    {inventoryStats.inventoryAlerts.length === 0 && (
                      <tr>
                        <td className="px-6 py-6 text-sm text-gray-500" colSpan={4}>
                          No alerts right now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark w-full md:w-auto justify-center"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded"></div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {getStockHealthBadge(product.stockHealth)}
                        </div>
                        <div className="text-sm text-gray-500">{product.productCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.variants.length} variants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
