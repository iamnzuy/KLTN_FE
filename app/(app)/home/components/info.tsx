'use client';

import Link from 'next/link';
import { HexagonBadge } from '@/components/hexagon-badge';
import {
  BadgePercent,
  CreditCard,
  LucideIcon,
  MessagesSquare,
  Truck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IInfoItem {
  title: string;
  description: string;
  stroke: string;
  fill: string;
  icon: LucideIcon;
  iconColor: string;
}
type IInfoItems = Array<IInfoItem>;

export function Info() {
  const items: IInfoItems = [
    {
      title: 'Miễn phí vận chuyển',
      description: 'Không tốn thêm chi phí vận chuyển',
      stroke: 'stroke-primary-transparent',
      fill: 'fill-primary-soft',
      icon: Truck,
      iconColor: 'text-primary',
    },
    {
      title: 'Hỗ trợ 24/7',
      description: 'Hỗ trợ mọi lúc, mọi nơi',
      stroke: 'stroke-success-transparent',
      fill: 'fill-success-soft',
      icon: MessagesSquare,
      iconColor: 'text-green-500',
    },
    {
      title: 'Khuyến mãi',
      description: 'Tiết kiệm nhiều hơn',
      stroke: 'stroke-info-transparent',
      fill: 'fill-info-soft',
      icon: BadgePercent,
      iconColor: 'text-info',
    },
    {
      title: 'Hoàn tiền',
      description: 'Hoàn tiền đầy đủ, không rủi ro',
      stroke: 'stroke-warning-transparent',
      fill: 'fill-warning-soft',
      icon: CreditCard,
      iconColor: 'text-yellow-400',
    },
  ];

  const renderItem = (item: IInfoItem, index: number) => (
    <Card key={index}>
      <CardContent className="flex items-center gap-3.5 px-5">
        <HexagonBadge
          stroke={item.stroke}
          fill={item.fill}
          size="size-[50px]"
          badge={<item.icon className={`text-xl ps-px ${item.iconColor}`} />}
        />

        <div className="flex flex-col">
          <Link
            href="#"
            className="hover:text-primary text-md font-medium text-mono"
          >
            {item.title}
          </Link>
          <span className="text-xs font-normal text-secondary-foreground">
            {item.description}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-2">
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </div>
  );
}
