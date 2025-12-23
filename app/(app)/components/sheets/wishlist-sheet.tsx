'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefObject, useCallback, useMemo, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import useSWR, { useSWRConfig } from 'swr';
import { ShoppingCart, Star, TrashIcon, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { configSWR } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';
import AxiosAPI from '@/lib/axios';
import { useStoreClient } from '@/app/(app)/components/context';

const FALLBACK_IMAGE = '/no_photo.png';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

type WishlistSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type WishlistProduct = {
  id?: string;
  title?: string;
  imurl?: string;
  sku?: string;
  averageRating?: number;
  price?: number;
  sale?: number;
  categories?: string[];
};

export function WishlistSheet({ open, onOpenChange }: WishlistSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSWRConfig();
  const { showCartSheet } = useStoreClient();

  useOnClickOutside(sheetRef as RefObject<HTMLElement>, () => onOpenChange(false));

  const { data, isLoading, error, mutate: mutateWishlist } = useSWR(
    open ? '/api/products/wishlist/products' : null,
    configSWR,
  );
  const products: WishlistProduct[] = data?.data ?? [];

  const isEmpty = !products?.length && !isLoading && !error;

  const handleRemove = useCallback(
    async (productId?: string) => {
      if (!productId) return;
      try {
        await AxiosAPI.delete(`/api/products/wishlist?productId=${productId}`);
        await mutateWishlist();
        mutate('/api/products/wishlist');
      } catch (err) {
        console.error('Failed to remove wishlist item', err);
      }
    },
    [mutate, mutateWishlist],
  );

  const handleClear = useCallback(async () => {
    if (!products?.length) return;
    try {
      await Promise.all(
        products
          .map((product) => product.id)
          .filter(Boolean)
          .map((productId) =>
            AxiosAPI.delete(`/api/products/wishlist?productId=${productId}`),
          ),
      );
      await mutateWishlist();
      mutate('/api/products/wishlist');
    } catch (err) {
      console.error('Failed to clear wishlist', err);
    }
  }, [products, mutateWishlist, mutate]);

  const handleMoveToCart = useCallback(
    async (product: WishlistProduct) => {
      if (!product?.id) return;
      const unitPrice = Number(product.sale ?? product.price ?? 0);
      try {
        await AxiosAPI.post('/api/carts/items', {
          productId: product.id,
          quantity: 1,
          unitPrice,
        });
        mutate('/api/carts');
        showCartSheet();
      } catch (err) {
        console.error('Failed to add wishlist item to cart', err);
      }
    },
    [mutate, showCartSheet],
  );

  const headerSubtitle = useMemo(() => {
    if (isLoading) return 'Đang tải sản phẩm yêu thích...';
    if (error) return 'Không thể tải danh sách mong muốn';
    if (isEmpty) return 'Bạn chưa có sản phẩm nào trong danh sách';
    return `${products.length} sản phẩm được lưu`;
  }, [isLoading, error, isEmpty, products?.length]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)]" />
      )}
      <motion.nav
        ref={sheetRef}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={variants}
        transition={{ duration: 0.2 }}
        className="fixed inset-5 start-auto z-50 w-full rounded-lg border-s bg-background p-0 sm:w-[560px]"
      >
        <div className="flex h-full w-full flex-col gap-4 rounded-lg">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <p className="text-base font-semibold text-foreground">Wishlist</p>
              <p className="text-xs text-muted-foreground">{headerSubtitle}</p>
            </div>
            <X
              className="h-5 w-5 cursor-pointer text-foreground opacity-70 transition-opacity hover:opacity-100"
              onClick={() => onOpenChange(false)}
            />
          </div>

          <div className="h-[calc(100dvh-12rem)] space-y-5 overflow-y-auto px-5 py-0 pe-3">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Không tải được wishlist</AlertTitle>
                <AlertDescription>
                  Vui lòng thử lại sau vài phút hoặc tải lại trang.
                </AlertDescription>
              </Alert>
            )}

            {isEmpty && (
              <Card className="bg-accent/40 text-center shadow-none">
                <CardContent className="flex flex-col items-center gap-3 py-10 text-sm text-muted-foreground">
                  <span>Danh sách yêu thích đang trống.</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/" onClick={() => onOpenChange(false)}>
                      Khám phá sản phẩm
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {isLoading &&
              !error &&
              Array.from({ length: 3 }).map((_, idx) => (
                <Card key={`wishlist-skeleton-${idx}`} className="shadow-none">
                  <CardContent className="flex gap-4 p-4">
                    <div className="h-[70px] w-[90px] animate-pulse rounded-lg bg-accent/60" />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-accent/60" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-accent/50" />
                      <div className="h-3 w-1/4 animate-pulse rounded bg-accent/40" />
                    </div>
                  </CardContent>
                </Card>
              ))}

            {!isLoading &&
              !error &&
              products?.map((product) => {
                const price = Number(product.sale ?? product.price ?? 0);
                const basePrice = Number(product.price ?? price);
                const categories = product.categories?.join(', ');
                const ratingLabel = product.averageRating?.toFixed(1);

                return (
                  <Card key={product.id} className="shadow-none">
                    <CardContent className="flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5 sm:pe-5">
                      <div className="flex flex-1 items-start gap-3.5">
                        <div className="flex h-[70px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-accent/50">
                          <Image
                            src={product.imurl || FALLBACK_IMAGE}
                            alt={product.title ?? 'Wishlist product'}
                            width={90}
                            height={70}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Link
                              href={
                                product.id
                                  ? `/product-details/${product.id}`
                                  : '#'
                              }
                              className="text-sm font-medium leading-5.5 text-foreground hover:text-primary"
                              onClick={() => {
                                if (product.id) {
                                  onOpenChange(false);
                                }
                              }}
                            >
                              {product.title}
                            </Link>
                            {product.sale && basePrice > 0 && (
                              <Badge size="sm" variant="destructive" className="uppercase">
                                save {Math.round(((basePrice - price) / basePrice) * 100)}%
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {ratingLabel && (
                              <Badge
                                size="sm"
                                variant="warning"
                                shape="circle"
                                className="gap-1"
                              >
                                <Star className="text-white" fill="currentColor" />
                                {ratingLabel}
                              </Badge>
                            )}
                            {categories && (
                              <span className="text-xs text-muted-foreground">
                                {categories}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="flex items-center gap-2">
                          {product.sale && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(basePrice)}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(price)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemove(product.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Remove
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMoveToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          <div className="flex items-center gap-2 border-t border-border px-5 py-3.5">
            <Button
              className="grow"
              variant="outline"
              disabled={isLoading || isEmpty}
              onClick={handleClear}
            >
              Remove All
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
