'use client';

import { NavbarMenu } from './navbar-menu';
import { Button } from '@/components/ui/button';
import { Headset } from 'lucide-react';

export function Navbar() {
  return (
    <div className="border-b border-border pb-5 lg:pb-1.5 mb-5 lg:mb-10">
      <div className="container flex justify-between items-center gap-3.5">
        <NavbarMenu />
      </div>
    </div>
  );
}
