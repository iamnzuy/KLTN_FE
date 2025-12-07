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
import { MyOrdersContent } from '@/app/(app)/my-orders/content';

export default function MyOrdersPage() {
  return (
    <Fragment>
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>View and manage your orders</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline">
              <BaggageClaim />
              <Link href="#">Continue Shopping</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <MyOrdersContent />
      </div>
    </Fragment>
  );
}
