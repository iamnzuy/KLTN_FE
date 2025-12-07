'use client';

import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '@/lib/backend-api';

export interface CartItem {
  id: number;
  cartId: number;
  productId: string;
  product?: any;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: number;
  userId: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  items: CartItem[];
}

export function useCart(userId: number | null) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await cartApi.getActiveCart(userId);
      if (response.error) {
        setError(response.error);
      } else {
        setCart(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: string, quantity: number, unitPrice: number): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      const errorMsg = 'User not logged in';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.addToCart({ productId, quantity, unitPrice });
      if (response.error) {
        setError(response.error);
        return { success: false, error: response.error };
      } else {
        await fetchCart(); // Refresh cart
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCart]);

  const removeFromCart = useCallback(async (itemId: number) => {
    try {
      setLoading(true);
      const response = await cartApi.removeItem(itemId);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await cartApi.updateItemQuantity(itemId, quantity);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    if (!cart) return;

    try {
      setLoading(true);
      const response = await cartApi.clearCart(cart.id);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [cart, fetchCart]);

  const checkout = useCallback(async () => {
    if (!cart) return;

    try {
      setLoading(true);
      const response = await cartApi.checkout(cart.id);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout');
    } finally {
      setLoading(false);
    }
  }, [cart, fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    refetch: fetchCart,
  };
}

