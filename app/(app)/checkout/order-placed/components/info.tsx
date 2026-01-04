'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderDeliveryInfoProps {
  recipient?: string;
  details?: string[];
}

export function Info({
  recipient = 'Customer',
  details = ['Vui lòng kiểm tra lại địa chỉ giao hàng.'],
}: OrderDeliveryInfoProps) {
  return (
    <Card>
      <CardHeader className="px-5 min-h-[44px]">
        <CardTitle className="text-sm">Giao hàng đến</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-sm font-semibold text-mono mb-2.5">
          {recipient}
        </div>

        <div className="flex flex-col gap-2 text-2sm font-normal text-mono">
          {details.map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
