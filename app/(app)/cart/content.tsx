'use client';

import { useState } from 'react';
import { CartSheet } from '@/app/(app)/components/sheets/cart-sheet';
import { SearchResults } from '@/app/(app)/search-results/components/search-results';

export function CartContent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SearchResults />
      <CartSheet
        open={open}
        onOpenChange={() => setOpen(!open)}
      />
    </>
  );
}
