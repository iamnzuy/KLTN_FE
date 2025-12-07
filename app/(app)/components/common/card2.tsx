'use client';

import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import { useState } from 'react';
import { ProductDetailsSheet } from '../sheets/product-details-sheet';
import Image from 'next/image';
import AxiosAPI from '@/lib/axios';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';

export function Card2({ item }: any) {
  const [showProductDetails, setShowProductDetails] = useState(false);

  const { mutate } = useSWR('/api/carts/1/items', { ...configSWR, revalidateOnMount: false, })

  const addToCart = () => {
    AxiosAPI.post(`/api/carts/user/${1}/items`, {
      productId: item?.id,
      quantity: 1,
      unitPrice: item?.sale ? item?.sale : item?.price
    }).then((res) => {
      console.log('res', res);
      mutate();
    }).catch((err) => {
      console.log('err', err);
    });
  }
  
  return (
    <>
      <Card>
        <CardContent className="flex flex-col justify-between p-2.5 gap-4 max-w-[327px]">
          <div className="mb-2.5">
            <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4 shadow-none">
              {item?.sale && (
                <Badge
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 uppercase"
                >
                  save ${calculateDiscount(item?.price, item?.sale)}%
                </Badge>
              )}

              <Image
                onClick={() => setShowProductDetails(true)}
                src={item?.imurl}
                className="h-[180px] shrink-0 cursor-pointer"
                alt="image"
                unoptimized={true}
                width={180}
                height={180}
              />
            </Card>

            <div
              onClick={() => setShowProductDetails(true)}
              className="hover:text-primary text-sm font-medium text-mono px-2.5 leading-5.5 block"
            >
              {item?.title}
            </div>
          </div>

          <div className="flex items-center justify-between px-2.5 pb-1">
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
              {item?.averageRating}
            </Badge>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-mono">{formatCurrency(item?.price)}</span>

              <Button
                size="sm"
                variant="outline"
                className="ms-1"
                onClick={addToCart}
              >
                <ShoppingCart /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProductDetailsSheet open={showProductDetails} onOpenChange={setShowProductDetails} product={item} addToCart={addToCart} />
    </>
  );
}
