'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Info } from '@/app/(app)/checkout/order-placed/components/info';
import { Payment } from '@/app/(app)/checkout/order-placed/components/payment';
import { Order } from '@/app/(app)/checkout/order-summary/components/order';
import { CheckoutItemList } from '@/app/(app)/checkout/components/checkout-item-list';
import { useOrder } from '@/hooks/use-orders';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/currency';

export function OrderPlacedContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const orderId = orderIdParam ? Number(orderIdParam) : null;
  const paymentStatusParam = searchParams.get('paymentStatus');
  const payosStatusParam = searchParams.get('status');
  const payosCodeParam = searchParams.get('code');
  const payosDescParam = searchParams.get('desc') ?? searchParams.get('description');
  const { order, loading } = useOrder(orderId);
  const normalizedReturnStatus = normalizeReturnStatus(
    paymentStatusParam,
    payosStatusParam,
    payosCodeParam,
  );
  const paymentAlert = normalizedReturnStatus
    ? buildPaymentAlert(normalizedReturnStatus, payosDescParam ?? undefined)
    : null;

  const subtotal = useMemo(
    () =>
      order?.items?.reduce(
        (total: number, item: any) =>
          total + (item?.unitPrice || item?.product?.price || 0) * (item?.quantity || 0),
        0,
      ) ?? 0,
    [order],
  );
  const vat = subtotal * 0.1;
  const shippingFee = 0;

  const shippingLines = order?.shippingAddress
    ? order.shippingAddress.split('\n').filter(Boolean)
    : [];
  const recipient = shippingLines[0];
  const deliveryDetails = shippingLines.slice(1);

  const orderTotal = order?.totalAmount ?? subtotal + vat + shippingFee;
  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN')
    : '—';

  return (
    <div className="grid xl:grid-cols-3 gap-5 lg:gap-9">
      <div className="lg:col-span-2 space-y-5">
        {paymentAlert && (
          <Alert variant={paymentAlert.variant}>
            <AlertTitle>{paymentAlert.title}</AlertTitle>
            <AlertDescription>{paymentAlert.description}</AlertDescription>
          </Alert>
        )}
        {(!orderId || (!order && !loading)) && (
          <Alert variant="destructive">
            <AlertTitle>Không tìm thấy đơn hàng</AlertTitle>
            <AlertDescription>
              Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang đơn hàng.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 gap-5 lg:gap-9">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="justify-start bg-muted/70 gap-9 h-auto py-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-secondary-foreground">
                    Order ID
                  </span>
                  <span className="text-sm font-medium text-mono">
                    {order?.id ?? '—'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-secondary-foreground">
                    Order placed
                  </span>
                  <span className="text-sm font-medium text-mono">
                    {createdAt}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-secondary-foreground">
                    Total
                  </span>
                  <span className="text-sm font-medium text-mono">
                    {formatCurrency(orderTotal)}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-secondary-foreground">
                    Status
                  </span>
                  <span className="text-sm font-medium text-mono uppercase">
                    {order?.status || 'PENDING'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 lg:p-7.5 space-y-5">
                <CheckoutItemList
                  items={order?.items ?? []}
                  emptyMessage={
                    loading
                      ? 'Đang tải chi tiết đơn hàng...'
                      : 'Không có sản phẩm trong đơn hàng.'
                  }
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:gap-9">
            <Payment
              method={order?.paymentMethod ?? 'PAYOS'}
              status={order?.paymentStatus ?? order?.status}
              amount={orderTotal}
            />
            <Info recipient={recipient} details={deliveryDetails} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="space-y-5">
          <Order
            subtotal={subtotal}
            shipping={shippingFee}
            vat={vat}
            total={orderTotal}
            shippingHeadline={deliveryDetails.length ? 'Shipping to' : undefined}
            shippingDetails={deliveryDetails.length ? deliveryDetails : undefined}
          />
        </div>
      </div>
    </div>
  );
}

type ReturnStatus = 'success' | 'failed' | 'pending';

function normalizeReturnStatus(
  ...statuses: Array<string | null>
): ReturnStatus | null {
  for (const status of statuses) {
    if (!status) continue;
    const value = status.trim().toLowerCase();
    if (['paid', 'success', 'succeeded', 'completed', '00', '0'].includes(value)) {
      return 'success';
    }
    if (['failed', 'failure', 'canceled', 'cancelled', '01', '99', 'error'].includes(value)) {
      return 'failed';
    }
    if (['pending', 'timeout', 'processing', 'waiting'].includes(value)) {
      return 'pending';
    }
  }
  return null;
}

function buildPaymentAlert(
  status: ReturnStatus,
  description?: string,
): {
  variant: 'success' | 'warning' | 'destructive';
  title: string;
  description: string;
} {
  if (status === 'success') {
    return {
      variant: 'success',
      title: 'PayOS xác nhận thanh toán',
      description: description ?? 'Chúng tôi đã nhận được xác nhận thanh toán từ PayOS.',
    };
  }

  if (status === 'failed') {
    return {
      variant: 'destructive',
      title: 'PayOS báo giao dịch thất bại',
      description:
        description ?? 'Giao dịch chưa thành công. Vui lòng thử lại hoặc chọn phương thức khác.',
    };
  }

  return {
    variant: 'warning',
    title: 'Đang chờ PayOS xác nhận',
    description:
      description ??
      'Nếu bạn đã thanh toán, vui lòng chờ thêm ít phút hoặc kiểm tra lịch sử giao dịch.',
  };
}
