'use client';

import { useState } from 'react';
import { WishlistSheet } from '@/app/(app)/components/sheets/wishlist-sheet';
import { SearchResults } from '@/app/(app)/search-results/components/search-results';

export function WishlistContent() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <SearchResults />
      <WishlistSheet
        open={open}
        onOpenChange={() => setOpen(false)}
      />
    </>
  );
}
