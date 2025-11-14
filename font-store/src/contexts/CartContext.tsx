'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Font } from '@/types/font';

interface CartContextType {
  items: CartItem[];
  addItem: (font: Font, license: 'personal' | 'commercial' | 'extended') => void;
  removeItem: (fontId: string) => void;
  updateQuantity: (fontId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (fontId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('font-store-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('font-store-cart', JSON.stringify(items));
  }, [items]);

  const getLicensePrice = (font: Font, license: string) => {
    switch (license) {
      case 'commercial': return font.price * 2;
      case 'extended': return font.price * 5;
      default: return font.price;
    }
  };

  const addItem = (font: Font, license: 'personal' | 'commercial' | 'extended') => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.font.id === font.id && item.license === license);

      if (existingItem) {
        return prevItems.map(item =>
          item.font.id === font.id && item.license === license
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { font, license, quantity: 1 }];
    });
  };

  const removeItem = (fontId: string) => {
    setItems(prevItems => prevItems.filter(item => item.font.id !== fontId));
  };

  const updateQuantity = (fontId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(fontId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.font.id === fontId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = getLicensePrice(item.font, item.license);
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (fontId: string) => {
    return items.some(item => item.font.id === fontId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart
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