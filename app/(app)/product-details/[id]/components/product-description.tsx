'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductDescriptionProps {
  product: any;
}

const specLabels: Record<string, string> = {
  battery: 'Pin',
  camera: 'Camera',
  card: 'Thẻ nhớ',
  display: 'Màn hình',
  os: 'Hệ điều hành',
  processor: 'Bộ xử lý',
  ram: 'RAM & Bộ nhớ',
  sim: 'SIM & Kết nối',
};

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {product?.description && (
          <AccordionItem value="description">
            <AccordionTrigger className="text-lg font-semibold">
              Mô tả
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}

        {product?.specList?.length > 0 && (
          <AccordionItem value="specs">
            <AccordionTrigger className="text-lg font-semibold">
              Thông số kỹ thuật
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {product?.specList.map((spec: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 py-3 border-b last:border-b-0"
                  >
                    <div className="font-semibold text-foreground min-w-[150px] sm:min-w-[200px]">
                      {specLabels[spec.specKey] || spec.specKey}:
                    </div>
                    <div className="text-muted-foreground flex-1">
                      {spec.specValue}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}

