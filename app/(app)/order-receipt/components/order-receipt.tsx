'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Card4 } from '@/app/(app)/components/common/card4';

export function OrderReceipt() {
  return (
    <Fragment>
      <div className="py-10">
        <Card className="px-0 w-full max-w-[800px] mx-auto overflow-hidden">
          <Progress
            value={100}
            className="h-[8px]"
            indicatorClassName="bg-[linear-gradient(90deg,#D618A3_0%,#1951E0_32.67%,#12C79C_67.17%,#DFBB19_100%)]"
          />
          <div
            className="py-10 mb-5 ps-6 pe-3 me-3 text-center space-y-5"
            id="order_receipt_body"
          >
            <div className="flex flex-col items-center gap-3 mb-5 lg:mb-9">
              <Link href="/" className="shrink-0">
                <img
                  src={'/media/storely-logos/logo-text-light.svg'}
                  className="dark:hidden"
                  alt="logo"
                />
                <img
                  src={'/media/storely-logos/logo-text-dark.svg'}
                  className="hidden dark:inline-block"
                  alt="logo"
                />
              </Link>

              <h3 className="text-2xl text-foreground font-semibold mt-6">
                Order Confirmation
              </h3>
              <span className="text-sm text-secondary-foreground font-medium">
                Thank you! Your order
                <span className="text-sm text-foreground font-semibold">
                  {' '}
                  #X319330-S24{' '}
                </span>
                is confirmed and being processed.
              </span>
            </div>

            <div className="space-y-5 lg:pb-5">
              <Card4 limit={4} />
            </div>

            <Card className="bg-muted/70 text-start px-5 lg:px-7 py-4 shadow-none">
              <div className="flex justify-start gap-9">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-normal text-secondary-foreground">
                    Order placed
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    26 June, 2025 ID
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-normal text-secondary-foreground">
                    Total
                  </span>
                  <span className="text-sm font-medium text-foreground">$512.60</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-normal text-secondary-foreground">
                    Ship to
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Jeroen van Dijk
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-normal text-secondary-foreground">
                    Estimated Delivery
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    07 July, 2025
                  </span>
                </div>
              </div>
            </Card>
            <Button variant="outline" className="lg:mt-5">
              <ListChecks />
              <Link href="/my-orders">My Orders</Link>
            </Button>
          </div>
        </Card>
      </div>
    </Fragment>
  );
}
