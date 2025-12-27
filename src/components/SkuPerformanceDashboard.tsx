'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, TrendingDown, TrendingUp, AlertTriangle, Pencil, Warehouse, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysSince, getLastMovementAt, getStockHealthFromMovementDays, isLowStock } from '@/lib/inventory';

type StockHealth = 'ACTIVE' | 'SLOW' | 'DEAD';

export type SkuPerformanceRow = {
  variantId: number;
  sku: string;
  productId: number;
  productName: string;
  category: string;
  variantSize: string;
  basePrice: number;
  currentStock: number;
  minStockThreshold: number;
  lastOrderAt: Date | string | null;
  lastQuoteAt: Date | string | null;
  totalQuotes: number;
  totalOrders: number;
  conversionRate: number;
};

type SortKey =
  | 'conversionRate'
  | 'totalQuotes'
  | 'totalOrders'
  | 'currentStock'
  | 'daysSinceMovement'
  | 'productName'
  | 'sku';

type SortDir = 'asc' | 'desc';

type SortPreset =
  | 'conversion_desc'
  | 'conversion_asc'
  | 'orders_desc'
  | 'orders_asc'
  | 'quotes_desc'
  | 'quotes_asc'
  | 'stock_desc'
  | 'stock_asc'
  | 'days_desc'
  | 'days_asc';

function formatRate(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-IN').format(n);
}

function stockHealthBadge(health: StockHealth) {
  const styles =
    health === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : health === 'SLOW'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  const label = health === 'ACTIVE' ? 'Active' : health === 'SLOW' ? 'Slow' : 'Dead';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>{label}</span>
  );
}

function riskBadge(atRisk: boolean) {
  if (!atRisk) {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">OK</span>
    );
  }
  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">At Risk</span>
  );
}

function conversionBadge(rate: number) {
  const pct = rate * 100;
  const styles =
    pct >= 50
      ? 'bg-green-100 text-green-800'
      : pct >= 15
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles}`}>{formatRate(rate)}</span>
  );
}

export default function SkuPerformanceDashboard({ rows }: { rows: SkuPerformanceRow[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filterRisk, setFilterRisk] = useState<'all' | 'risk'>('all');
  const [filterHealth, setFilterHealth] = useState<'all' | StockHealth>('all');
  const [minQuotes, setMinQuotes] = useState<number>(0);

  const [sortKey, setSortKey] = useState<SortKey>('conversionRate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [sortPreset, setSortPreset] = useState<SortPreset>('conversion_desc');

  const tableWrapRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const enriched = useMemo(() => {
    return rows.map(r => {
      const lastOrderAt = r.lastOrderAt ? new Date(r.lastOrderAt) : null;
      const lastQuoteAt = r.lastQuoteAt ? new Date(r.lastQuoteAt) : null;
      const lastMovementAt = getLastMovementAt(lastOrderAt, lastQuoteAt);
      const daysSinceMovement = getDaysSince(lastMovementAt);
      const health = getStockHealthFromMovementDays(daysSinceMovement);
      const lowStock = isLowStock(r.currentStock, r.minStockThreshold);
      const atRisk = lowStock || health === 'DEAD';
      return { ...r, daysSinceMovement, health, atRisk, lowStock };
    });
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched
      .filter(r => {
        if (!q) return true;
        return (
          r.sku.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      })
      .filter(r => (filterRisk === 'risk' ? r.atRisk : true))
      .filter(r => (filterHealth === 'all' ? true : r.health === filterHealth))
      .filter(r => (minQuotes > 0 ? r.totalQuotes >= minQuotes : true));
  }, [enriched, query, filterRisk, filterHealth, minQuotes]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const cmp = (a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === 'string') return av.localeCompare(String(bv)) * dir;
      return (av - bv) * dir;
    };
    return [...filtered].sort(cmp);
  }, [filtered, sortKey, sortDir]);

  const insights = useMemo(() => {
    const total = enriched.length;
    const riskCount = enriched.filter(r => r.atRisk).length;
    const zeroConv = enriched.filter(r => r.totalQuotes > 0 && r.totalOrders === 0).length;

    const best = [...enriched]
      .filter(r => r.totalQuotes > 0)
      .sort((a, b) => b.conversionRate - a.conversionRate || b.totalOrders - a.totalOrders)[0];

    const worst = [...enriched]
      .filter(r => r.totalQuotes > 0)
      .sort((a, b) => a.conversionRate - b.conversionRate || b.totalQuotes - a.totalQuotes)[0];

    const opportunity = [...enriched]
      .filter(r => r.totalQuotes >= 5 && r.totalOrders === 0)
      .sort((a, b) => b.totalQuotes - a.totalQuotes)[0];

    return { total, riskCount, zeroConv, best, worst, opportunity };
  }, [enriched]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('desc');
  };

  useEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sorted.length]);

  useEffect(() => {
    const map: Record<SortPreset, { key: SortKey; dir: SortDir }> = {
      conversion_desc: { key: 'conversionRate', dir: 'desc' },
      conversion_asc: { key: 'conversionRate', dir: 'asc' },
      orders_desc: { key: 'totalOrders', dir: 'desc' },
      orders_asc: { key: 'totalOrders', dir: 'asc' },
      quotes_desc: { key: 'totalQuotes', dir: 'desc' },
      quotes_asc: { key: 'totalQuotes', dir: 'asc' },
      stock_desc: { key: 'currentStock', dir: 'desc' },
      stock_asc: { key: 'currentStock', dir: 'asc' },
      days_desc: { key: 'daysSinceMovement', dir: 'desc' },
      days_asc: { key: 'daysSinceMovement', dir: 'asc' },
    };
    const next = map[sortPreset];
    setSortKey(next.key);
    setSortDir(next.dir);
  }, [sortPreset]);

  const scrollTableBy = (dx: number) => {
    const el = tableWrapRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">SKUs analyzed</div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(insights.total)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">At Risk SKUs</div>
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(insights.riskCount)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Zero conversion</div>
            <TrendingDown size={18} className="text-yellow-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(insights.zeroConv)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Best SKU</div>
            <TrendingUp size={18} className="text-green-700" />
          </div>
          <div className="text-sm font-semibold text-gray-900 truncate">{insights.best?.sku || '-'}</div>
          <div className="text-xs text-gray-600">{insights.best ? conversionBadge(insights.best.conversionRate) : '-'}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Top opportunity</div>
          <div className="text-sm font-semibold text-gray-900 truncate">{insights.opportunity?.sku || '-'}</div>
          <div className="text-xs text-gray-600">{insights.opportunity ? `${formatNumber(insights.opportunity.totalQuotes)} quotes, 0 orders` : '-'}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              placeholder="Search by SKU / product / category"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-96"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              value={filterHealth}
              onChange={e => setFilterHealth(e.target.value as any)}
            >
              <option value="all">All health</option>
              <option value="ACTIVE">Active</option>
              <option value="SLOW">Slow</option>
              <option value="DEAD">Dead</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value as any)}
            >
              <option value="all">All risk</option>
              <option value="risk">At risk only</option>
            </select>

            <input
              type="number"
              min={0}
              className="px-3 py-2 border border-gray-300 rounded-md w-40"
              value={minQuotes}
              onChange={e => setMinQuotes(Number(e.target.value) || 0)}
              placeholder="Min quotes"
            />

            <select
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              value={sortPreset}
              onChange={e => setSortPreset(e.target.value as SortPreset)}
            >
              <option value="conversion_desc">Sort: Conversion (High → Low)</option>
              <option value="conversion_asc">Sort: Conversion (Low → High)</option>
              <option value="orders_desc">Sort: Orders (High → Low)</option>
              <option value="orders_asc">Sort: Orders (Low → High)</option>
              <option value="quotes_desc">Sort: Quotes (High → Low)</option>
              <option value="quotes_asc">Sort: Quotes (Low → High)</option>
              <option value="stock_desc">Sort: Stock (High → Low)</option>
              <option value="stock_asc">Sort: Stock (Low → High)</option>
              <option value="days_desc">Sort: Days Since Move (High → Low)</option>
              <option value="days_asc">Sort: Days Since Move (Low → High)</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 whitespace-nowrap">Showing {sorted.length} SKUs</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative">
          {(canScrollLeft || canScrollRight) && (
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
              <button
                type="button"
                disabled={!canScrollLeft}
                onClick={() => scrollTableBy(-420)}
                className="p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                title="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                disabled={!canScrollRight}
                onClick={() => scrollTableBy(420)}
                className="p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                title="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <div ref={tableWrapRef} className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 bg-gray-50">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[168px] z-10 bg-gray-50">
                  <button className="flex items-center gap-2" onClick={() => toggleSort('sku')}>
                    SKU <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[304px] z-10 bg-gray-50">
                  <button className="flex items-center gap-2" onClick={() => toggleSort('productName')}>
                    Product <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2 ml-auto" onClick={() => toggleSort('currentStock')}>
                    Stock <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2 ml-auto" onClick={() => toggleSort('totalQuotes')}>
                    Quotes <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2 ml-auto" onClick={() => toggleSort('totalOrders')}>
                    Orders <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2 ml-auto" onClick={() => toggleSort('conversionRate')}>
                    Conversion <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2 ml-auto" onClick={() => toggleSort('daysSinceMovement')}>
                    Days Since Move <ArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sorted.map((row, idx) => (
                <tr key={row.variantId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm sticky left-0 z-10 bg-white">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/stock-updates?q=${encodeURIComponent(row.sku)}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-900 text-white hover:bg-black text-xs font-medium"
                      >
                        <Warehouse size={14} /> Update Stock
                      </Link>
                      <Link
                        href={`/admin/products/${row.productId}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 text-xs font-medium"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-[168px] z-10 bg-white">{row.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 sticky left-[304px] z-10 bg-white">
                    <div className="font-medium">{row.productName}</div>
                    <div className="text-xs text-gray-500">{row.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.variantSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stockHealthBadge((row as any).health)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{riskBadge((row as any).atRisk)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">{formatNumber(row.currentStock)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{formatNumber(row.totalQuotes)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{formatNumber(row.totalOrders)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{conversionBadge(row.conversionRate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {(row as any).daysSinceMovement === null ? '-' : (row as any).daysSinceMovement}
                  </td>
                </tr>
              ))}

              {sorted.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500" colSpan={11}>
                    No SKUs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
