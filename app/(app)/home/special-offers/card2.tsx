'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import Image from 'next/image';
import AxiosAPI from '@/lib/axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { HeartWishlist } from '../../components/heart-wishlist';
import { useWishlistProducts } from '@/hooks/use-wishlist';

const DEFAULT_PRODUCT_IMAGE = '/no_photo.png';

export function Card2({ product }: { product: any }) {
  const { showCartSheet } = useStoreClient();
  const { mutate } = useSWR('/api/carts', {
    ...configSWR,
    revalidateOnMount: false,
  });
  const { listId } = useWishlistProducts();
  const addToCart = () => {
    AxiosAPI.post(`/api/carts/items`, {
      productId: product?.id,
      quantity: 1,
      unitPrice: product?.sale ? product?.sale : product?.price,
    })
      .then((res) => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        mutate();
      })
      .catch((err) => {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        console.log('err', err);
      });
  };

  return (
    <Card className="bg-accent/50 h-full relative group">
      <HeartWishlist 
        productId={product?.id} 
        size="icon" 
        className="absolute top-4 left-4 z-10"
        initiallyWishlisted={product?.id ? listId?.includes(product.id) : false}
      />
      <Link href={`/product-details/${product?.id}`} className="block h-full">
        <CardContent className="flex flex-col items-center justify-center px-5 pb-0 h-full">
          <div className="mb-3.5">
            {product?.sale && (
              <Badge size="sm" variant="destructive" className="uppercase">
                Giảm {calculateDiscount(product?.price, product?.sale)}%
              </Badge>
            )}
          </div>

          <span className="text-base font-medium text-mono mb-3">{product?.title}</span>
          <Button
            size="sm"
            variant="outline"
            className="mb-2.5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart();
            }}
          >
            <ShoppingCart /> Thêm vào giỏ
          </Button>
          <span className="text-sm font-medium text-mono">{formatCurrency(product?.price)}</span>

          <div className="py-5">
            <Image
              src={product?.imurl ?? DEFAULT_PRODUCT_IMAGE}
              className="object-contain rounded-2xl"
              alt="image"
              unoptimized={true}
              width={172}
              height={172}
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
