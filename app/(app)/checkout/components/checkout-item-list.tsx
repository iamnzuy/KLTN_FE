'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';

interface CheckoutProduct {
  id?: string;
  title?: string;
  imurl?: string;
  sku?: string;
  price?: number;
}

interface CheckoutItem {
  id?: number | string;
  productId?: string;
  product?: CheckoutProduct;
  quantity?: number;
  unitPrice?: number;
}

interface CheckoutItemListProps {
  items: CheckoutItem[];
  emptyMessage?: string;
}

const FALLBACK_IMAGE = '/no_photo.png';

export function CheckoutItemList({
  items,
  emptyMessage = 'Chưa có sản phẩm trong giỏ hàng.',
}: CheckoutItemListProps) {
  if (!items?.length) {
    return (
      <Card className="border-dashed bg-accent/40">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const quantity = item.quantity ?? 1;
        const price =
          item.unitPrice ??
          item.product?.price ??
          0;
        const productId = item.productId || item.product?.id;

        return (
          <Card key={`${productId}-${item.id}`}>
            <CardContent className="flex items-center gap-4 p-3 pe-5">
              <div className="h-[70px] w-[90px] rounded-xl border border-border bg-accent/50 flex items-center justify-center overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product?.imurl || FALLBACK_IMAGE}
                  alt={item.product?.title || 'Product image'}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  {productId ? (
                    <Link
                      href={`/product-details/${productId}`}
                      className="text-sm font-semibold text-mono hover:text-primary"
                    >
                      {item.product?.title || 'Sản phẩm'}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-mono">
                      {item.product?.title || 'Sản phẩm'}
                    </span>
                  )}
                  {item.product?.sku && (
                    <span className="text-xs text-muted-foreground">
                      SKU: {item.product.sku}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Số lượng: {quantity}
                  </span>
                  <span className="text-sm font-semibold text-mono">
                    {formatCurrency(price * quantity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

