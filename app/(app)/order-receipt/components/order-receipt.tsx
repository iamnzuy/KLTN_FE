'use client';

import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ListChecks } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckoutItemList } from '@/app/(app)/checkout/components/checkout-item-list';
import { Order as OrderSummary } from '@/app/(app)/checkout/order-summary/components/order';
import { formatCurrency } from '@/utils/currency';
import { useOrder } from '@/hooks/use-orders';

const statusProgressMap: Record<string, number> = {
  pending: 30,
  processing: 60,
  shipped: 80,
  completed: 100,
  delivered: 100,
  cancelled: 0,
  canceled: 0,
  failed: 0,
};

function getProgressValue(status?: string) {
  if (!status) return 30;
  return statusProgressMap[status.toLowerCase()] ?? 50;
}

export function OrderReceipt() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const parsedOrderId = orderIdParam ? Number(orderIdParam) : NaN;
  const orderId = Number.isFinite(parsedOrderId) ? parsedOrderId : null;
  const isOrderIdMissing = !orderIdParam || !Number.isFinite(parsedOrderId);
  const { order, loading, error } = useOrder(orderId);

  const subtotal = useMemo(
    () =>
      order?.items?.reduce(
        (total, item) =>
          total + Number(item.unitPrice ?? item.product?.price ?? 0) * (item.quantity ?? 1),
        0,
      ) ?? 0,
    [order],
  );
  const vat = subtotal * 0.1;
  const shipping = 0;
  const total = Number(order?.totalAmount ?? subtotal + vat + shipping);
  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN')
    : '—';
  const shippingLines = order?.shippingAddress
    ? order.shippingAddress.split('\n').filter(Boolean)
    : [];
  const recipient = shippingLines[0] ?? '—';
  const deliveryDetails = shippingLines.slice(1);
  const progressValue = getProgressValue(order?.status);

  return (
    <Fragment>
      <div className="py-10">
        <Card className="mx-auto w-full max-w-[840px] overflow-hidden px-0">
          <Progress
            value={progressValue}
            className="h-[8px]"
            indicatorClassName="bg-[linear-gradient(90deg,#D618A3_0%,#1951E0_32.67%,#12C79C_67.17%,#DFBB19_100%)]"
          />
          <div
            className="mb-5 space-y-5 px-6 py-10 text-center"
            id="order_receipt_body"
          >
            <div className="flex flex-col items-center gap-3">
              <Link href="/" className="shrink-0" aria-label="Quay lại trang chủ">
                <img
                  src={'/media/storely-logos/logo-text-light.svg'}
                  className="dark:hidden"
                  alt="Storely"
                />
                <img
                  src={'/media/storely-logos/logo-text-dark.svg'}
                  className="hidden dark:inline-block"
                  alt="Storely"
                />
              </Link>

              <h3 className="mt-6 text-2xl font-semibold text-foreground">
                Order Confirmation
              </h3>
              <span className="text-sm font-medium text-muted-foreground">
                {order
                  ? (
                    <>
                      Cảm ơn bạn! Đơn hàng{' '}
                      <span className="font-semibold text-foreground">
                        #{order.id}
                      </span>{' '}
                      đang được xử lý.
                    </>
                    )
                  : 'Vui lòng cung cấp mã đơn hàng để xem biên nhận.'}
              </span>
            </div>

            {(error || isOrderIdMissing) && (
              <Alert
                variant={isOrderIdMissing && !error ? 'warning' : 'destructive'}
                className="text-left"
              >
                <AlertTitle>Không thể tải đơn hàng</AlertTitle>
                <AlertDescription>
                  {isOrderIdMissing
                    ? 'Thiếu thông tin orderId. Vui lòng truy cập từ trang Đơn hàng của bạn.'
                    : 'Chúng tôi không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại.'}
                </AlertDescription>
              </Alert>
            )}

            {loading && !order && (
              <Card className="bg-accent/40 shadow-none">
                <div className="space-y-3 px-5 py-10 text-left text-sm text-muted-foreground">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-accent/80" />
                  <div className="h-12 animate-pulse rounded bg-accent/60" />
                  <div className="h-12 animate-pulse rounded bg-accent/60" />
                </div>
              </Card>
            )}

            {order && (
              <>
                <div className="space-y-5 text-left">
                  <CheckoutItemList
                    items={order.items ?? []}
                    emptyMessage="Đơn hàng chưa có sản phẩm nào."
                  />

                  <Card className="bg-muted/70 px-5 py-4 shadow-none">
                    <div className="grid gap-5 md:grid-cols-4">
                      <ReceiptMeta label="Order ID" value={`#${order.id}`} />
                      <ReceiptMeta label="Order placed" value={createdAt} />
                      <ReceiptMeta label="Total" value={formatCurrency(total)} />
                      <ReceiptMeta label="Status" value={order.status ?? 'PENDING'} />
                    </div>
                  </Card>

                  <Card className="bg-accent/50 px-5 py-4 shadow-none">
                    <div className="grid gap-5 md:grid-cols-2">
                      <ReceiptMeta label="Ship to" value={recipient} details={deliveryDetails} />
                      <ReceiptMeta
                        label="Payment"
                        value={order.paymentMethod ?? 'PayOS'}
                        details={[
                          `Status: ${order.paymentStatus ?? order.status ?? 'Pending'}`,
                          order.paymentCode ? `Mã thanh toán: ${order.paymentCode}` : undefined,
                        ].filter(Boolean) as string[]}
                      />
                    </div>
                  </Card>
                </div>

                <OrderSummary
                  subtotal={subtotal}
                  vat={vat}
                  shipping={shipping}
                  total={total}
                  shippingHeadline={deliveryDetails.length ? 'Shipping to' : undefined}
                  shippingDetails={deliveryDetails.length ? deliveryDetails : undefined}
                />
              </>
            )}

            <Button variant="outline" className="mt-5" asChild>
              <Link href="/my-orders" className="inline-flex items-center gap-2">
                <ListChecks />
                My Orders
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </Fragment>
  );
}

function ReceiptMeta({
  label,
  value,
  details,
}: {
  label: string;
  value: string;
  details?: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-normal text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
      {details?.length ? (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {details.map((detail, idx) => (
            <span key={`${label}-${idx}`}>{detail}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
