'use client';

import { SquarePen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const Work = () => {
  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Công việc</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-update" className="text-sm">
            Sẵn sàng ngay
          </Label>
          <Switch defaultChecked size="sm" />
        </div>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table className="align-middle text-sm text-muted-foreground">
          <TableBody>
            <TableRow>
              <TableCell className="py-2 min-w-36text-secondary-foreground font-normal">
                Ngôn ngữ
              </TableCell>
              <TableCell className="py-2 min-w-72 w-full text-foreground font-normal">
                Tiếng Anh{' '}
                <span className="text-secondary-foreground font-normal">
                  - Thành thạo
                </span>
              </TableCell>
              <TableCell className="py-2 text-end min-w-24">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2 text-secondary-foreground font-normal">
                Mức lương theo giờ
              </TableCell>
              <TableCell className="py-2 text-foreground font-normal">
                $28 / giờ
              </TableCell>
              <TableCell className="py-2 text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2text-secondary-foreground font-normal">
                Thời gian rảnh
              </TableCell>
              <TableCell className="py-2 text-foreground font-normal">
                32 giờ mỗi tuần
              </TableCell>
              <TableCell className="py-2 text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-3 text-secondary-foreground font-normal">
                Kỹ năng
              </TableCell>
              <TableCell className="py-3 text-secondary-foreground">
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="secondary">Thiết kế Web</Badge>
                  <Badge variant="secondary">Đánh giá mã</Badge>
                  <Badge variant="secondary">noCode</Badge>
                  <Badge variant="secondary">UX</Badge>
                  <Badge variant="secondary">Figma</Badge>
                  <Badge variant="secondary">Webflow</Badge>
                  <Badge variant="secondary">AI</Badge>
                  <Badge variant="secondary">Quản lý</Badge>
                </div>
              </TableCell>
              <TableCell className="py-3 text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-4 text-secondary-foreground font-normal">
                Giới thiệu
              </TableCell>
              <TableCell className="py-4 text-foreground font-normal">
                Chúng tôi sẵn sàng hợp tác, bài viết khách mời và nhiều hơn nữa. <br />
                Hãy tham gia cùng chúng tôi để chia sẻ thông tin chi tiết của bạn <br />
                và phát triển đối tượng của bạn.
              </TableCell>
              <TableCell className="py-4 text-end">
                <Button variant="ghost" mode="icon">
                  <SquarePen size={16} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { Work };
