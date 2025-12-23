'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CalendarClock, ClipboardList, Truck } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckoutItemList } from '@/app/(app)/checkout/components/checkout-item-list';
import { formatCurrency } from '@/utils/currency';
import { useOrders, Order } from '@/hooks/use-orders';
import useAuth from '@/hooks/use-auth';

const statusVariantMap: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> =
  {
    completed: 'success',
    paid: 'success',
    processing: 'warning',
    pending: 'secondary',
    cancelled: 'destructive',
    canceled: 'destructive',
    failed: 'destructive',
  };

function getStatusVariant(status?: string) {
  if (!status) return 'secondary';
  const key = status.toLowerCase();
  return statusVariantMap[key] ?? 'secondary';
}

export function MyOrders() {
  const { profile } = useAuth({ revalidateOnMount: true });
  const userId = profile?.userId ?? null;
  const { orders, loading, error, refetch } = useOrders(userId);

  const normalizedOrders = useMemo<Order[]>(() => {
    if (Array.isArray(orders)) return orders;
    return [];
  }, [orders]);

  const renderSkeleton = () => (
    <Card className="shadow-none border-dashed">
      <CardHeader className="flex flex-wrap gap-5 bg-muted/40 py-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className="flex w-40 flex-col gap-2">
            <div className="h-3 w-20 rounded bg-accent/60 animate-pulse" />
            <div className="h-4 w-28 rounded bg-accent/70 animate-pulse" />
          </div>
        ))}
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={`skeleton-item-${idx}`} className="h-16 rounded-lg bg-accent/40 animate-pulse" />
        ))}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={`loading-card-${idx}`}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không thể tải đơn hàng</AlertTitle>
        <AlertDescription>
          Vui lòng thử tải lại trang hoặc kiểm tra kết nối mạng của bạn.
        </AlertDescription>
        <Button size="sm" className="mt-4 w-fit" onClick={() => refetch()}>
          Thử lại
        </Button>
      </Alert>
    );
  }

  if (!normalizedOrders.length) {
    return (
      <Card className="bg-accent/40 text-center shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <ClipboardList className="h-10 w-10 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">Bạn chưa có đơn hàng nào</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Khi hoàn tất thanh toán, đơn hàng của bạn sẽ xuất hiện tại đây để tiện theo dõi.
          </p>
          <Button asChild>
            <Link href="/">Tiếp tục mua sắm</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {normalizedOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN')
    : '—';
  const subtotal =
    order.items?.reduce(
      (total, item) =>
        total + Number(item.unitPrice ?? item.product?.price ?? 0) * (item.quantity ?? 1),
      0,
    ) ?? 0;
  const orderTotal = Number(order.totalAmount ?? subtotal);
  const shippingLines = order.shippingAddress
    ? order.shippingAddress.split('\n').filter(Boolean)
    : [];
  const recipient = shippingLines[0] ?? '—';
  const shippingDetails = shippingLines.slice(1);

  return (
    <Card>
      <CardHeader className="flex flex-wrap gap-6 bg-muted/50 py-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Order ID</span>
          <span className="text-sm font-semibold text-foreground">{order.id}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Order placed</span>
          <span className="text-sm font-medium text-foreground">{createdAt}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(orderTotal)}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Status</span>
          <Badge variant={getStatusVariant(order.status)} className="w-fit uppercase">
            {order.status || 'PENDING'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5 lg:p-7">
        <CheckoutItemList
          items={order.items ?? []}
          emptyMessage="Đơn hàng không có sản phẩm."
        />

        <div className="grid gap-4 border border-dashed border-border/80 rounded-lg p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Giao tới
            </div>
            <p className="text-sm font-semibold text-foreground">{recipient}</p>
            {shippingDetails.length ? (
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                {shippingDetails.map((line, idx) => (
                  <span key={`${order.id}-address-${idx}`}>{line}</span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Chưa cập nhật địa chỉ.</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              Thanh toán
            </div>
            <p className="text-xs text-muted-foreground">
              Phương thức: {order.paymentMethod ?? 'PayOS'}
            </p>
            <p className="text-xs text-muted-foreground">
              Trạng thái: {order.paymentStatus ?? order.status ?? 'Pending'}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        <span className="text-sm text-muted-foreground">
          Tổng thanh toán: <strong className="text-foreground">{formatCurrency(orderTotal)}</strong>
        </span>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild size="sm">
            <Link href={`/order-receipt?orderId=${order.id}`}>Xem biên nhận</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/checkout/order-summary?reorder=${order.id}`}>Mua lại</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
