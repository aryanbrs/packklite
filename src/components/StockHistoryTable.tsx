'use client';

import { useMemo, useState } from 'react';

type Row = {
  id: number;
  createdAt: Date | string;
  changeType: 'SET' | 'ADJUST';
  source: 'PRODUCT_EDIT' | 'STOCK_UPDATES_PAGE';
  previousStock: number;
  newStock: number;
  delta: number;
  reason: string | null;
  admin: {
    name: string;
    email: string;
  };
  variant: {
    sku: string;
    size: string;
    product: {
      name: string;
      category: string;
    };
  };
};

export default function StockHistoryTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.variant.sku.toLowerCase().includes(q) ||
      r.variant.product.name.toLowerCase().includes(q) ||
      r.admin.email.toLowerCase().includes(q) ||
      r.admin.name.toLowerCase().includes(q) ||
      (r.reason || '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const formatDate = (d: Date | string) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const sourceLabel = (s: Row['source']) => (s === 'PRODUCT_EDIT' ? 'Product Edit' : 'Stock Updates');

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Search by SKU / product / admin / reason"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-96"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-sm text-gray-600">Showing {filtered.length} updates</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated via</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prev</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Delta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.variant.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="font-medium">{r.variant.product.name}</div>
                    <div className="text-xs text-gray-500">{r.variant.size} • {r.variant.product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="font-medium">{r.admin.name}</div>
                    <div className="text-xs text-gray-500">{r.admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sourceLabel(r.source)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.changeType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{r.previousStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">{r.newStock}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${r.delta < 0 ? 'text-red-600' : 'text-green-700'}`}>{r.delta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.reason || '-'}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500" colSpan={10}>
                    No stock updates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
