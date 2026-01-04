'use client';

import { useCallback } from 'react';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';

export type PayOSPaymentState = 'idle' | 'waiting' | 'paid' | 'timeout' | 'failed';

export interface PayOSCheckoutSession {
  orderCode?: number;
  checkoutUrl?: string;
  qrCode?: string;
}

interface PaymentProps {
  amount: number;
  orderId: number | null;
  session: PayOSCheckoutSession | null;
  state: PayOSPaymentState;
  note?: string | null;
  refreshing?: boolean;
  onOpenCheckout?: () => void;
  onRefreshStatus?: () => void;
}

const STATE_LABELS: Record<PayOSPaymentState, string> = {
  idle: 'Chưa khởi tạo',
  waiting: 'Đang chờ thanh toán',
  paid: 'Đã thanh toán',
  timeout: 'Đang chờ xác nhận',
  failed: 'Thanh toán thất bại',
};

const STATE_BADGES: Record<
  PayOSPaymentState,
  { variant: BadgeProps['variant']; appearance?: BadgeProps['appearance'] }
> = {
  idle: { variant: 'secondary', appearance: 'outline' },
  waiting: { variant: 'warning', appearance: 'outline' },
  paid: { variant: 'success', appearance: 'outline' },
  timeout: { variant: 'info', appearance: 'outline' },
  failed: { variant: 'destructive', appearance: 'outline' },
};

export function Payment({
  amount,
  orderId,
  session,
  state,
  note,
  refreshing = false,
  onOpenCheckout,
  onRefreshStatus,
}: PaymentProps) {
  const badgeConfig = STATE_BADGES[state];
  const canOpenCheckout = Boolean(session?.checkoutUrl && onOpenCheckout);
  const canRefresh = Boolean(session?.orderCode && onRefreshStatus);

  const handleCopyOrderCode = useCallback(async () => {
    if (!session?.orderCode) return;
    try {
      await navigator.clipboard.writeText(String(session.orderCode));
      toast.success('Đã sao chép PayOS order code');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể sao chép order code';
      toast.error(message);
    }
  }, [session?.orderCode]);

  return (
    <Card>
      <CardHeader className="px-5 flex-row items-center justify-between gap-4">
        <CardTitle className="text-sm">Thanh toán qua PayOS</CardTitle>
        <Badge
          variant={badgeConfig.variant}
          appearance={badgeConfig.appearance}
          className="uppercase tracking-wide"
        >
          {STATE_LABELS[state]}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Mã đơn hàng hệ thống</span>
            <span className="font-mono text-base">{orderId ?? '—'}</span>
          </div>

          {session?.orderCode ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Mã đơn hàng PayOS</span>
                <span className="font-mono text-base">{session.orderCode}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={handleCopyOrderCode}
                aria-label="Sao chép mã đơn hàng PayOS"
              >
                <Copy className="size-4" />
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Nhấn &quot;Thanh toán ngay&quot; để tạo liên kết thanh toán PayOS cho đơn hàng của bạn.
            </p>
          )}

          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Tổng thanh toán</span>
            <span className="text-base font-semibold">{formatCurrency(amount)}</span>
          </div>
        </div>

        {session?.qrCode && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 p-4 text-center">
            <img
              src={session.qrCode}
              alt="Mã QR PayOS"
              className="h-48 w-48 object-contain"
            />
            <p className="text-xs text-muted-foreground">
              Quét QR hoặc mở trang PayOS để chuyển khoản đúng nội dung và số tiền.
            </p>
          </div>
        )}

        {note && (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            {note}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            className="flex-1 min-w-36"
            variant="secondary"
            onClick={onOpenCheckout}
            disabled={!canOpenCheckout}
          >
            <ExternalLink className="size-4 mr-2" />
            Mở trang PayOS
          </Button>
          <Button
            className="flex-1 min-w-36"
            variant="outline"
            onClick={onRefreshStatus}
            disabled={!canRefresh || refreshing}
          >
            <RefreshCw
              className={cn('size-4 mr-2', refreshing ? 'animate-spin' : 'text-muted-foreground')}
            />
            {refreshing ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

