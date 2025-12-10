'use client';

import { useState } from 'react';
import { useProduct } from '@/hooks/use-products';
import { ProductImageCarousel } from './components/product-image-carousel';
import { ProductInfo } from './components/product-info';
import { ProductDescription } from './components/product-description';
import { ProductReviews } from './components/product-reviews';
import { RelatedProducts } from './components/related-products';
import { Skeleton } from '@/components/ui/skeleton';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';

export function ProductDetailsContent({ productId }: { productId: string }) {

  const { data, isLoading} = useSWR(`/api/products/${productId}?reviewPage=0&reviewSize=10&reviewSortBy=reviewDate&reviewSortDir=desc`, configSWR)
  const product = data?.data;
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[600px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  console.log('product', product);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Không tìm thấy sản phẩm hoặc có lỗi xảy ra</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageCarousel product={product} />
        <ProductInfo product={product} />
      </div>
      <ProductDescription product={product} />
      <ProductReviews reviews={product.reviews} rating={product.rating} />
      <RelatedProducts productId={productId} category={product.categories?.[0]} />
    </div>
  );
}

