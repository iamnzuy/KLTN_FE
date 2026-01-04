'use client';

import { ShoppingCart, Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useOnClickOutside } from 'usehooks-ts';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { Rating } from '../rating';
import { HeartWishlist } from '../heart-wishlist';

const items = [
  {
    text: 'Tình trạng',
    info: (
      <Badge size="sm" variant="success">
        Còn hàng
      </Badge>
    ),
  },
  {
    text: 'SKU',
    info: (
      <span className="text-xs font-medium text-foreground">SH-001-BLK-42</span>
    ),
  },
  {
    text: 'Danh mục',
    info: <span className="text-xs font-medium text-foreground">Sneakers</span>,
  },
  {
    text: 'Đánh giá',
    info: null, // rating uchun alohida component bor
  },
  {
    text: 'Thêm thông tin',
    info: (
      <span className="text-xs font-normal text-foreground">
        10g powder, powder measure & water dispensing bottle (empty)
      </span>
    ),
  },
];

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

export const ProductDetailsSheet = ({
  open,
  onOpenChange,
  product,
  addToCart,
}: { open: boolean, onOpenChange: (open: boolean) => void, product: any, addToCart: (product: any) => void }) => {
  const ref = useRef<any>(null);
  useOnClickOutside(ref, () => onOpenChange(false));

  return (
    <>
      {open && <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 [backdrop-filter:blur(4px)] z-50' />}
      <motion.nav
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.2 }}
        className="fixed border-s z-50 sm:w-[560px] bg-background sm:max-w-none inset-5 start-auto rounded-lg p-0"
      >
        <div ref={ref} className='flex flex-col gap-4 h-full w-full rounded-lg'>
          <div className='border-b py-3.5 px-5 border-border flex items-center justify-between text-base font-medium'>
            Chi tiết sản phẩm
            <X className="text-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer w-5 h-5" onClick={() => onOpenChange(false)} />
          </div>
          <div className='px-5 py-0 h-[calc(100dvh-12rem)] pe-3 -me-3 space-y-5 overflow-y-scroll'>
            <div className='flex flex-col text-card-foreground rounded-xl border border-border black/5 relative items-center justify-center bg-accent/50 mb-6.5 h-[280px] shadow-none'>
              <Image src={product?.imurl || ''} alt={product?.title || ''} width={500} height={500} className='w-full h-full object-contain' />
              {product?.sale && (
                <Badge
                  size="sm"
                  variant="destructive"
                  className="absolute top-4 right-4 uppercase"
                >
                  Giảm {calculateDiscount(product?.price, product?.sale)}%
                </Badge>
              )}
              <Card className="absolute items-center justify-center bg-card w-[75px] h-[45px] overflow-hidden rounded-sm bottom-4 right-4">
                <Image
                  src={'/media/brand-logos/nike-light.svg'}
                  className="dark:hidden"
                  alt="image"
                  width={75}
                  height={45}
                  unoptimized={true}
                />
                <Image
                  src={'/media/brand-logos/nike-dark.svg'}
                  className="hidden dark:block"
                  alt="image"
                  width={75}
                  height={45}
                  unoptimized={true}
                />
              </Card>
            </div>
            <div className="text-base font-medium text-mono mb-3">
              {product?.title}
            </div>
            <div className="text-sm font-normal text-foreground block mb-7">
              {product?.description}
            </div>
            <div className="flex flex-col gap-2.5 lg:mb-11">
              {items.map((item, index) => (
                <div className="flex items-center gap-2.5" key={index}>
                  <span className="text-xs font-normal text-foreground min-w-14 xl:min-w-24 shrink-0">
                    {item.text}
                  </span>
                  <div>
                    {item.text === 'Đánh giá' ? (
                      <Rating rating={product?.averageRating} />
                    ) : (
                      item.text === "Danh mục" ? (
                        product?.categories?.join(', ')
                      ) : (
                        item.info
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-base font-normal text-secondary-foreground line-through">
                {formatCurrency(product?.price)}
              </span>

              <span className="text-lg font-medium text-mono">{formatCurrency(product?.sale)}</span>
            </div>
          </div>
          <div className='w-full flex items-center justify-center px-5 py-3.5 gap-2'>
            <HeartWishlist className='rounded-lg' productId={product?.id}>
              <span className="wishlist-heart-label">Yêu thích</span>
            </HeartWishlist>
            <Button
              onClick={() => {
                addToCart({ productId: product?.id });
              }}
              disabled={!product?.id}
              className="w-full"
            >
              <ShoppingCart />
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
