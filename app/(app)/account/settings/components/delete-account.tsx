'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import React from 'react';

const DeleteAccount = () => {
  return (
    <Card>
      <CardHeader id="delete_account">
        <CardTitle>Xóa tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
        <div className="flex flex-col gap-5">
          <div className="text-sm text-foreground">
            Chúng tôi rất tiếc khi bạn rời đi. Xác nhận xóa tài khoản bên dưới.
            Dữ liệu của bạn sẽ bị xóa vĩnh viễn. Cảm ơn bạn đã là một phần của
            cộng đồng chúng tôi. Vui lòng kiểm tra{' '}
            <Button mode="link" asChild>
              <Link href="#">Hướng dẫn thiết lập</Link>
            </Button>{' '}
            nếu bạn vẫn muốn tiếp tục.
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox />
            <Label>Xác nhận xóa tài khoản</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2.5">
          <Button variant="outline">
            <Link href="#">Vô hiệu hóa thay thế</Link>
          </Button>
          <Button variant="destructive">
            <Link href="#">Xóa tài khoản</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { DeleteAccount };
