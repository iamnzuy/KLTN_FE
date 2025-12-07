'use client';

import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '@/lib/backend-api';

export interface Review {
  reviewId: number;
  productId: string;
  rating: number;
  comment?: string;
  userId?: string;
  createdAt?: string;
  reviewDate?: string;
}

export function useReviews(productId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await reviewApi.getProductReviews(productId);
      if (response.error) {
        setError(response.error);
      } else {
        setReviews(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = useCallback(async (reviewData: {
    productId: string;
    rating: number;
    comment?: string;
    userId?: string;
    reviewDate?: string;
  }) => {
    try {
      setLoading(true);
      const response = await reviewApi.create(reviewData);
      if (response.error) {
        setError(response.error);
        return null;
      } else {
        await fetchReviews(); // Refresh reviews
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchReviews]);

  const deleteReview = useCallback(async (reviewId: number) => {
    try {
      setLoading(true);
      const response = await reviewApi.delete(reviewId);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchReviews(); // Refresh reviews
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    createReview,
    deleteReview,
    refetch: fetchReviews,
  };
}

