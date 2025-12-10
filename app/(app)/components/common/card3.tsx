'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';



export function Card3({ item }: any) {
  const { showCartSheet } = useStoreClient();

  return (
    <Card>
      <CardContent className="flex items-center flex-wrap justify-between p-2 pe-5 gap-4.5">
        <div className="flex items-center gap-3.5">
          <Card className="flex items-center justify-center bg-accent/50 h-[70px] w-[90px] shadow-none">
            <Link href={`/product-details/${item?.id}`} target="_blank">
            <img
              src={item.imurl}
              className="h-[70px] cursor-pointer"
              alt="image"
            />
            </Link>
          </Card>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 -mt-1">
              <Link
                href={`/product-details/${item?.id}`} target="_blank" className="hover:text-primary text-sm font-medium text-mono leading-5.5">
                {item.title}
              </Link>

              {item?.badge && (
                <Badge size="sm" variant="destructive" className="uppercase">
                  save {item.badgeLabel}%
                </Badge>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-3">
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
                {item.star}
              </Badge>

              <div className="flex items-center flex-wrap gap-2 lg:gap-4">
                <span className="text-xs font-normal text-secondary-foreground uppercase">
                  sku:{' '}
                  <span className="text-xs font-medium text-foreground">
                    {item.sku}
                  </span>
                </span>
                <span className="text-xs font-normal text-secondary-foreground">
                  Category:{' '}
                  <span className="text-xs font-medium text-foreground">
                    {item.category1}
                  </span>
                </span>
                <span className="text-xs font-normal text-secondary-foreground">
                  Category:{' '}
                  <span className="text-xs font-medium text-foreground">
                    {item.category2}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-normal text-secondary-foreground line-through">
            {item.label}
          </span>
          <span className="text-sm font-medium text-mono">${item.total}</span>
          <Button
            variant="outline"
            className="ms-2 shrink-0"
            onClick={showCartSheet}
          >
            <ShoppingCart /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
