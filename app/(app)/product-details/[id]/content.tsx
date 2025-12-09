'use client';

import { useState } from 'react';
import { useProduct } from '@/hooks/use-products';
import { ProductImageCarousel } from './components/product-image-carousel';
import { ProductInfo } from './components/product-info';
import { ProductDescription } from './components/product-description';
import { ProductReviews } from './components/product-reviews';
import { RelatedProducts } from './components/related-products';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailsContent({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId);

  if (loading) {
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
  console.log('error', error);

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Không tìm thấy sản phẩm hoặc có lỗi xảy ra</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">Sản phẩm</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {product.categories && product.categories.length > 0 && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/products?category=${product.categories[0]}`}>
                    {product.categories[0]}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <ProductImageCarousel product={product} />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Product Description */}
      <ProductDescription product={product} />

      {/* Product Reviews */}
      <ProductReviews productId={productId} />

      {/* Related Products */}
      <RelatedProducts productId={productId} category={product.categories?.[0]} />
    </div>
  );
}

