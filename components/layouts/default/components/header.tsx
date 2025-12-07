'use client';

import { useEffect, useState } from 'react';
import { cn, configSWR } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { HeaderLogo } from './header-logo';
import { HeaderSearch } from './header-search';
import { HeaderTopbar } from './header-topbar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const stickyOffset = 400;
  const scrollPosition = useScrollPosition();
  const [headerStickyOn, setHeaderStickyOn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scrollPosition > stickyOffset) {
      document.body.setAttribute('data-sticky-header', 'on');
      setHeaderStickyOn(true);
    } else {
      document.body.removeAttribute('data-sticky-header'); 
      setHeaderStickyOn(false);
    }
  }, [scrollPosition]);

  return (
    <header
      className={cn(
        'flex items-center transition-[height] shrink-0 h-[120px] md:h-[100px] in-data-[sticky-header=on]:pe-[var(--removed-body-scroll-bar-size,0px)]',
        !isMobile && headerStickyOn && 'h-[70px] animate-in slide-in-from-top-10 fixed z-10 top-0 start-0 end-0 shadow-xs backdrop-blur-md bg-background/70',
      )}
    >
      <div className="container flex flex-col md:flex-row items-stretch justify-between md:items-center gap-3.5">
        {!isMobile ? (
          <>
            <HeaderLogo />
            <HeaderSearch />
            <HeaderTopbar />
          </>
        ) : (
          <>
            <HeaderLogo />

            <div className="grow flex items-center justify-between gap-2.5">
              <HeaderSearch />
              <HeaderTopbar />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
