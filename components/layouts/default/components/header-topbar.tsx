'use client';

import { UserDropdownMenu } from './user-dropdown-menu';
import { Heart, ShoppingCart, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { WishlistSheet } from '@/app/(app)/components/sheets/wishlist-sheet';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';
import { CartStore } from '@/app/(app)/cart/hooks/cart-store';

export function HeaderTopbar() {
  const [showWishlist, setShowWishlist] = useState(false);
  const setIsOpen = CartStore((state) => state.setIsOpen);
  const {data} = useSWR(`/api/carts`, configSWR);
  const cartItems = data?.data?.items || [];

  return (
    <>
      <WishlistSheet open={showWishlist} onOpenChange={setShowWishlist} />
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="lg"
          mode="icon"
          shape="circle"
          onClick={() => setShowWishlist(true)}
          className="hover:text-primary"
        >
          <Heart className="size-5!" />
        </Button>

        <UserDropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="lg"
              mode="icon"
              shape="circle"
              className="hover:text-primary data-[state=open]:text-primary"
            >
              <UserCircle className="size-5" />
            </Button>
          }
        />

        <div className="border-e border-border h-6 hidden md:block"></div>

        <div className='hidden md:block'>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="lg"
              mode="icon"
              shape="circle"
              onClick={() => setIsOpen(true)}
              className="relative hover:text-primary"
            >
              <ShoppingCart className="size-5!" />
              <Badge
                className="absolute top-0.5 end-0.5"
                variant="success"
                size="xs"
                shape="circle"
              >
                {cartItems?.length}
              </Badge>
            </Button>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-secondary-foreground">
                Tổng cộng
              </span>
              <span className="text-xs font-medium text-foreground">{formatCurrency(data?.data?.meta?.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
