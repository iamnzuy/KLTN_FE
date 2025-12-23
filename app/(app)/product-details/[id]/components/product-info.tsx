'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Scale } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { Rating } from '@/app/(app)/components/rating';
import { HeartWishlist } from '@/app/(app)/components/heart-wishlist';
import AxiosAPI from '@/lib/axios';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { useStoreClient } from '@/app/(app)/components/context';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';

interface ProductInfoProps {
  product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { showCartSheet, showComparisonSheet } = useStoreClient();
  const { mutate } = useSWR('/api/carts', { ...configSWR, revalidateOnMount: false });
  const { addProduct, products: comparisonProducts, canAddProduct } = ComparisonStore();

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

  const handleAddToComparison = () => {
    if (canAddProduct()) {
      addProduct(product);
      // Nếu đã có 2 sản phẩm, tự động mở comparison sheet
      if (comparisonProducts.length === 1) {
        showComparisonSheet();
      }
    } else {
      // Nếu đã đủ 2 sản phẩm, mở comparison sheet
      showComparisonSheet();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {product.categories.length > 0 && (
          <p className="text-sm text-muted-foreground mb-2">{product.categories.join(', ')}</p>
        )}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground flex-1">
            {product?.title}
          </h1>
          <HeartWishlist
            size="icon"
            productId={product?.id}
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


      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Thêm vào giỏ hàng
          </Button>
          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10"
            size="lg"
          >
            Mua ngay
          </Button>
        </div>
        <Button
          onClick={handleAddToComparison}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10"
          size="lg"
        >
          <Scale className="mr-2 h-5 w-5" />
          {canAddProduct() ? 'Thêm vào so sánh' : 'Xem so sánh'}
        </Button>
      </div>
    </div>
  );
}

