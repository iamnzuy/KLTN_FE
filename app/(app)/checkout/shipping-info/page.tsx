'use client';

import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { ShippingInfoContent } from '@/app/(app)/checkout/shipping-info/content';
import { Steps } from '@/app/(app)/checkout/steps';

export default function ShippingInfoPage() {
  return (
    <Fragment>
      <Steps currentStep={1} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Vui lòng nhập thông tin giao hàng bên dưới
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </div>
      <div className="container">
        <ShippingInfoContent />
      </div>
    </Fragment>
  );
}
