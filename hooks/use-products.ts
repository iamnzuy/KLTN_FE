'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/lib/backend-api';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  sale?: number;
  imurl?: string;
  imgUrl?: string;
  images?: Array<{ url: string; altText?: string; order?: number }>;
  categories?: string[];
  specs?: string;
  averageRating?: number;
  soldCount?: number;
  relatedProducts?: string[];
  createdAt?: string;
  updatedAt?: string;
  categoryList?: string[];
  specList?: Array<{ specKey: string; specValue: string }>;
  sku?: string;
  color?: string;
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

// Mock product data for testing
const MOCK_PRODUCT: Product = {
  id: '1',
  title: 'Air Jordan 1 Low',
  description: 'Luôn hợp thời, luôn mới mẻ. Air Jordan 1 Low mang đến cho bạn một phần lịch sử và di sản của Jordan, mang đến sự thoải mái suốt cả ngày. Chọn màu sắc yêu thích, rồi bước ra ngoài với thiết kế biểu tượng được chế tác từ sự kết hợp chất liệu cao cấp và lớp đệm Air được bọc kín ở gót giày.',
  price: 3239000,
  sale: 2591199,
  imurl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
  images: [
    {
      url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
      altText: 'Air Jordan 1 Low - Top view',
      order: 0
    },
    {
      url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
      altText: 'Air Jordan 1 Low - Front view',
      order: 1
    },
    {
      url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
      altText: 'Air Jordan 1 Low - Side view',
      order: 2
    },
    {
      url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
      altText: 'Air Jordan 1 Low - Back view',
      order: 3
    },
    {
      url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26c7-4aec-b2d4-5b62ac8a8e1c/air-jordan-1-low-shoes-6Q1tFM.png',
      altText: 'Air Jordan 1 Low - Detail',
      order: 4
    }
  ],
  categories: ['Giày nữ'],
  averageRating: 4.5,
  soldCount: 1238,
  sku: 'DC0774-605',
  color: 'Mystic Hibiscus/Đen/Sữa dừa',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    // Return mock data for product with id = "1"
    if (productId === '1') {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setProduct(MOCK_PRODUCT as any);
        setLoading(false);
      }, 300);
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

