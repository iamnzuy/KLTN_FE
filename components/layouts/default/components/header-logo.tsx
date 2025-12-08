'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { NavbarMenuMobile } from './navbar-menu-mobile';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useStoreClient } from '@/app/(app)/components/context'; 

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
} from '@/components/ui/sheet';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export function HeaderLogo() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { showCartSheet } = useStoreClient();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center justify-between md:justify-start gap-1 md:gap-3.5">
      {/* Menu */}
      <div className="flex items-center gap-1">
        <Link href="/">
          <img
            src={'/media/storely-logos/logo-text-light.svg'}
            className="dark:hidden h-[30px]"
            alt="logo"
          />
          <img
            src={'/media/storely-logos/logo-text-dark.svg'}
            className="hidden dark:inline-block h-[30px]"
            alt="logo"
          />
        </Link>
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" mode="icon">
                <Menu className="size-4"/>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 max-w-full p-0">
              <SheetHeader className="mb-5">
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <SheetBody className="space-y-7.5 p-4">
                <NavbarMenuMobile />
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="inline-flex md:hidden">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            mode="icon"
            shape="circle"
            onClick={showCartSheet}
            className="relative hover:text-primary"
          >
            <ShoppingCart className="size-5!" />
            <Badge
              className="absolute top-0.5 end-0.5"
              variant="success"
              size="xs"
              shape="circle"
            >
              3
            </Badge>
          </Button>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-secondary-foreground">
              Total 
            </span>
            <span className="text-xs font-medium text-foreground">$94.56</span>
          </div>
        </div>
      </div>
    </div>
  );
}
