'use client';

import { useMemo, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { getDaysSince, getLastMovementAt, getStockHealthFromMovementDays } from '@/lib/inventory';

type StockHealth = 'ACTIVE' | 'SLOW' | 'DEAD';

type VariantRow = {
  id: number;
  sku: string;
  size: string;
  currentStock: number;
  minStockThreshold: number;
  lastOrderAt: Date | string | null;
  lastQuoteAt: Date | string | null;
  product: {
    name: string;
    category: string;
  };
};

export default function StockUpdatesTable({ initialVariants }: { initialVariants: VariantRow[] }) {
  const { showToast } = useToast();
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [bootstrapping, setBootstrapping] = useState(false);

  const [setValues, setSetValues] = useState<Record<number, string>>({});
  const [adjustValues, setAdjustValues] = useState<Record<number, string>>({});
  const [reasons, setReasons] = useState<Record<number, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return variants;
    return variants.filter(v =>
      v.sku.toLowerCase().includes(q) ||
      v.product.name.toLowerCase().includes(q) ||
      v.product.category.toLowerCase().includes(q)
    );
  }, [variants, query]);

  const getHealth = (v: VariantRow): StockHealth => {
    const lastOrderAt = v.lastOrderAt ? new Date(v.lastOrderAt) : null;
    const lastQuoteAt = v.lastQuoteAt ? new Date(v.lastQuoteAt) : null;
    const lastMovementAt = getLastMovementAt(lastOrderAt, lastQuoteAt);
    const days = getDaysSince(lastMovementAt);
    return getStockHealthFromMovementDays(days);
  };

  const badge = (health: StockHealth) => {
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

  const applyChange = async (variantId: number, changeType: 'SET' | 'ADJUST', value: number) => {
    setBusyId(variantId);
    try {
      const response = await fetch('/api/admin/stock-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          changeType,
          value,
          reason: reasons[variantId] || null,
          source: 'STOCK_UPDATES_PAGE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Failed to update stock', 'error');
        return;
      }

      if (data.updated) {
        setVariants(prev => prev.map(v => (v.id === variantId ? { ...v, currentStock: data.updated.currentStock } : v)));
      }

      showToast('Stock updated', 'success');
      setSetValues(prev => ({ ...prev, [variantId]: '' }));
      setAdjustValues(prev => ({ ...prev, [variantId]: '' }));
    } catch (e) {
      showToast('Error updating stock', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const bootstrapAllTo10000 = async () => {
    if (!confirm('Set ALL SKU stock to 10000? This will overwrite current stock for every variant and log the change.')) {
      return;
    }

    setBootstrapping(true);
    try {
      const response = await fetch('/api/admin/stock-bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 10000 }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to initialize stock', 'error');
        return;
      }

      setVariants(prev => prev.map(v => ({ ...v, currentStock: 10000 })));
      showToast(`Initialized stock for ${data.count ?? 'all'} SKUs`, 'success');
    } catch (e) {
      showToast('Error initializing stock', 'error');
    } finally {
      setBootstrapping(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Search by SKU / product / category"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-96"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              disabled={bootstrapping}
              onClick={bootstrapAllTo10000}
              className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-black disabled:opacity-50 text-sm font-medium"
            >
              Initialize All to 10000
            </button>
            <div className="text-sm text-gray-600">Showing {filtered.length} SKUs</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjust (+/-)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason (optional)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(v => {
                const health = getHealth(v);
                const setVal = setValues[v.id] ?? '';
                const adjVal = adjustValues[v.id] ?? '';
                const reasonVal = reasons[v.id] ?? '';
                const busy = busyId === v.id;

                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="font-medium">{v.product.name}</div>
                      <div className="text-xs text-gray-500">{v.size} • {v.product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{badge(health)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">{v.currentStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{v.minStockThreshold}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={0}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          value={setVal}
                          onChange={(e) => setSetValues(prev => ({ ...prev, [v.id]: e.target.value }))}
                        />
                        <button
                          disabled={busy || setVal.trim() === ''}
                          className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 text-sm"
                          onClick={() => applyChange(v.id, 'SET', Number(setVal))}
                        >
                          Set
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          value={adjVal}
                          onChange={(e) => setAdjustValues(prev => ({ ...prev, [v.id]: e.target.value }))}
                          placeholder="e.g. -5"
                        />
                        <button
                          disabled={busy || adjVal.trim() === ''}
                          className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-black disabled:opacity-50 text-sm"
                          onClick={() => applyChange(v.id, 'ADJUST', Number(adjVal))}
                        >
                          Apply
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-56 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        value={reasonVal}
                        onChange={(e) => setReasons(prev => ({ ...prev, [v.id]: e.target.value }))}
                        placeholder="Physical count / damage / purchase..."
                      />
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500" colSpan={8}>
                    No SKUs found.
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
