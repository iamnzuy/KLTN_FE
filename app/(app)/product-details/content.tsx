'use client';

import { useState } from 'react';
import { ProductDetailsSheet } from '@/app/(app)/components/sheets/product-details-sheet';
import { SearchResults } from '@/app/(app)/search-results/components/search-results';

export function ProductDetailsContent() {
  const [open, setOpen] = useState(true);
  const [selectedProduct] = useState({});

  const handleAddToCart = ({ productId }: { productId: string }) => {
    console.log('Added to cart:', productId);
  };

  return (
    <>
      <SearchResults />
      <ProductDetailsSheet
        open={open}
        onOpenChange={() => setOpen(false)}
        product={selectedProduct}
        addToCart={handleAddToCart}
      />
    </>
  );
}
