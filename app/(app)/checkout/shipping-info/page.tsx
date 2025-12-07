'use client';

import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressDialog } from './components/address-dialog';
import { ShippingInfoContent } from '@/app/(app)/checkout/shipping-info/content';
import { Steps } from '@/app/(app)/checkout/steps';

import { useState } from 'react';

export default function ShippingInfoPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Placeholder for add handler
  function handleAddAddress() {
    setAddDialogOpen(false);
  }

  return (
    <Fragment>
      <Steps currentStep={1} />
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Enter and confirm your delivery address
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <AddressDialog
              open={addDialogOpen}
              onOpenChange={setAddDialogOpen}
              onSubmit={handleAddAddress}
              title="Add Address"
              description="Fill in the address details below."
              submitLabel="Save Address"
              trigger={
                <Button variant="outline">
                  <MapPinned />
                  Add Address
                </Button>
              }
            />
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <ShippingInfoContent />
      </div>
    </Fragment>
  );
}
