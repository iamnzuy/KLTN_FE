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
            <ToolbarPageTitle text="My Profile" />
            <ToolbarDescription>
              Central Hub for Personal Customization
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline" asChild>
              <Link href="/account/billing">Billing</Link>
            </Button>
            <Button asChild>
              <Link href="/account/security">Security</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <PersonalInfo />
              <BasicSettings title="Basic Settings" />
              <Work />
              <CommunityBadges />
            </div>
          </div>
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <StartNow />
              <CalendarAccounts />
              <Connections url="#" />
              <RecentUploads title="My Files" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
