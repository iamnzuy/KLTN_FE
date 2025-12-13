'use client';

import Link from 'next/link';
import { ShoppingCart, TrashIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChangeEvent, useMemo, useRef } from 'react';
import { useDebounceCallback, useOnClickOutside } from 'usehooks-ts';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import Image from 'next/image';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import AxiosAPI from '@/lib/axios';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

export function CartSheet({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const ref = useRef<any>(null);
  useOnClickOutside(ref, () => onOpenChange(false));

  const { data, mutate } = useSWR(open ? "/api/carts" : null, configSWR);
  const { items } = data?.data || {};
  const isEmpty = !items?.length;

  const cartId = data?.data?.id;
  // const handleChangeQuantity = useDebounceCallback((e: ChangeEvent<HTMLInputElement>, itemId: string | number) => {
  //   AxiosAPI.patch(`/api/carts/${1}/items/${itemId}?quantity=${e.target.value}`).then(() => { mutate() });
  // }, 1000);

  const handleChangeQuantity = useDebounceCallback((e: ChangeEvent<HTMLInputElement>, itemId: string | number) => {
    AxiosAPI.patch(`/api/carts/${cartId}/items/${itemId}?quantity=${e.target.value}`).then(() => { mutate() });
  }, 1000);

  const handleDeleteItem = (itemId: string | number) => {
    AxiosAPI.delete(`/api/carts/items/${itemId}`).then(() => { mutate() });
  };

  const clearAllCart = () => {
    AxiosAPI.delete("/api/carts/items").then(() => { mutate() });
  }

  const checkoutCart = () => {
    AxiosAPI.post(`/api/carts/${cartId}/checkout`).then(() => {
      mutate();
      onOpenChange(false);
    });
  }

  const totalCostCart = useMemo(() => {
    return items?.reduce((acc: number, item: any) => acc + (item?.unitPrice || 0) * (item?.quantity || 0), 0);
  }, [items]);

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
            Cart
            <X className="text-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer w-5 h-5" onClick={() => onOpenChange(false)} />
          </div>
          <div className='px-5 py-0 h-[calc(100dvh-12rem)] pe-3 -me-3 space-y-5 overflow-y-scroll'>
            {isEmpty ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center py-10">
                <div className="mb-4 rounded-full border border-border bg-accent/50 p-4">
                  <ShoppingCart className="w-7 h-7 text-muted-foreground" />
                </div>
                <div className="text-base font-medium text-foreground">Giỏ hàng đang trống</div>
                <div className="mt-1 text-sm text-muted-foreground max-w-[320px]">
                  Bạn chưa có sản phẩm nào trong giỏ. Hãy chọn sản phẩm yêu thích và quay lại đây nhé.
                </div>
                <Button asChild variant="primary" className="mt-5">
                  <Link href="/" onClick={() => onOpenChange(false)}>
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {items?.map((item: any, index: number) => (
                  <Card className="mb-5" key={index}>
                    <CardContent className="p-2 pe-5 flex items-center flex-wrap sm:flex-nowrap w-full justify-between gap-3.5">
                      <div className="flex group md:items-center gap-4 w-4/5">
                        <Image
                          src={item?.product?.imurl}
                          className="rounded-xl border border-border bg-accent/50 h-[70px] w-[90px] shrink-0"
                          alt="img"
                          unoptimized={true}
                          width={70}
                          height={70}
                        />

                        <div className="flex flex-col justify-center gap-2.5 -mt-1 flex-1 flex-shrink-0">
                          <Link
                            href="#"
                            className="group-hover:text-primary text-sm font-medium text-mono leading-5.5"
                          >
                            {item?.product?.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-normal text-secondary-foreground">
                              SKU:{' '}
                              <span className="text-xs font-medium text-foreground">
                                {item.product?.sku}
                              </span>
                            </span>
                            {item?.product?.sale && (
                              <Badge
                                size="sm"
                                variant="destructive"
                                className="uppercase shrink-0"
                              >
                                save {calculateDiscount(item?.unitPrice, item?.product?.sale || 0)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center flex-col gap-3">
                        <div className="flex items-center sm:justify-end gap-2">
                          <input type="number" onChange={(e) => handleChangeQuantity(e, item.id)} min={1} defaultValue={item.quantity} className='w-14 rounded-md border text-center' />
                          <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="outline" mode="icon">
                            <TrashIcon />
                          </Button>
                        </div>

                        <div className="flex items-center sm:justify-end gap-3">
                          {item.label && (
                            <span className="text-sm font-normal text-secondary-foreground line-through">
                              {item.label}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-mono">
                            {formatCurrency(item?.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex items-center justify-end border-none rounded-md bg-accent/50 gap-5 py-2 px-3 !mt-[30px]">
                  <span className="text-sm font-medium text-mono">Total</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(totalCostCart)}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-row border-t py-3.5 px-5 border-border gap-2">
            <Button onClick={clearAllCart} variant="outline" disabled={isEmpty}>Clear Cart</Button>
            <Button onClick={checkoutCart} variant="primary" className="grow" disabled={isEmpty}>
              <ShoppingCart />
              Checkout
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
