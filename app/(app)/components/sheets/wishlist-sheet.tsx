'use client';

import Link from 'next/link';
import { ShoppingCart, Star, TrashIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts'

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

const items = [
  {
    logo: '11.png',
    title: 'Cloud Shift Lightweight Runner Pro Edition',
    total: '120.00',
    star: '5.0',
    brand: 'Nike',
  },
  {
    logo: '12.png',
    title: 'Titan Edge High Impact Stability Lightweight..',
    total: '99.00',
    star: '3.9',
    brand: 'Puma',
  },
  {
    logo: '13.png',
    title: 'Wave Strike Dynamic Boost Sneaker',
    label: '$179.00',
    total: '144.00',
    badge: true,
    star: '4.6',
    brand: 'Campers',
  },
  {
    logo: '15.png',
    title: 'Cloud Shift Lightweight Runner Pro Edition',
    label: '$179.00',
    total: '230.00',
    star: '4.2',
    brand: 'Puma',
  },
];

export function WishlistSheet({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLElement>, () => onOpenChange(false));

  return (
    <>
      {open && <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 [backdrop-filter:blur(4px)] z-50' />}
      <motion.nav
        ref={ref}
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.2 }}
        className="fixed border-s z-50 sm:w-[560px] bg-background sm:max-w-none inset-5 start-auto rounded-lg p-0"
      >
        <div className='flex flex-col gap-4 h-full w-full rounded-lg'>
          <div className='border-b py-3.5 px-5 border-border flex items-center justify-between text-base font-medium'>
            Wishlist
            <X className="text-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer w-5 h-5" onClick={() => onOpenChange(false)} />
          </div>
          <div className='px-5 py-0 h-[calc(100dvh-12rem)] pe-3 -me-3 space-y-5 overflow-y-scroll'>
            {items.map((item, index) => (
              <Card className="mb-7.5" key={index}>
                <CardContent className="p-2 pe-5 flex sm:items-center justify-between gap-3.5">
                  <Card className="flex items-center justify-center bg-accent/50 h-[70px] w-[90px] shadow-none">
                    <img
                      src={`/media/store/client/600x600/${item.logo}`}
                      className="size-15"
                      alt="img"
                    />
                  </Card>

                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center flex-wrap justify-between gap-2.5 -mt-1">
                      <Link href="#" className="hover:text-primary text-sm font-medium text-foreground leading-5.5">
                        {item.title}
                      </Link>
                      {item?.badge && (
                        <Badge
                          size="sm"
                          variant="destructive"
                          className="uppercase shrin"
                        >
                          save 25%
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center flex-wrap justify-between gap-3">
                      <div className="flex items-center flex-wrap gap-3">
                        <Badge
                          size="sm"
                          variant="warning"
                          shape="circle"
                          className="gap-1"
                        >
                          <Star className="text-white" fill="currentColor" />
                          {item.star}
                        </Badge>
                        <span className="text-xs font-normal text-secondary-foreground">
                          Brand:
                          <span className="text-xs font-medium text-foreground">
                            {item.brand}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-3">
                        {item.label && (
                          <span className="text-xs font-normal text-secondary-foreground line-through">
                            {item.label}
                          </span>
                        )}
                        <span className="text-sm font-medium text-foreground">
                          ${item.total}
                        </span>
                        <Button variant="outline" size="sm">
                          <ShoppingCart />
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          mode="icon"
                          className="justify-center"
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-row border-t py-3.5 px-5 border-border gap-2">
            <Button className='grow' variant="outline">Remove All</Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
