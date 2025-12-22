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
import { useLocalStorage } from 'usehooks-ts';
import type { ShippingAddressItem } from './components/info';
import type { AddressFormValues } from './components/forms';

const DEFAULT_ADDRESSES: ShippingAddressItem[] = [
  {
    default: true,
    title: 'Jeroen’s Home',
    addressName: 'Home',
    name: 'Jeroen',
    lastName: 'van Dijk',
    email: 'jeroen@vandijk.com',
    phone: '+31612345678',
    address: 'Keizersgracht 172',
    apartment: '',
    city: 'Amsterdam',
    country: 'Netherlands',
    postalCode: '1016 DW',
    badge: true,
  },
  {
    default: false,
    title: 'Sophie’s Office',
    addressName: 'Office',
    name: 'Sophie',
    lastName: 'de Vries',
    email: 'sophie@devries.com',
    phone: '+31687654321',
    address: 'Laan van Meerdervoort 88',
    apartment: '',
    city: 'The Hague',
    country: 'Netherlands',
    postalCode: '2517 AN',
    badge: false,
  },
];

export default function ShippingInfoPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addresses, setAddresses] = useLocalStorage<ShippingAddressItem[]>(
    'checkout-addresses',
    DEFAULT_ADDRESSES,
  );

  function handleAddAddress(values: AddressFormValues) {
    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      return [
        ...prev,
        {
          ...values,
          title: values.addressName,
          default: isFirst,
          badge: isFirst,
        },
      ];
    });
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
        <ShippingInfoContent addresses={addresses} setAddresses={setAddresses} />
      </div>
    </Fragment>
  );
}
