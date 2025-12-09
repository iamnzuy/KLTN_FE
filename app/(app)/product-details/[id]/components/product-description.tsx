'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductDescriptionProps {
  product: any;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  // Mock detailed description - in real app, this would come from product data
  const description = product?.description || 
    "Luôn hợp thời, luôn mới mẻ. Air Jordan 1 Low mang đến cho bạn một phần lịch sử và di sản của Jordan, mang đến sự thoải mái suốt cả ngày. Chọn màu sắc yêu thích, rồi bước ra ngoài với thiết kế biểu tượng được chế tác từ sự kết hợp chất liệu cao cấp và lớp đệm Air được bọc kín ở gót giày.";

  const details = [
    {
      title: "Chất liệu cao cấp",
      content: "Phiên bản Low sở hữu lớp da cao cấp kết hợp với chất liệu tổng hợp ở phần thân giày."
    },
    {
      title: "Công nghệ Air Within",
      content: "Một bộ phận Air được tích hợp ở gót giày, mang đến cho bạn lớp đệm nhẹ nhàng, đã trở thành xu hướng trong hơn một thế hệ."
    },
    {
      title: "Thiết kế vượt thời gian",
      content: "Logo Wings ở gót giày và họa tiết Jumpman ở lưỡi gà tạo nên một đôi giày với những chi tiết mang tính biểu tượng."
    }
  ];

  const productDetails = [
    "Logo Wings ở gót giày",
    "Thiết kế dấu Swoosh khâu",
    "Mũi giày đục lỗ",
    "Đế giữa bằng mút xốp",
    "Độ bám cao su",
    `Màu sắc hiển thị: ${product?.color || 'Mystic Hibiscus/Đen/Sữa dừa'}`,
    `Kiểu dáng: ${product?.sku || product?.id || 'DC0774-605'}`,
    "Quốc gia/Khu vực xuất xứ: Indonesia"
  ];

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="text-lg font-semibold">
            Mô tả
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="details">
          <AccordionTrigger className="text-lg font-semibold">
            Thông tin chi tiết
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {details.map((detail, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold text-foreground">{detail.title}</h4>
                <p className="text-muted-foreground">{detail.content}</p>
              </div>
            ))}
            
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold text-foreground">Chi tiết sản phẩm:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {productDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

