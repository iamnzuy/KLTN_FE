'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card1 } from '@/app/(app)/home/special-offers/card1';
import { Card2 } from '@/app/(app)/home/special-offers/card2';

export function SpecialOffers({ products }: any) {

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-mono">Special Offers</span>

        <Button mode="link" asChild>
          <Link href="/search-results" className="text-xs">
            See All <ChevronRight />
          </Link>
        </Button>
      </div>

      <div className="grid xl:grid-cols-2 gap-5 mb-2">
        <div className="lg:col-span-1">
          <Card1 product={products?.[0]} />
        </div>

        <div className="lg:col-span-1">
          <div className="grid sm:grid-cols-2 gap-5 items-stretch">
            <Card2 product={products?.[1]} />
            <Card2 product={products?.[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
