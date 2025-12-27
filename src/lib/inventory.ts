export type StockHealth = 'ACTIVE' | 'SLOW' | 'DEAD';

export function extractSkusFromText(text: string): string[] {
  const matches = text.match(/SKU\s*:\s*([A-Za-z0-9_-]+)/g) || [];
  return matches
    .map(m => m.split(':')[1]?.trim())
    .filter((sku): sku is string => Boolean(sku));
}

export function getLastMovementAt(lastOrderAt?: Date | null, lastQuoteAt?: Date | null): Date | null {
  if (lastOrderAt && lastQuoteAt) {
    return lastOrderAt > lastQuoteAt ? lastOrderAt : lastQuoteAt;
  }
  return lastOrderAt || lastQuoteAt || null;
}

export function getDaysSince(date: Date | null, now: Date = new Date()): number | null {
  if (!date) return null;
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getStockHealthFromMovementDays(daysSinceMovement: number | null): StockHealth {
  if (daysSinceMovement === null) return 'DEAD';
  if (daysSinceMovement <= 30) return 'ACTIVE';
  if (daysSinceMovement <= 90) return 'SLOW';
  return 'DEAD';
}

export function isLowStock(currentStock: number, minStockThreshold: number): boolean {
  return currentStock <= minStockThreshold;
}

export function getInventoryValue(currentStock: number, basePrice: number): number {
  return currentStock * basePrice;
}

export function safeConversionRate(totalOrders: number, totalQuotes: number): number {
  if (!totalQuotes) return 0;
  return totalOrders / totalQuotes;
}

export function combineStockHealth(healths: StockHealth[]): StockHealth {
  if (healths.includes('DEAD')) return 'DEAD';
  if (healths.includes('SLOW')) return 'SLOW';
  return 'ACTIVE';
}
