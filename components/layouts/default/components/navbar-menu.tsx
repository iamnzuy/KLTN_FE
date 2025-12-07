'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { MAIN_MENU } from '@/config/app.config';
import { MenuConfig } from '@/types/menu';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';

export function NavbarMenu() {
  const pathname = usePathname();

  const { isActive, hasActiveChild } = useMenu(pathname);

  const buildMenu = (items: MenuConfig) => {
    return items.map((item, index) => {
      if (item.children) {
        return (
          <MenubarMenu key={index}>
            <MenubarTrigger
              className={cn(
                'flex items-center gap-1.5 px-3.25 py-1.75 text-sm text-secondary-foreground text-nowrap mb-2',
                'rounded-full border border-transparent bg-transparent!',
                'hover:text-mono hover:bg-transparent',
                'focus:text-mono focus:bg-primary',
                'data-[state=open]:bg-transparent data-[state=open]:text-mono',
                'data-[here=true]:text-mono data-[here=true]:border-border',
              )}
              data-active={isActive(item.path) || undefined}
              data-here={hasActiveChild(item.children) || undefined}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.title}
              <ChevronDown className="ms-auto size-3.5" />
            </MenubarTrigger>
            <MenubarContent className="min-w-[175px]" sideOffset={0}>
              {buildSubMenu(item.children)}
            </MenubarContent>
          </MenubarMenu>
        );
      } else {
        return (
          <MenubarMenu key={index}>
            <MenubarTrigger
              asChild
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm text-secondary-foreground text-nowrap mb-2',
                'rounded-full border border-transparent bg-transparent!',
                'hover:text-mono hover:bg-transparent',
                'focus:text-mono focus:bg-transparent',
                'data-[active=true]:text-mono data-[active=true]:border-border',
              )}
            >
              <Link
                href={item.path || ''}
                data-active={isActive(item.path) || undefined}
                data-here={hasActiveChild(item.children) || undefined}
              >
                {item.icon && <item.icon className="size-4" />}
                {item.title}
              </Link>
            </MenubarTrigger>
          </MenubarMenu>
        );
      }
    });
  };

  const buildSubMenu = (items: MenuConfig) => {
    return items.map((item, index) => {
      if (item.children) {
        return (
          <MenubarSub key={index}>
            <MenubarSubTrigger
              data-active={isActive(item.path) || undefined}
              data-here={hasActiveChild(item.children) || undefined}
            >
              <span>{item.title}</span>
            </MenubarSubTrigger>
            <MenubarSubContent className="min-w-[175px]">
              {buildSubMenu(item.children)}
            </MenubarSubContent>
          </MenubarSub>
        );
      } else {
        return (
          <MenubarItem
            key={index}
            asChild
            data-active={isActive(item.path) || undefined}
            data-here={hasActiveChild(item.children) || undefined}
          >
            <Link href={item.path || ''}>{item.title}</Link>
          </MenubarItem>
        );
      }
    });
  };

  return (
    <div className="grid">
      <div className="overflow-auto">
        <Menubar className="flex items-stretch border-none bg-transparent p-0 h-auto">
          {buildMenu(MAIN_MENU)}
        </Menubar>
      </div>
    </div>
  );
} 