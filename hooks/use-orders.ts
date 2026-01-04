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
  paymentStatus?: string;
  paymentLinkId?: string;
  paymentCode?: string;
  checkoutUrl?: string;
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
      const response = await orderApi.getUserOrders();
      if (response.error) {
        setError(response.error);
      } else {
        const data = response.data;
        const orderList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];
        setOrders(orderList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng');
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
    totalAmount: number;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }) => {
    if (!userId) {
      setError('Người dùng chưa đăng nhập');
      return;
    }

    try {
      setLoading(true);
      const response = await orderApi.create(orderData);
      if (response.error) {
        setError(response.error);
        return null;
      } else {
        await fetchOrders(); // Refresh orders
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo đơn hàng');
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
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
}

