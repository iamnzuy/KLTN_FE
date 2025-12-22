'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';

export interface IOrderItem {
  label: string;
  amount: number;
}
export type IOrderItems = Array<IOrderItem>;

interface OrderProps {
  subtotal?: number;
  shipping?: number;
  vat?: number;
  total?: number;
  title?: string;
  shippingHeadline?: string;
  shippingDetails?: string[];
}

export function Order({
  subtotal = 0,
  shipping = 0,
  vat = 0,
  total,
  title = 'Order Summary',
  shippingHeadline,
  shippingDetails,
}: OrderProps) {
  const items: IOrderItems = [
    { label: 'Subtotal', amount: subtotal },
    { label: 'Shipping', amount: shipping },
    { label: 'VAT', amount: vat },
  ];

  const computedTotal = total ?? subtotal + shipping + vat;

  const renderItem = (item: IOrderItem, index: number) => (
    <div key={item.label} className="flex justify-between items-center">
      <span className="text-sm font-normal text-secondary-foreground">
        {item.label}
      </span>
      <span className="text-sm font-medium text-mono">
        {formatCurrency(item.amount)}
      </span>
    </div>
  );

  return (
    <Card className="bg-accent/50">
      <CardHeader className="px-5">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="px-5 py-4 space-y-4">
        {shippingHeadline && shippingDetails?.length ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-mono">
              {shippingHeadline}
            </span>
            <div className="flex flex-col gap-1 text-xs font-normal text-secondary-foreground">
              {shippingDetails.map((line, idx) => (
                <span key={`${line}-${idx}`}>{line}</span>
              ))}
            </div>
            <div className="border-b border-border" />
          </div>
        ) : null}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-mono">Price Details</h4>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-5">
        <span className="text-sm font-normal text-secondary-foreground">
          Total
        </span>
        <span className="text-base font-semibold text-mono">
          {formatCurrency(computedTotal)}
        </span>
      </CardFooter>
    </Card>
  );
}
