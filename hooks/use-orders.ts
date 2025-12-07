'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '@/lib/backend-api';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  product?: any;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
}

export function useOrders(userId: number | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await orderApi.getUserOrders(userId);
      if (response.error) {
        setError(response.error);
      } else {
        setOrders(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: {
    shippingAddress: string;
    paymentMethod: string;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }) => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await orderApi.create(userId, orderData);
      if (response.error) {
        setError(response.error);
        return null;
      } else {
        await fetchOrders(); // Refresh orders
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchOrders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders,
  };
}

export function useOrder(orderId: number | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getById(orderId);
        if (response.error) {
          setError(response.error);
        } else {
          setOrder(response.data || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
}

