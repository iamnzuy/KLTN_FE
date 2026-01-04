'use client';

import Link from 'next/link';
import { CloudDownload, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IInvoicingItem {
  number: string;
  date: string;
  amount: string;
  label: string;
  color: 'warning' | 'success' | 'destructive';
}
type IInvoicingItems = Array<IInvoicingItem>;

const Invoicing = () => {
  const tables: IInvoicingItems = [
    {
      number: 'Invoice-2024-xd912c',
      date: '6 Th8, 2024',
      amount: '24.00',
      label: 'Sắp tới',
      color: 'warning',
    },
    {
      number: 'Invoice-2024-rq857m',
      date: '17 Th6, 2024',
      amount: '29.99',
      label: 'Đã thanh toán',
      color: 'success',
    },
    {
      number: 'Invoice-2024-jk563z',
      date: '30 Th4, 2024',
      amount: '24.00',
      label: 'Đã thanh toán',
      color: 'success',
    },
    {
      number: 'Invoice-2024-hg234x',
      date: '21 Th4, 2024',
      amount: '6.59',
      label: 'Bị từ chối',
      color: 'destructive',
    },
    {
      number: 'Invoice-2024-lp098y',
      date: '14 Th3, 2024',
      amount: '24.00',
      label: 'Đã thanh toán',
      color: 'success',
    },
  ];

  const renderItem = (table: IInvoicingItem, index: number) => {
    return (
      <TableRow key={index}>
        <TableCell className="text-sm text-foreground font-normal">
          {table.number}
        </TableCell>
        <TableCell className="lg:text-end">
          <Badge variant={table.color} appearance="outline">
            {table.label}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-foreground font-normal lg:text-end">
          {table.date}
        </TableCell>
        <TableCell className="text-sm text-secondary-foreground font-normal lg:text-end">
          ${table.amount}
        </TableCell>
        <TableCell>
          <Button variant="ghost" mode="icon">
            <Download className="text-blue-500" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thanh toán và Hóa đơn</CardTitle>
        <Button variant="outline">
          <CloudDownload size={16} />
          Tải xuống tất cả
        </Button>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/60">
              <TableHead className="min-w-52 h-10">Hóa đơn</TableHead>
              <TableHead className="min-w-24 text-end h-10">Trạng thái</TableHead>
              <TableHead className="min-w-32 text-end h-10">Ngày</TableHead>
              <TableHead className="min-w-20 text-end h-10">Số tiền</TableHead>
              <TableHead className="w-8 h-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table, index) => {
              return renderItem(table, index);
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link href="/checkout/payment-method">Xem tất cả thanh toán</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { Invoicing, type IInvoicingItem, type IInvoicingItems };
