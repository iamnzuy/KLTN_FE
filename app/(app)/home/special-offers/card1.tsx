'use client';

import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import Image from 'next/image';

const DEFAULT_PRODUCT_IMAGE = '/no_photo.png';

export function Card1({ product }: { product: any }) {
  const { showCartSheet } = useStoreClient();

  return (
    <Card className="bg-accent/50 h-full">
      <CardContent className="flex items-center flex-wrap sm:flex-nowrap justify-between gap-5 lg:gap-9 lg:px-7.5 p-5">
        <div className="flex flex-col">
          <div className="mb-3">
            { product?.sale && (
              <Badge size="sm" variant="destructive" className="uppercase">
                save {calculateDiscount(product?.price, product?.sale)}%
              </Badge>
            )}
          </div>

          <h3 className="text-[26px] font-semibold text-mono mb-1">
            {product?.title}
          </h3>

          <span className="text-sm font-normal text-foreground mb-5 leading-5.5 line-clamp-2">
            {product?.description}
          </span>

          <div className="flex items-center gap-4">
            <Button size="sm" variant="mono" onClick={showCartSheet}>
              <ShoppingCart /> Add to Card
            </Button>
            <span className="text-base font-semibold text-mono">{formatCurrency(product?.price)}</span>
          </div>
        </div>

        <Image
          src={product?.imurl ?? DEFAULT_PRODUCT_IMAGE}
          className="rounded-2xl"
          alt="image"
          unoptimized={true}
          width={250}
          height={250}
        />
      </CardContent>
    </Card>
  );
}
