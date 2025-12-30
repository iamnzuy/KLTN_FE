'use client';

import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { PaymentMethodContent } from '@/app/(app)/checkout/payment-method/content';
import { Steps } from '@/app/(app)/checkout/steps';

export default function PaymentMethodPage() {
  return (
    <Fragment>
      <Steps currentStep={2} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Select how you want to pay</ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </div>
      <div className="container">
        <PaymentMethodContent />
      </div>
    </Fragment>
  );
}
