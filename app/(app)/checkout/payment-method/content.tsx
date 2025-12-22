'use client';

import Link from 'next/link';
import { MoveLeft, SquareMousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Payment } from '@/app/(app)/checkout/payment-method/components/payment';
import { Order } from '@/app/(app)/checkout/shipping-info/components/order';
import { useState } from 'react';
import useAuth from '@/hooks/use-auth';
import { orderApi, paymentApi } from '@/lib/backend-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function PaymentMethodContent() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  async function handlePlaceOrder() {
    try {
      setLoading(true);

      const userId = auth.profile?.userId;
      if (!userId) {
        toast.error('Vui lòng đăng nhập để đặt hàng');
        setLoading(false);
        return;
      }

      // Fetch latest orders for user and pick the most recent one
      const ordersResp = await orderApi.getUserOrders(userId);
      if (ordersResp.error || !ordersResp.data || ordersResp.data.length === 0) {
        toast.error('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại.');
        setLoading(false);
        return;
      }

      const orders = ordersResp.data;
      orders.sort((a: any, b: any) => b.id - a.id);
      const latestOrder = orders[0];

      // Build return / cancel URLs
      const origin = window.location.origin;
      const returnUrl = `${origin}/checkout/order-placed?orderId=${latestOrder.id}`;
      const cancelUrl = `${origin}/checkout/shipping-info`;

      const createResp = await paymentApi.createPaymentLink(latestOrder.id, returnUrl, cancelUrl);
      if (createResp.error || !createResp.data) {
        toast.error('Tạo liên kết thanh toán thất bại');
        setLoading(false);
        return;
      }

      const { checkoutUrl, orderCode } = createResp.data;
      if (!checkoutUrl) {
        toast.error('Không nhận được URL thanh toán từ server');
        setLoading(false);
        return;
      }

      // Open PayOS checkout in new tab/window
      window.open(checkoutUrl, '_blank');

      // Poll payment status for a short period
      const pollTimeout = 60_000; // 60s
      const pollInterval = 3000; // 3s
      const start = Date.now();
      let paid = false;

      while (Date.now() - start < pollTimeout && !paid) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, pollInterval));
        // eslint-disable-next-line no-await-in-loop
        const statusResp = await paymentApi.getPaymentStatus(orderCode || latestOrder.id);
        if (!statusResp.error && statusResp.data) {
          const status = statusResp.data.status || statusResp.data.code;
          if (status === '00' || status === 0) {
            paid = true;
            break;
          }
        }
      }

      if (paid) {
        toast.success('Thanh toán thành công');
        router.push(`/checkout/order-placed?orderId=${latestOrder.id}`);
      } else {
        toast('Thanh toán chưa được xác nhận — kiểm tra trang đơn hàng', { icon: '⚠️' });
        router.push(`/checkout/order-placed?orderId=${latestOrder.id}`);
      }
    } catch (err) {
      toast.error('Lỗi khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid xl:grid-cols-3 gap-5 lg:gap-9 mb-5 lg:mb-10">
      <div className="lg:col-span-2 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Payment />
        </div>
        <div className="flex justify-end items-center flex-wrap gap-3">
          <Button variant="outline">
            <MoveLeft className="text-base" />
            <Link href="/checkout/shipping-info">Shipping Info</Link>
          </Button>

          <Button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
            <SquareMousePointer className="text-base" />
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="space-y-5">
          <Order />
        </div>
      </div>
    </div>
  );
}
