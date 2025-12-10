'use client';

import { Fragment } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';

export function Card1({ products }: any) {
  const items: any = products;

  return (
    <>
      {items?.map((item: any, index: number) => {
        return (
          <Card key={index}>
            <CardContent className="flex flex-col items-center justify-center pb-0">
              <div className="cursor-pointer hover:text-primary text-sm font-medium text-mono">
                {item.brand}
              </div>

              <img
                src={item.imurl}
                className="cursor-pointer h-[100px] shrink-0"
                alt="image"
              />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
