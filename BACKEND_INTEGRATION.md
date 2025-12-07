# Backend Integration Guide

Hướng dẫn tích hợp frontend với Spring Boot backend.

## Cấu hình

Thêm biến môi trường vào file `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
```

## Sử dụng API Client

### Products

```typescript
import { useProducts, useProduct, useSearchProducts } from '@/hooks/use-products';

// Lấy tất cả sản phẩm
function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}

// Lấy một sản phẩm
function ProductDetail({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId);
  // ...
}

// Tìm kiếm sản phẩm
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading } = useSearchProducts(searchTerm);
  // ...
}
```

### Cart

```typescript
import { useCart } from '@/hooks/use-cart';

function CartComponent({ userId }: { userId: number }) {
  const { 
    cart, 
    loading, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    checkout 
  } = useCart(userId);
  
  const handleAddToCart = async (productId: string, price: number) => {
    await addToCart(productId, 1, price);
  };
  
  // ...
}
```

### Orders

```typescript
import { useOrders, useOrder } from '@/hooks/use-orders';

function OrdersList({ userId }: { userId: number }) {
  const { orders, loading, createOrder } = useOrders(userId);
  
  const handleCreateOrder = async () => {
    const order = await createOrder({
      shippingAddress: '123 Main St',
      paymentMethod: 'credit_card',
      items: [
        { productId: '1', quantity: 2, unitPrice: 99.99 }
      ]
    });
  };
  
  // ...
}
```

### Reviews

```typescript
import { useReviews } from '@/hooks/use-reviews';

function ProductReviews({ productId }: { productId: string }) {
  const { reviews, loading, createReview } = useReviews(productId);
  
  const handleSubmitReview = async (rating: number, comment: string) => {
    await createReview({
      productId,
      rating,
      comment,
      userId: 'user123'
    });
  };
  
  // ...
}
```

## Sử dụng API trực tiếp

Nếu cần sử dụng API trực tiếp không qua hooks:

```typescript
import { productApi, cartApi, orderApi } from '@/lib/backend-api';

// Lấy tất cả sản phẩm
const response = await productApi.getAll();
if (response.data) {
  console.log(response.data);
}

// Thêm vào giỏ hàng
const cartResponse = await cartApi.addToCart(userId, {
  productId: '123',
  quantity: 1,
  unitPrice: 99.99
});
```

## Ví dụ tích hợp vào component hiện có

### Cập nhật Product Details

```typescript
'use client';

import { useProduct } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';

export function ProductDetailsContent({ productId, userId }: { 
  productId: string; 
  userId: number;
}) {
  const { product, loading } = useProduct(productId);
  const { addToCart } = useCart(userId);
  
  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, 1, product.price);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

## Lưu ý

1. Đảm bảo backend đang chạy tại `http://localhost:8080`
2. User ID cần được lấy từ session/auth system
3. Xử lý errors một cách phù hợp trong UI
4. Thêm loading states cho better UX

