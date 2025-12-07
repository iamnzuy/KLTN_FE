'use client';

import { Fragment } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '@/app/(app)/components/context';

interface ICard1Item {
  logo: string;
  brand: string;
}
type ICard1Items = Array<ICard1Item>;

export function Card1() {
  const { showProductDetailsSheet } = useStoreClient();

  const items: ICard1Items = [
    { logo: '1.png', brand: 'Asics' },
    { logo: '2.png', brand: 'Under Armour' },
    { logo: '3.png', brand: 'Fila' },
    { logo: '4.png', brand: 'Mizuno' },
    { logo: '5.png', brand: 'Saucony' },
    { logo: '6.png', brand: 'Hoka One One' },
    { logo: '7.png', brand: 'On Running' },
  ];

  const renderItem = (item: ICard1Item, index: number) => (
    <Card key={index}>
      <CardContent className="flex flex-col items-center justify-center pb-0">
        <div
          onClick={() => showProductDetailsSheet('productid')}
          className="cursor-pointer hover:text-primary text-sm font-medium text-mono"
        >
          {item.brand}
        </div>

        <img
          src={`/media/store/client/600x600/${item.logo}`}
          className="cursor-pointer h-[100px] shrink-0"
          onClick={() => showProductDetailsSheet('productid')}
          alt="image"
        />
      </CardContent>
    </Card>
  );

  return (
    <Fragment>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
}
