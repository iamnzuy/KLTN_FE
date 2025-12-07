'use client';

import { ReactNode, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { LoaderCircleIcon } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>
        {`
          .page-bg {
            background-image: url('${'/media/images/2600x1200/bg-10.png'}');
          }
          .dark .page-bg {
            background-image: url('${'/media/images/2600x1200/bg-10-dark.png'}');
          }
        `}
      </style>
      <div className="flex flex-col flex-1 min-h-screen w-full items-center justify-center grow bg-center bg-no-repeat page-bg">
        <div className="m-5">
          <Link href="/">
            <img
              src={'/media/storely-logos/logo-icon-light.svg'}
              className="h-[45px] max-w-none dark:hidden"
              alt=""
            />
            <img
              src={'/media/storely-logos/logo-icon-dark.svg'}
              className="h-[45px] max-w-none dark:block hidden"
              alt=""
            />
          </Link>
        </div>
        <Card className="w-full max-w-[400px]">
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="flex w-full justify-center py-10">
                  <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
                </div>
              }
            >
              {children}
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
