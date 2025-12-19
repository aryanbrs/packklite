// src/lib/types.ts
export interface Variant {
  sku: string;
  size: string;
  basePrice: number;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  unifiedImage: string;
  variants: Variant[];
  isCustomInquiryOnly?: boolean;
}