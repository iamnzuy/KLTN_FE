'use client';

import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import Image from 'next/image';

const DEFAULT_PRODUCT_IMAGE = '/no_photo.png';

export function Card2({ product }: { product: any }) {
  const { showCartSheet } = useStoreClient();

  return (
    <Card className="bg-accent/50">
      <CardContent className="flex flex-col items-center justify-center px-5 pb-0">
        <div className="mb-3.5">
          {product?.sale && (
            <Badge size="sm" variant="destructive" className="uppercase">
              save {calculateDiscount(product?.price, product?.sale)}%
            </Badge>
          )}
        </div>

        <span className="text-base font-medium text-mono mb-3">{product?.title}</span>
        <Button
          size="sm"
          variant="outline"
          className="mb-2.5"
          onClick={showCartSheet}
        >
          <ShoppingCart /> Add to Card
        </Button>
        <span className="text-sm font-medium text-mono">{formatCurrency(product?.price)}</span>

        <div className="py-5">
          <Image
            src={product?.imurl ?? DEFAULT_PRODUCT_IMAGE}
            className="object-contain rounded-2xl"
            alt="image"
            unoptimized={true}
            width={172}
            height={172}
          />
        </div>
      </CardContent>
    </Card>
  );
}
