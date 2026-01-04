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

export function Card1({ product }: { product: any }) {
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
    <Card className="bg-accent/50 h-full">
      <div className="block h-full relative group">
        <HeartWishlist 
          productId={product?.id} 
          initiallyWishlisted={product?.id ? listId?.includes(product.id) : false}
          size="icon" 
          className="absolute top-4 left-4 z-10"
        />
        <Link href={`/product-details/${product?.id}`} className="block h-full">
          <CardContent className="flex items-center flex-wrap sm:flex-nowrap justify-between gap-5 lg:gap-9 lg:px-7.5 p-5 h-full">
            <div className="flex flex-col">
              <div className="mb-3">
                { product?.sale && (
                  <Badge size="sm" variant="destructive" className="uppercase">
                    Giảm {calculateDiscount(product?.price, product?.sale)}%
                  </Badge>
                )}
              </div>

              <h3 className="text-[26px] font-semibold text-mono mb-1">
                {product?.title}
              </h3>

              <span className="text-sm font-normal text-foreground mb-5 leading-5.5 line-clamp-2">
                {product?.description}
              </span>

              <div className="flex items-center gap-4">
                <Button 
                  size="sm" 
                  variant="mono" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart();
                  }}
                >
                  <ShoppingCart /> Thêm vào giỏ
                </Button>
                <span className="text-base font-semibold text-mono">{formatCurrency(product?.price)}</span>
              </div>
            </div>

            <Image
              src={product?.imurl ?? DEFAULT_PRODUCT_IMAGE}
              className="rounded-2xl"
              alt="image"
              unoptimized={true}
              width={250}
              height={250}
            />
          </CardContent>
        </Link>
      </div>
    </Card>
  );
}
