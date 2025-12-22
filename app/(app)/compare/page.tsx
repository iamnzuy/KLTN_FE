'use client';

import { useCompare } from '@/hooks/use-compare';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const { items, remove, clear } = useCompare();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">So sánh sản phẩm</h1>

      {items.length === 0 && (
        <div className="text-muted-foreground">Chưa có sản phẩm nào để so sánh.</div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p: any) => (
            <Card key={p.id} className="p-4">
              <div className="flex gap-4">
                <Image src={p.imurl || p.imgUrl || ''} alt={p.title} width={180} height={180} unoptimized={true} className="object-contain" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
                  <div className="mb-2">Giá: {p.price?.toLocaleString('vi-VN')} VNĐ</div>
                  {p.averageRating && <div className="mb-2">Đánh giá: {p.averageRating}</div>}
                  {p.sku && <div className="mb-2">SKU: {p.sku}</div>}
                  {p.color && <div className="mb-2">Màu: {p.color}</div>}
                  <div className="text-sm text-muted-foreground">{p.description}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => remove(p.id)}>Xóa</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6">
          <Button onClick={clear}>Xóa hết</Button>
        </div>
      )}
    </div>
  );
}
