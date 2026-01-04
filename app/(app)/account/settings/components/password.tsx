'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Password = () => {
  return (
    <Card className="pb-2.5">
      <CardHeader id="password_settings">
        <CardTitle>Mật khẩu</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Mật khẩu hiện tại</Label>
          <Input type="text" placeholder="Nhập mật khẩu hiện tại" />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Mật khẩu mới</Label>
          <Input type="text" placeholder="Nhập mật khẩu mới" />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
          <Label className="flex w-full max-w-56">Xác nhận mật khẩu mới</Label>
          <Input type="text" placeholder="Nhập lại mật khẩu mới" />
        </div>
        <div className="flex justify-end">
          <Button>Đặt lại mật khẩu</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { Password };
