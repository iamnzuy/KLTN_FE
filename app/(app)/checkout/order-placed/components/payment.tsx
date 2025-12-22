'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';

interface PaymentInfoProps {
  method?: string;
  status?: string;
  amount?: number;
}

const LOGO_MAP: Record<string, string> = {
  visa: '/media/brand-logos/visa.svg',
  paypal: '/media/brand-logos/paypal.svg',
  payos: '/media/brand-logos/visa.svg',
};

export function Payment({
  method = 'PAYOS',
  status = 'Pending',
  amount,
}: PaymentInfoProps) {
  const logoKey = method.toLowerCase();
  const logo = LOGO_MAP[logoKey] || '/media/brand-logos/visa.svg';
  const normalizedStatus = status.toUpperCase();

  return (
    <Card>
      <CardHeader className="px-5 min-h-[44px] flex items-center justify-between">
        <CardTitle className="text-sm">Payment</CardTitle>
        <Badge variant={normalizedStatus === 'PAID' ? 'success' : 'secondary'}>
          {normalizedStatus}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} className="size-12" alt="Payment Method" />
          <div className="flex flex-col gap-0.5 text-2sm">
            <span className="font-semibold text-mono uppercase">{method}</span>
            <span className="font-normal text-mono text-muted-foreground">
              Thanh toán thông qua {method}
            </span>
          </div>
        </div>
        {typeof amount === 'number' && (
          <div className="text-sm text-secondary-foreground">
            Tổng thanh toán:{' '}
            <span className="font-semibold text-mono">
              {formatCurrency(amount)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
