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
import { WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          <ToolbarActions>
            <Button variant="outline">
              <WalletCards />
              <Link href="#">Add Cart</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <PaymentMethodContent />
      </div>
    </Fragment>
  );
}
