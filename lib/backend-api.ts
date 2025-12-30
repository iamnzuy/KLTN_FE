import { getCookie } from 'cookies-next';
import { enrichProductWithMockImage, enrichProductsWithMockImages } from './image-utils';

function normalizeApiBase(url?: string) {
  const fallback = 'http://localhost:8080/api';
  if (!url) return fallback;
  const trimmed = url.endsWith('/') ? url.slice(0, -1) : url;
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ApiCallConfig {
  baseUrl?: string;
  enrichImages?: boolean; // Flag to enable/disable image enrichment
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  config?: ApiCallConfig,
): Promise<ApiResponse<T>> {
  try {
    const token =
      typeof window !== 'undefined' ? getCookie('auth_token') : undefined;
    const baseUrl = config?.baseUrl ?? API_BASE_URL;
    const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return { data: undefined as T };
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      let data = await response.json();
      
      // Enrich with mock images if enabled (default: true)
      if (config?.enrichImages !== false) {
        data = enrichApiResponse(data);
      }
      
      return { data };
    }

    return { data: undefined as T };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Enrich API response with mock images for products
 * Handles various response structures (single product, array, nested objects)
 */
function enrichApiResponse(data: any): any {
  if (!data) return data;

  // Handle array of products
  if (Array.isArray(data)) {
    return enrichProductsWithMockImages(data);
  }

  // Handle single product
  if (data.id && (data.title || data.name)) {
    return enrichProductWithMockImage(data);
  }

  // Handle nested structures (e.g., cart items, order items)
  if (data.product) {
    return {
      ...data,
      product: enrichProductWithMockImage(data.product)
    };
  }

  // Handle array of nested products (e.g., cart with items)
  if (data.items && Array.isArray(data.items)) {
    return {
      ...data,
      items: data.items.map((item: any) => ({
        ...item,
        product: item.product ? enrichProductWithMockImage(item.product) : item.product
      }))
    };
  }

  // Handle paginated responses
  if (data.content && Array.isArray(data.content)) {
    return {
      ...data,
      content: enrichProductsWithMockImages(data.content)
    };
  }

  // Handle homepage response structure
  if (data.specialOffers || data.newArrivals || data.popularProducts || data.limitedDeals) {
    const enrichedData = { ...data };
    
    if (data.specialOffers && Array.isArray(data.specialOffers)) {
      enrichedData.specialOffers = enrichProductsWithMockImages(data.specialOffers);
    }
    
    if (data.newArrivals && Array.isArray(data.newArrivals)) {
      enrichedData.newArrivals = enrichProductsWithMockImages(data.newArrivals);
    }
    
    if (data.popularProducts && Array.isArray(data.popularProducts)) {
      enrichedData.popularProducts = enrichProductsWithMockImages(data.popularProducts);
    }
    
    if (data.limitedDeals && Array.isArray(data.limitedDeals)) {
      enrichedData.limitedDeals = enrichProductsWithMockImages(data.limitedDeals);
    }
    
    return enrichedData;
  }

  // Handle reviews with products
  if (data.reviews && Array.isArray(data.reviews)) {
    return {
      ...data,
      reviews: data.reviews.map((review: any) => ({
        ...review,
        product: review.product ? enrichProductWithMockImage(review.product) : review.product
      }))
    };
  }

  return data;
}

// Product API
export const productApi = {
  getAll: () => apiCall<any[]>('/products'),
  getById: (id: string) => apiCall<any>(`/products/${id}`),
  search: (title: string) => apiCall<any[]>(`/products/search?title=${encodeURIComponent(title)}`),
  getByCategory: (category: string) => apiCall<any[]>(`/products/category/${encodeURIComponent(category)}`),
  create: (product: any) => apiCall<any>('/products', { method: 'POST', body: JSON.stringify(product) }),
  update: (id: string, product: any) => apiCall<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  delete: (id: string) => apiCall<void>(`/products/${id}`, { method: 'DELETE' }),
};

// Cart API
export const cartApi = {
  getActiveCart: () => apiCall<any>('/carts'),
  addToCart: (item: { productId: string; quantity?: number }) =>
    apiCall<any>('/carts/items', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateItemQuantity: (itemId: number, quantity?: number) => {
    const url =
      quantity !== undefined
        ? `/carts/items/${itemId}?quantity=${quantity}`
        : `/carts/items/${itemId}`;
    return apiCall<void>(url, { method: 'PATCH' });
  },
  removeItem: (itemId: number) =>
    apiCall<void>(`/carts/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiCall<void>('/carts/items', { method: 'DELETE' }),
};

// Order API
export const orderApi = {
  create: (order: {
    shippingAddress: string;
    paymentMethod: string;
    items: Array<{ productId: string; quantity: number }>;
  }) =>
    apiCall<any>(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify(order),
      }
    ),
  getUserOrders: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 24;
    const sortBy = params?.sortBy ?? 'createdAt';
    const sortDir = params?.sortDir ?? 'desc';

    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    return apiCall<any>(`/orders?${query.toString()}`);
  },
  getById: (orderId: number) =>
    apiCall<any>(`/orders/${orderId}`),
  updateStatus: (orderId: number, status: string) =>
    apiCall<any>(
      `/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
      { method: 'PUT' }
    ),
};

// Payment API
export const paymentApi = {
  createPaymentLink: (orderId: number, returnUrl: string, cancelUrl: string) =>
    apiCall<{
      checkoutUrl: string;
      paymentLinkId: string;
      orderCode: number;
      qrCode: string;
    }>(`/payments/create-link`, {
      method: 'POST',
      body: JSON.stringify({
        orderCode: orderId,
        returnUrl,
        cancelUrl,
      }),
    }),
  getPaymentStatus: (orderCode: number) =>
    apiCall<any>(`/payments/status/${orderCode}`, {}, { baseUrl: '' }),
};

// Review API
export const reviewApi = {
  getProductReviews: (productId: string) => apiCall<any[]>(`/reviews/product/${productId}`),
  create: (review: {
    productId: string;
    rating: number;
    comment?: string;
    userId?: string;
    reviewDate?: string;
  }) =>
    apiCall<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),
  delete: (reviewId: number) => apiCall<void>(`/reviews/${reviewId}`, { method: 'DELETE' }),
};

// User API
export const userApi = {
  getAll: () => apiCall<any[]>('/users'),
  getById: (userId: number) => apiCall<any>(`/users/${userId}`),
  getByUsername: (username: string) => apiCall<any>(`/users/username/${encodeURIComponent(username)}`),
  create: (user: { username: string; email?: string; preferences?: string }) =>
    apiCall<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (userId: number, user: Partial<{ email: string; preferences: string }>) =>
    apiCall<any>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  delete: (userId: number) => apiCall<void>(`/users/${userId}`, { method: 'DELETE' }),
};

// Chat Message API
export const chatMessageApi = {
  getUserMessages: (userId: number) => apiCall<any[]>(`/chat-messages/user/${userId}`),
  create: (message: {
    userId?: number;
    message?: string;
    response?: string;
    productIds?: string;
    intent?: string;
    context?: string;
  }) =>
    apiCall<any>('/chat-messages', {
      method: 'POST',
      body: JSON.stringify(message),
    }),
};

export default {
  productApi,
  cartApi,
  orderApi,
  reviewApi,
  userApi,
  chatMessageApi,
  paymentApi,
};

