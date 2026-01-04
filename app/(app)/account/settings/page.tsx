'use client';

import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/default/components/toolbar';
import { Button } from '@/components/ui/button';
import { DeleteAccount } from './components';
import { BasicSettings, Password } from './components';

export default function AccountSettingsPlainPage() { 
  return (
    <>
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Cài đặt"/>
            <ToolbarDescription>
              Trải nghiệm người dùng gọn gàng và hiệu quả
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="/my-profile">Hồ sơ của tôi</Link>
            </Button>
            <Button asChild>
              <Link href="/account/billing">Thanh toán</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <div className="grid gap-5 lg:gap-7.5 xl:w-[38.75rem] mx-auto">
          <BasicSettings title="Cài đặt chung" />
          <Password />
          <DeleteAccount />
        </div>
      </div>
    </>
  );
}
