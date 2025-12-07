'use client';

import { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Navbar } from './components/navbar';
import { useIsMobile } from '@/hooks/use-mobile';

export function DefaultLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      <Header />
      {!isMobile && <Navbar />}
      <main className="flex-1 overflow-y-scroll mx-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" role="content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
