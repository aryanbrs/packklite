// src/lib/product-data.ts

// This is a temporary data structure. We will replace this with a real database call.
import AppConfig from '@/lib/AppConfig'; 
import { Product } from '@/lib/types'; // We'll define this type next

// This function simulates fetching and organizing products.
export function getProductsByCategory() {
  const productsByCategory: { [key: string]: Product[] } = {};

  AppConfig.products.forEach(product => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  return productsByCategory;
}