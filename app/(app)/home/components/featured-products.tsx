'use client';

import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function FeaturedProducts() {
  const { data } = useSWR(`/api/brands`, configSWR);
  const items: any = data?.data;
  return (
    <div className="grid sm:grid-cols-4 xl:grid-cols-7 gap-5 mb-2">
        {items?.map((item: any, index: number) => {
          return (
            <Card key={index}>
              <CardContent className="flex flex-col items-center justify-center pb-0">
                <div className="cursor-pointer hover:text-primary text-sm font-medium text-mono">
                  {item.name}
                </div>

                <img
                  src={item.logo}
                  className="cursor-pointer h-[100px] shrink-0 object-contain"
                  alt="image"
                />
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
