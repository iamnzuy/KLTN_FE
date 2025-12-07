/**
 * Backend API Client
 * Handles all API calls to the Spring Boot backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204 || response.status === 201) {
      return { data: undefined as T };
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { data };
    }

    return { data: undefined as T };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
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
  getActiveCart: (userId: number) => apiCall<any>(`/carts/user/${userId}`),
  addToCart: (userId: number, item: { productId: string; quantity?: number; unitPrice?: number }) =>
    apiCall<any>(`/carts/user/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  getCartItems: (cartId: number) => apiCall<any[]>(`/carts/${cartId}/items`),
  updateItemQuantity: (itemId: number, quantity?: number) => {
    const url = quantity !== undefined 
      ? `/carts/items/${itemId}?quantity=${quantity}`
      : `/carts/items/${itemId}`;
    return apiCall<void>(url, { method: 'PATCH' });
  },
  removeItem: (itemId: number) => apiCall<void>(`/carts/items/${itemId}`, { method: 'DELETE' }),
  clearCart: (cartId: number) => apiCall<void>(`/carts/${cartId}/items`, { method: 'DELETE' }),
  checkout: (cartId: number) => apiCall<void>(`/carts/${cartId}/checkout`, { method: 'POST' }),
};

// Order API
export const orderApi = {
  create: (userId: number, order: {
    shippingAddress: string;
    paymentMethod: string;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }) =>
    apiCall<any>(`/orders/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  getUserOrders: (userId: number) => apiCall<any[]>(`/orders/user/${userId}`),
  getById: (orderId: number) => apiCall<any>(`/orders/${orderId}`),
  updateStatus: (orderId: number, status: string) =>
    apiCall<any>(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' }),
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
        orderId,
        returnUrl,
        cancelUrl,
      }),
    }),
  getPaymentStatus: (orderCode: number) =>
    apiCall<any>(`/payments/status/${orderCode}`),
  getOrderPaymentStatus: (orderId: number) =>
    apiCall<{
      status: string;
      orderStatus?: string;
      message?: string;
      amount?: number;
    }>(`/payments/order/${orderId}/status`),
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

