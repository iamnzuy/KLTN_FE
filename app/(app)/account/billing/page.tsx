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
            <ToolbarPageTitle text="Thanh toán của tôi" />
            <ToolbarDescription>
              Trung tâm tùy chỉnh thông tin cá nhân
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="/account/settings">Cài đặt</Link>
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
