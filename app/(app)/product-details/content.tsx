'use client';

import { useState } from 'react';
import { ProductDetailsSheet } from '@/app/(app)/components/sheets/product-details-sheet';
import { SearchResults } from '@/app/(app)/search-results/components/search-results';
import AxiosAPI from '@/lib/axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { useStoreClient } from '../components/context';

export function ProductDetailsContent() {
  const [open, setOpen] = useState(true);
  const [selectedProduct] = useState<any>({});
  const { showCartSheet } = useStoreClient();
  const { mutate } = useSWR('/api/carts', { ...configSWR, revalidateOnMount: false });

  const handleAddToCart = ({ productId }: { productId: string }) => {
    AxiosAPI.post(`/api/carts/items`, {
      productId,
      quantity: 1,
      unitPrice: selectedProduct?.sale || selectedProduct?.price || 0
    })
      .then((res) => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        mutate();
        showCartSheet();
      })
      .catch((err) => {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        console.log('err', err);
      });
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
