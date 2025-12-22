'use client';

import { useEffect, useState } from 'react';
import type { Product } from './use-products';

const STORAGE_KEY = 'compare_products_v1';

export function useCompare() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const add = (product: Product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      const next = [...prev, product].slice(0, 2); // limit 2
      return next;
    });
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  };

  const clear = () => setItems([]);

  const toggle = (product: Product) => {
    const exists = items.find(p => p.id === product.id);
    if (exists) remove(product.id);
    else add(product);
  };

  const isCompared = (productId: string) => items.some(p => p.id === productId);

  return { items, add, remove, clear, toggle, isCompared } as const;
}
