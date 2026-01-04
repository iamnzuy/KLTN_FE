'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, EllipsisVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DropdownMenu4 } from './dropdown-menu-4';
import { DropdownMenu5 } from './dropdown-menu-5';

interface IConnectionsItem {
  avatar: string;
  name: string;
  connections: number;
  jointLinks: number | string;
  connected: boolean;
}
type IConnectionsItems = Array<IConnectionsItem>;

interface IConnectionsProps {
  url: string;
}

const Connections = ({ url }: IConnectionsProps) => {
  const [items, setItems] = useState<IConnectionsItems>([
    {
      avatar: '300-3.png',
      name: 'Tyler Hero',
      connections: 26,
      jointLinks: 6,
      connected: true,
    },
    {
      avatar: '300-1.png',
      name: 'Esther Howard',
      connections: 639,
      jointLinks: 'không có',
      connected: false,
    },
    {
      avatar: '300-11.png',
      name: 'Jacob Jones',
      connections: 125,
      jointLinks: 19,
      connected: false,
    },
    {
      avatar: '300-2.png',
      name: 'Cody Fisher',
      connections: 81,
      jointLinks: 'không có',
      connected: true,
    },
    {
      avatar: '300-5.png',
      name: 'Leslie Alexander',
      connections: 1203,
      jointLinks: 2,
      connected: false,
    },
    {
      avatar: '300-9.png',
      name: 'Guy Hawkins',
      connections: 2,
      jointLinks: 'không có',
      connected: true,
    },
  ]);

  const toggleConnection = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, connected: !item.connected } : item,
      ),
    );
  };

  const renderItem = (item: IConnectionsItem, index: number) => (
    <TableRow key={index}>
      <TableCell>
        <div className="flex items-center grow gap-2.5">
          <img
            src={`/media/avatars/${item.avatar}`}
            className="rounded-full size-9 shrink-0"
            alt={item.name}
          />
          <div className="flex flex-col gap-1">
            <Link
              href="/public-profile/profiles/creator"
              className="text-sm font-medium text-mono hover:text-primary-active mb-px"
            >
              {item.name}
            </Link>
            <span className="text-xs font-normal text-secondary-foreground leading-3">
              {item.connections} kết nối
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-2 text-end">{item.jointLinks}</TableCell>
      <TableCell className="py-2 text-end">
        <Button
          className={`rounded-full ${
            item.connected
              ? 'bg-blue-500 text-white'
              : 'bg-blue-50 border border-blue-300 text-blue-600 hover:text-white hover:bg-blue-500'
          }`}
          size="sm"
          mode="icon"
          variant={item.connected ? 'primary' : 'outline'}
          onClick={() => toggleConnection(index)}
        >
          {item.connected ? <Check size={18} /> : <Plus size={18} />}
        </Button>
      </TableCell>
      <TableCell className="text-end">
        <DropdownMenu5
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Kết nối</CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        <div className="kt-scrollable-auto">
          <Table className="align-middle text-sm text-secondary-foreground">
            <TableBody>
              <TableRow className="bg-accent/60">
                <TableCell className="text-start font-normal min-w-48 py-2.5">
                  Tên
                </TableCell>
                <TableCell className="text-end font-medium min-w-20 py-2.5">
                  Liên kết chung
                </TableCell>
                <TableCell className="text-end font-medium min-w-20 py-2.5">
                  Trạng thái
                </TableCell>
                <TableCell className="min-w-16" />
              </TableRow>
              {items.map(renderItem)}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link href={url}>Xem thêm 64 kết nối</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export {
  Connections,
  type IConnectionsItem,
  type IConnectionsItems,
  type IConnectionsProps,
};
