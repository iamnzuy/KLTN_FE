'use client';

import { useMemo } from 'react';
import { MoveRight } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Order } from '@/app/(app)/checkout/order-summary/components/order';
import { CheckoutItemList } from '@/app/(app)/checkout/components/checkout-item-list';
import { configSWR } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function OrderSummaryContent() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR('/api/carts', configSWR);
  const cart = data?.data;
  const cartItems = cart?.items ?? [];

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total: number, item: any) =>
          total + (item?.unitPrice || item?.product?.price || 0) * (item?.quantity || 0),
        0,
      ),
    [cartItems],
  );
  const vat = subtotal * 0.1;
  const shippingFee = 0;
  const isEmpty = !cartItems.length;

  const handleProceed = () => {
    if (isEmpty) return;
    router.push('/checkout/shipping-info');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-9 mb-5 lg:mb-10">
      <div className="col-span-2 space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Không thể tải giỏ hàng</AlertTitle>
            <AlertDescription>Vui lòng thử lại sau.</AlertDescription>
          </Alert>
        )}
        <CheckoutItemList
          items={cartItems}
          emptyMessage={
            isLoading
              ? 'Đang tải giỏ hàng...'
              : 'Giỏ hàng của bạn đang trống.'
          }
        />
        <div className="flex justify-end items-center flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            onClick={handleProceed}
            disabled={isEmpty || isLoading}
          >
            Shipping Info
            <MoveRight className="text-base" />
          </Button>
        </div>
      </div>

      <div className="col-span-1">
        <div className="space-y-5">
          <Order subtotal={subtotal} shipping={shippingFee} vat={vat} />
        </div>
      </div>
    </div>
  );
}
