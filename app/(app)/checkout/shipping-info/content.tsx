'use client';

import { useMemo, useState, useRef } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Order } from './components/order';
import { cn, configSWR } from '@/lib/utils';
import { orderApi } from '@/lib/backend-api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ShippingInfoContent() {
  const router = useRouter();
  const { data, isLoading } = useSWR('/api/carts', configSWR);
  const cart = data?.data;
  const cartItems = cart?.items ?? [];
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fullNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total: number, item: any) =>
          total + (item?.unitPrice || item?.product?.price || 0) * (item?.quantity || 0),
        0,
      ),
    [cartItems],
  );
  const vat = subtotal * 0.1;
  const shippingFee = 0;

  const handleContinue = async () => {
    const fullName = fullNameRef.current?.value || '';
    const address = addressRef.current?.value || '';
    const district = districtRef.current?.value || '';
    const city = cityRef.current?.value || '';
    const phone = phoneRef.current?.value || '';
    const email = emailRef.current?.value || '';

    const newErrors: Record<string, string> = {};

    if (!fullName) newErrors.fullName = 'Họ và tên không được để trống';
    if (!city) newErrors.city = 'Thành phố không được để trống';
    if (!district) newErrors.district = 'Quận/Huyện không được để trống';
    if (!address) newErrors.address = 'Địa chỉ không được để trống';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!phone) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else {
      const isPhoneValid = phone.startsWith('+84') 
        ? phone.length === 12 
        : phone.length === 10;
      
      if (!isPhoneValid || !/^\+?\d+$/.test(phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const formElement = document.querySelector('.bg-card');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrors({});

    if (!cartItems.length) {
      toast.error('Giỏ hàng đang trống');
      return;
    }

    const orderItems: { productId: string; quantity: number; unitPrice: number }[] = cartItems.map((item: any) => ({
      productId: item.productId || item.product?.id,
      quantity: Number(item.quantity) || 1,
      unitPrice: item?.unitPrice || item?.product?.price || 0,
    }));

    const formattedAddress = `${fullName}\n${address}, ${district}, ${city}\nPhone: ${phone}\nEmail: ${email}`;

    try {
      setCreatingOrder(true);
      const response = await orderApi.create({
        shippingAddress: formattedAddress,
        paymentMethod: 'PAYOS',
        totalAmount: subtotal + vat,
        items: orderItems,
      });

      if (response.error || !response.data) {
        throw new Error(response.error || 'Tạo đơn hàng thất bại');
      }

      toast.success('Đã tạo đơn hàng. Tiếp tục tới thanh toán.');
      router.push(`/checkout/payment-method?orderId=${response.data.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể tạo đơn hàng';
      toast.error(message);
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <div className="grid xl:grid-cols-3 gap-5 lg:gap-9 mb-5 lg:mb-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className={cn(errors.fullName && "text-destructive")}>Họ và tên</Label>
              <Input id="fullName" ref={fullNameRef} placeholder="Nhập họ và tên" aria-invalid={!!errors.fullName} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email</Label>
              <Input id="email" type="email" ref={emailRef} placeholder="Nhập địa chỉ email" aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className={cn(errors.phone && "text-destructive")}>Số điện thoại</Label>
              <Input id="phone" ref={phoneRef} placeholder="Nhập số điện thoại" aria-invalid={!!errors.phone} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className={cn(errors.city && "text-destructive")}>Thành phố</Label>
              <Input id="city" ref={cityRef} placeholder="Nhập thành phố" aria-invalid={!!errors.city} />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district" className={cn(errors.district && "text-destructive")}>Quận/Huyện</Label>
              <Input id="district" ref={districtRef} placeholder="Nhập quận/huyện" aria-invalid={!!errors.district} />
              {errors.district && <p className="text-xs text-destructive">{errors.district}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className={cn(errors.address && "text-destructive")}>Địa chỉ cụ thể</Label>
              <Input id="address" ref={addressRef} placeholder="Số nhà, tên đường..." aria-invalid={!!errors.address} />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.push('/checkout/order-summary')}>
            <MoveLeft className="text-base" />
            Quay lại giỏ hàng
          </Button>

          <Button
            onClick={handleContinue}
            disabled={creatingOrder || !cartItems.length || isLoading}
          >
            {creatingOrder ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
            <MoveRight className="text-base" />
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="space-y-5">
          <Order
            subtotal={subtotal}
            shipping={shippingFee}
            vat={vat}
            shippingHeadline="Thông tin đơn hàng"
          />
        </div>
      </div>
    </div>
  );
}
