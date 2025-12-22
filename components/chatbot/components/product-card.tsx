'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TopProduct } from '../types';
import { useStoreClient } from '@/app/(app)/components/context';

interface ProductCardProps {
  product: TopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { showCartSheet, showProductDetailsSheet } = useStoreClient();

  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col justify-between p-3 gap-3">
        <div className="mb-2">
          <div
            onClick={() => showProductDetailsSheet(product.id)}
            className="hover:text-primary text-sm font-medium text-mono px-1 leading-5.5 block cursor-pointer line-clamp-2"
          >
            {product.title}
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-between gap-3 px-1">
          <Badge
            size="sm"
            variant="warning"
            shape="circle"
            className="rounded-full gap-1"
          >
            <Star
              className="text-white -mt-0.5"
              style={{ fill: 'currentColor' }}
            />{' '}
            {product.average_rating.toFixed(1)}
          </Badge>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-semibold text-mono">
              {formatPrice(product.price)}
            </span>

            <Button
              size="sm"
              variant="outline"
              className="ms-1"
              onClick={showCartSheet}
            >
              <ShoppingCart className="size-3.5" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

