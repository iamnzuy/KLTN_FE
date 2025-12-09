'use client';

import { useProducts } from '@/hooks/use-products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  productId: string;
  category?: string;
}

export function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const { products, loading } = useProducts();
  const [startIndex, setStartIndex] = useState(0);
  const productsPerPage = 5;

  // Filter out current product and get related products (by category or random)
  const relatedProducts = products
    .filter(p => p.id !== productId)
    .filter(p => !category || p.categories?.includes(category))
    .slice(0, 10); // Limit to 10 related products

  const visibleProducts = relatedProducts.slice(startIndex, startIndex + productsPerPage);
  const canScrollPrev = startIndex > 0;
  const canScrollNext = startIndex < relatedProducts.length - productsPerPage;

  const handlePrev = () => {
    if (canScrollPrev) {
      setStartIndex(Math.max(0, startIndex - 1));
    }
  };

  const handleNext = () => {
    if (canScrollNext) {
      setStartIndex(Math.min(relatedProducts.length - productsPerPage, startIndex + 1));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sản phẩm liên quan</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[200px] h-[300px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Sản phẩm liên quan</h2>
      
      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {visibleProducts.map((product) => (
            <Link key={product.id} href={`/product-details/${product.id}`}>
              <Card className="min-w-[200px] max-w-[200px] hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-accent/50 rounded-t-lg overflow-hidden">
                    <Image
                      src={product?.imurl || '/no_photo.png'}
                      alt={product?.title || 'Product'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {product?.sale && (
                      <Badge
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        Sale
                      </Badge>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {product?.categories?.[0] || 'Sản phẩm'}
                    </p>
                    <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                      {product?.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium">
                          {product?.averageRating?.toFixed(1) || '4.8'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(product?.price || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {canScrollPrev && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {canScrollNext && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

