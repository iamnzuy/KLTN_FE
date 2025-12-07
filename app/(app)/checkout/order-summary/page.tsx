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

import { BaggageClaim } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderSummaryContent } from '@/app/(app)/checkout/order-summary/content';
import { Steps } from '@/app/(app)/checkout/steps';
import { useStoreClient } from '@/app/(app)/components/context';

export default function OrderSummaryPage() {
  const { showCartSheet } = useStoreClient();
  return (
    <Fragment>
      <Steps currentStep={0} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Review your items before checkout
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" onClick={showCartSheet}>
              <BaggageClaim />
              <Link href="#">View Cart</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <OrderSummaryContent />
      </div>
    </Fragment>
  );
}
