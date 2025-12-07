'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/lib/backend-api';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  imurl?: string;
  imgUrl?: string;
  categories?: string[];
  specs?: string;
  averageRating?: number;
  relatedProducts?: string[];
  createdAt?: string;
  updatedAt?: string;
  categoryList?: string[];
  specList?: Array<{ specKey: string; specValue: string }>;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll();
        if (response.error) {
          setError(response.error);
        } else {
          setProducts(response.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, refetch: () => {
    setLoading(true);
    productApi.getAll().then(response => {
      if (response.error) {
        setError(response.error);
      } else {
        setProducts(response.data || []);
      }
      setLoading(false);
    });
  }};
}

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getById(productId);
        if (response.error) {
          setError(response.error);
        } else {
          setProduct(response.data || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}

export function useSearchProducts(searchTerm: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.search(searchTerm);
        if (response.error) {
          setError(response.error);
        } else {
          setProducts(response.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return { products, loading, error };
}

