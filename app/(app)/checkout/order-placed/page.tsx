'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { Captions } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderPlacedContent } from '@/app/(app)/checkout/order-placed/content';
import { Steps } from '@/app/(app)/checkout/steps';

export default function OrderPlacedPage() {
  return (
    <Fragment>
      <Steps currentStep={3} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Đơn hàng của bạn đã được đặt thành công
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline">
              <Captions />
              <Link href="/my-orders">Đơn hàng của tôi</Link>
            </Button>
            <Button>
              <Captions />
              <Link href="/search-results">Tiếp tục mua sắm</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <OrderPlacedContent />
      </div>
    </Fragment>
  );
}
