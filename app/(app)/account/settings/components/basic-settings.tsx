'use client';

import { useState, useEffect } from 'react';
import { AvatarInput } from './avatar-input';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Selection from '@/components/selection';
import { Switch } from '@/components/ui/switch';
import useAuth from '@/hooks/use-auth';
import { userApi } from '@/lib/backend-api';
import { toast } from 'sonner';

interface IGeneralSettingsProps {
  title: string;
}

const BasicSettings = ({ title }: IGeneralSettingsProps) => {
  const { profile, mutate } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date(1984, 0, 20));
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [addressInput, setAddressInput] = useState('Avinguda Imaginària, 789');
  const [cityInput, setCityInput] = useState('Barcelona');
  const [postcodeInput, setPostcodeInput] = useState('08012');
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when profile is available
  useEffect(() => {
    if (profile) {
      setUsernameInput(profile.username || '');
      setEmailInput(profile.email || '');
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updateData: any = {};
      
      // Only include changed fields
      if (usernameInput && usernameInput !== profile.username) {
        updateData.username = usernameInput;
      }
      if (emailInput && emailInput !== profile.email) {
        updateData.email = emailInput;
      }

      // If nothing changed, just show success
      if (Object.keys(updateData).length === 0) {
        toast.info('Không có thay đổi nào để lưu');
        setIsLoading(false);
        return;
      }

      const result = await userApi.updateCurrentUser(updateData);
      
      if (result.error) {
        toast.error(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
      } else {
        toast.success('Cập nhật thông tin thành công');
        // Refresh user profile
        await mutate();
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="pb-2.5">
      <CardHeader id="general_settings">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-update" className="text-sm">
            Hồ sơ công khai
          </Label>
          <Switch defaultChecked size="sm" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Ảnh</Label>
          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
            <span className="text-sm font-medium text-secondary-foreground">
              150x150px JPEG, PNG Image
            </span>
            <AvatarInput />
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Tên đăng nhập</Label>
          <Input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Ngày sinh
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  mode="input"
                  variant="outline"
                  id="date"
                  className={cn(
                    'w-full data-[state=open]:border-primary',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarDays className="-ms-0.5" />
                  {date ? format(date, 'LLL dd, y') : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single" // Single date selection
                  defaultMonth={date}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Số điện thoại</Label>
          <Input type="text" placeholder="Số điện thoại" />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Email</Label>
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Nhập email"
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Địa chỉ</Label>
          <Input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Quốc gia</Label>
          <Selection defaultValue={'Việt Nam'} values={['Việt Nam', 'Option 2', 'Option 3']} />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Tỉnh/Thành</Label>
          <Input type="text" placeholder="Tỉnh/Thành" />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Quận/Huyện</Label>
          <Input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
          <Label className="flex w-full max-w-56">Mã bưu điện</Label>
          <Input
            type="text"
            value={postcodeInput}
            onChange={(e) => setPostcodeInput(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { BasicSettings, type IGeneralSettingsProps };
