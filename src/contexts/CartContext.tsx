'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantSku: string;
  size: string;
  basePrice: number;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('packlite-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('packlite-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingIndex = currentItems.findIndex(
        item => item.variantSku === newItem.variantSku
      );

      if (existingIndex > -1) {
        // Update quantity if exists
        const updated = [...currentItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      // Add new item
      return [...currentItems, { ...newItem, id: Date.now().toString() }];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const discount = calculateDiscount(item.quantity);
    const discountedPrice = item.basePrice * (1 - discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Calculate discount based on quantity (2.5% per 500 units)
export function calculateDiscount(quantity: number): number {
  return Math.floor(quantity / 500) * 2.5;
}

// Validate quantity (MOQ 250, increments of 50)
export function validateQuantity(quantity: number): boolean {
  if (quantity < 250) return false;
  if ((quantity - 250) % 50 !== 0) return false;
  return true;
}

// Round quantity to nearest valid value
export function roundToValidQuantity(quantity: number): number {
  if (quantity < 250) return 250;
  const remainder = (quantity - 250) % 50;
  if (remainder === 0) return quantity;
  if (remainder < 25) {
    return quantity - remainder;
  }
  return quantity + (50 - remainder);
}
