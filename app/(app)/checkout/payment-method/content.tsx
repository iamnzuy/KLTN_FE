'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoveLeft, SquareMousePointer } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Order } from '@/app/(app)/checkout/order-summary/components/order';
import {
  Payment,
  type PayOSCheckoutSession,
  type PayOSPaymentState,
} from '@/app/(app)/checkout/payment-method/components/payment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { paymentApi } from '@/lib/backend-api';
import { useOrder } from '@/hooks/use-orders';

export function PaymentMethodContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const orderId = orderIdParam ? Number(orderIdParam) : null;
  const router = useRouter();
  const { order, loading: orderLoading } = useOrder(orderId);
  const [loading, setLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PayOSCheckoutSession | null>(null);
  const [paymentState, setPaymentState] = useState<PayOSPaymentState>('idle');
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  useEffect(() => {
    setPaymentSession(null);
    setPaymentState('idle');
    setStatusNote(null);
    setRefreshingStatus(false);
  }, [orderId]);

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
  const orderTotal = subtotal + vat + shippingFee;

  const shippingDetails = order?.shippingAddress
    ? order.shippingAddress.split('\n').filter(Boolean)
    : undefined;

  const handleOpenCheckoutWindow = () => {
    if (!paymentSession?.checkoutUrl) return;
    openCheckout(paymentSession.checkoutUrl);
  };

  async function handlePlaceOrder() {
    if (!order?.id) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      return;
    }

    try {
      setLoading(true);
      setStatusNote(null);

      const origin = window.location.origin;
      const returnUrl = `${origin}/checkout/order-placed?orderId=${order.id}`;
      const cancelUrl = `${origin}/checkout/shipping-info`;

      const createResp = await paymentApi.createPaymentLink(order.id, returnUrl, cancelUrl);
      if (createResp.error || !createResp.data) {
        throw new Error(createResp.error || 'Tạo liên kết thanh toán thất bại');
      }

      const session: PayOSCheckoutSession = {
        checkoutUrl: createResp.data.checkoutUrl,
        orderCode: createResp.data.orderCode ?? order.id,
        qrCode: createResp.data.qrCode,
      };

      if (!session.checkoutUrl) {
        throw new Error('Không nhận được URL thanh toán từ PayOS');
      }

      setPaymentSession(session);
      setPaymentState('waiting');
      setStatusNote('Đang chờ bạn hoàn tất thanh toán qua PayOS.');
      openCheckout(session.checkoutUrl);

      const pollResult = await pollPayosStatus(session.orderCode ?? order.id);

      if (pollResult.status === 'success') {
        setPaymentState('paid');
        setStatusNote(pollResult.description ?? 'PayOS xác nhận thanh toán thành công.');
        toast.success('Thanh toán PayOS thành công');
      } else if (pollResult.status === 'failure') {
        setPaymentState('failed');
        setStatusNote(
          pollResult.description ??
            `PayOS báo lỗi với mã ${pollResult.statusCode ?? 'không xác định'}.`,
        );
        toast.error('PayOS báo giao dịch không thành công');
      } else {
        setPaymentState('timeout');
        setStatusNote(
          pollResult.description ??
            'Không nhận được xác nhận thanh toán trong thời gian quy định. Vui lòng kiểm tra lại trang đơn hàng.',
        );
        toast('Thanh toán chưa được xác nhận — vui lòng kiểm tra trang đơn hàng', {
          icon: '⚠️',
        });
      }

      const statusQuery =
        pollResult.status === 'success'
          ? 'paid'
          : pollResult.status === 'failure'
            ? 'failed'
            : 'pending';

      router.push(`/checkout/order-placed?orderId=${order.id}&paymentStatus=${statusQuery}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Lỗi khi xử lý thanh toán PayOS';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefreshStatus() {
    if (!paymentSession?.orderCode) return;
    const redirectOrderId = order?.id ?? orderId ?? paymentSession.orderCode;

    try {
      setRefreshingStatus(true);
      const statusResp = await paymentApi.getPaymentStatus(paymentSession.orderCode);
      if (statusResp.error || !statusResp.data) {
        throw new Error(statusResp.error || 'Không thể kiểm tra trạng thái PayOS');
      }

      const { statusCode, description } = parsePayOsStatus(statusResp.data);

      if (isSuccessStatus(statusCode)) {
        setPaymentState('paid');
        setStatusNote(description ?? 'PayOS xác nhận thanh toán');
        toast.success('PayOS xác nhận thanh toán');
        if (redirectOrderId) {
          router.push(`/checkout/order-placed?orderId=${redirectOrderId}&paymentStatus=paid`);
        }
        return;
      }

      if (isFailureStatus(statusCode)) {
        setPaymentState('failed');
        setStatusNote(description ?? 'PayOS báo giao dịch thất bại');
        toast.error('PayOS báo giao dịch thất bại');
        if (redirectOrderId) {
          router.push(`/checkout/order-placed?orderId=${redirectOrderId}&paymentStatus=failed`);
        }
        return;
      }

      const note =
        description ??
        (statusCode
          ? `PayOS trả về mã trạng thái ${statusCode}. Vui lòng đợi thêm ít phút.`
          : 'Chưa nhận được trạng thái cuối cùng từ PayOS.');
      setStatusNote(note);
      toast.info('PayOS chưa xác nhận thanh toán', { description: note });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể kiểm tra trạng thái PayOS';
      toast.error(message);
    } finally {
      setRefreshingStatus(false);
    }
  }

  const isActionDisabled =
    loading || orderLoading || !orderId || !order || !order.items?.length;

  return (
    <div className="grid xl:grid-cols-3 gap-5 lg:gap-9 mb-5 lg:mb-10">
      <div className="lg:col-span-2 space-y-5">
        {!orderId && (
          <Alert variant="destructive">
            <AlertTitle>Thiếu thông tin đơn hàng</AlertTitle>
            <AlertDescription>
              Vui lòng quay lại bước vận chuyển để tạo đơn hàng trước khi thanh toán.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <Payment
            amount={orderTotal}
            orderId={order?.id ?? orderId}
            session={paymentSession}
            state={paymentState}
            note={statusNote}
            refreshing={refreshingStatus}
            onOpenCheckout={handleOpenCheckoutWindow}
            onRefreshStatus={handleRefreshStatus}
          />
        </div>

        <div className="flex justify-end items-center flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.push('/checkout/shipping-info')}>
            <MoveLeft className="text-base" />
            Shipping Info
          </Button>

          <Button onClick={handlePlaceOrder} disabled={isActionDisabled}>
            {loading ? 'Đang xử lý...' : 'Thanh toán PayOS'}
            <SquareMousePointer className="text-base" />
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="space-y-5">
          <Order
            subtotal={subtotal}
            shipping={shippingFee}
            vat={vat}
            shippingHeadline={shippingDetails ? 'Shipping to' : undefined}
            shippingDetails={shippingDetails}
          />
        </div>
      </div>
    </div>
  );
}

const POLL_TIMEOUT = 90_000;
const POLL_INTERVAL = 4000;

interface PollResult {
  status: 'success' | 'failure' | 'timeout';
  statusCode?: string;
  description?: string;
}

function normalizePayOsStatus(value: unknown): string {
  if (typeof value === 'number') {
    return value === 0 ? '00' : `${value}`;
  }
  if (typeof value === 'string') {
    return value.trim().toUpperCase();
  }
  return '';
}

function isSuccessStatus(status: string) {
  return ['00', 'PAID', 'SUCCESS', 'COMPLETED'].includes(status);
}

function isFailureStatus(status: string) {
  return ['FAILED', 'CANCELLED', 'CANCELED', 'ERROR', 'REFUNDED'].includes(status);
}

function parsePayOsStatus(payload: any) {
  return {
    statusCode: normalizePayOsStatus(payload?.status ?? payload?.code),
    description: payload?.description ?? payload?.desc,
  };
}

async function pollPayosStatus(orderCode: number): Promise<PollResult> {
  const start = Date.now();

  while (Date.now() - start < POLL_TIMEOUT) {
    await delay(POLL_INTERVAL);
    const statusResp = await paymentApi.getPaymentStatus(orderCode);
    if (statusResp.error || !statusResp.data) {
      continue;
    }

    const { statusCode, description } = parsePayOsStatus(statusResp.data);

    if (isSuccessStatus(statusCode)) {
      return { status: 'success', statusCode, description };
    }

    if (isFailureStatus(statusCode)) {
      return { status: 'failure', statusCode, description };
    }
  }

  return { status: 'timeout' };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function openCheckout(url: string) {
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) {
    window.location.assign(url);
  }
}
