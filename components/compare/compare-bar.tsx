'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCompare } from '@/hooks/use-compare';

export default function CompareBar() {
  const { items, remove, clear } = useCompare();

  if (!items || items.length === 0) return null;

  return (
    <div className="fixed left-0 right-0 bottom-4 z-50 flex items-center justify-center">
      <Card className="px-3 py-2 flex items-center gap-4 shadow-lg">
        {items.map((it: any) => (
          <div key={it.id} className="flex items-center gap-2">
            <Image src={it.imurl || it.imgUrl || ''} alt={it.title || ''} width={56} height={56} className="object-contain" unoptimized={true} />
            <div className="text-sm max-w-[160px] truncate">{it.title}</div>
            <button className="text-muted-foreground ms-2" onClick={() => remove(it.id)}>×</button>
          </div>
        ))}

        <div className="flex items-center gap-2 ms-4">
          <Link href="/compare">
            <Button>So sánh ({items.length})</Button>
          </Link>
          <Button variant="outline" onClick={clear}>Xóa</Button>
        </div>
      </Card>
    </div>
  );
}
