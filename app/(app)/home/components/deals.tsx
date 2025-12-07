'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card2 } from '@/app/(app)/components/common/card2';

export const Deals = ({ products }: any) => {
  if (!products?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-mono">
          Limited-Time Deals
        </span>

        <Button mode="link" asChild>
          <Link href="/search-results-grid">
            See All <ChevronRight />
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-2">
        {products?.slice(0, 4)?.map((product: any) => (
          <Card2 item={product} key={product?.id} />
        ))}
      </div>
    </div>
  );
}
