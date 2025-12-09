'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '@/utils/currency';
import { Rating } from '@/app/(app)/components/rating';
import { HeartWishlist } from '@/app/(app)/components/heart-wishlist';
import { cn } from '@/lib/utils';
import AxiosAPI from '@/lib/axios';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { useStoreClient } from '@/app/(app)/components/context';

interface ProductInfoProps {
  product: any;
}

// Mock colors and sizes - in real app, these would come from product variants
const COLORS = [
  { name: 'White/Aluminium', value: 'white-aluminium', image: '/no_photo.png' },
  { name: 'Pink', value: 'pink', image: '/no_photo.png' },
  { name: 'Teal', value: 'teal', image: '/no_photo.png' },
  { name: 'Grey', value: 'grey', image: '/no_photo.png' },
  { name: 'Red', value: 'red', image: '/no_photo.png' },
  { name: 'Green', value: 'green', image: '/no_photo.png' },
  { name: 'Brown', value: 'brown', image: '/no_photo.png' },
  { name: 'Cream', value: 'cream', image: '/no_photo.png' },
  { name: 'Dark Brown', value: 'dark-brown', image: '/no_photo.png' },
  { name: 'Light Brown', value: 'light-brown', image: '/no_photo.png' },
];

const SIZES = ['EU35.5', 'EU36', 'EU36.5', 'EU37', 'EU37.5', 'EU38', 'EU38.5', 'EU39', 'EU39.5', 'EU40'];

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]?.value || '');
  const [selectedSize, setSelectedSize] = useState(SIZES[1] || '');
  const { showCartSheet } = useStoreClient();
  const { mutate } = useSWR('/api/carts/items', { ...configSWR, revalidateOnMount: false });

  const handleToggleWishlist = () => {
    AxiosAPI.post(`/api/wishlists/items`, {
      productId: product?.id
    }).then((res) => {
      console.log('res', res);
    }).catch((err) => {
      console.log('err', err);
    });
  };

  const handleAddToCart = () => {
    AxiosAPI.post(`/api/carts/items`, {
      productId: product?.id,
      quantity: 1,
      unitPrice: product?.sale ? product?.sale : product?.price
    }).then((res) => {
      console.log('res', res);
      mutate();
      showCartSheet();
    }).catch((err) => {
      console.log('err', err);
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
  };

  return (
    <div className="space-y-6">
      {/* Category and Title */}
      <div>
        {product?.categories && product.categories.length > 0 && (
          <p className="text-sm text-muted-foreground mb-2">{product.categories[0]}</p>
        )}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground flex-1">
            {product?.title}
          </h1>
          <HeartWishlist
            size="icon"
            className="shrink-0"
            handleToggleWishlist={handleToggleWishlist}
          />
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        {product?.sale ? (
          <>
            <span className="text-2xl font-semibold text-foreground">
              {formatCurrency(product.sale)}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </span>
          </>
        ) : (
          <span className="text-2xl font-semibold text-foreground">
            {formatCurrency(product?.price || 0)}
          </span>
        )}
      </div>

      {/* Rating and Sold Count */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Rating rating={product?.averageRating || 0} />
          <span className="text-sm font-medium text-foreground">
            {product?.averageRating?.toFixed(1) || '0.0'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          Đã bán: {product?.soldCount || '1,238'}
        </span>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Màu sắc:</span>
          <span className="text-sm text-muted-foreground">
            {COLORS.find(c => c.value === selectedColor)?.name || 'White/Aluminium'}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={cn(
                "relative aspect-square rounded-lg border-2 overflow-hidden transition-all",
                selectedColor === color.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              title={color.name}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: color.value === 'white-aluminium' ? '#E0E0E0' : color.value }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Size:</span>
          <span className="text-sm text-muted-foreground">{selectedSize}</span>
          <a href="#size-guide" className="text-sm text-primary hover:underline ml-auto">
            Hướng dẫn chọn size
          </a>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Thêm vào giỏ hàng
        </Button>
        <Button
          onClick={handleBuyNow}
          variant="outline"
          className="flex-1 border-teal-500 text-teal-500 hover:bg-teal-50"
          size="lg"
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

