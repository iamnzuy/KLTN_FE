'use client';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { Button } from '@/components/ui/button';
import { Details, Invoicing, PaymentMethods, Plan } from './components';
import Link from 'next/link';

export default function AccountBasicPage() {

  return (
    <>
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="My Billing" />
            <ToolbarDescription>
              Central Hub for Personal Customization
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="/account/settings">Settings</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <div className="gap-5 lg:gap-7.5">
          <div className="flex flex-col gap-5 lg:gap-7.5">
            <Plan />
            <PaymentMethods />
            <Details />
            <Invoicing />
          </div>
        </div>
      </div>
    </>
  );
}
