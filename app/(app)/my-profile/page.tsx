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
import {
  BasicSettings,
  CalendarAccounts,
  CommunityBadges,
  Connections,
  PersonalInfo,
  StartNow,
  Work,
  RecentUploads
} from './components';

export default function Page() {
  
  return (
    <>
      <div className="container">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Hồ sơ của tôi" />
            <ToolbarDescription>
              Trung tâm tùy chỉnh thông tin cá nhân
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="/account/billing">Thanh toán</Link>
            </Button>
            <Button asChild>
              <Link href="/account/security">Bảo mật</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <PersonalInfo />
              <BasicSettings title="Cài đặt cơ bản" />
              <Work />
              <CommunityBadges />
            </div>
          </div>
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <StartNow />
              <CalendarAccounts />
              <Connections url="#" />
              <RecentUploads title="Tệp của tôi" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
