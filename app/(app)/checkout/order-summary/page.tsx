'use client';

import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { OrderSummaryContent } from '@/app/(app)/checkout/order-summary/content';
import { Steps } from '@/app/(app)/checkout/steps';

export default function OrderSummaryPage() {
  return (
    <Fragment>
      <Steps currentStep={0} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Kiểm tra giỏ hàng của bạn trước khi thanh toán
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </div>
      <div className="container">
        <OrderSummaryContent />
      </div>
    </Fragment>
  );
}
