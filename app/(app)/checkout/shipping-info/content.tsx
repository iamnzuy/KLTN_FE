'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Info, type ShippingAddressItem } from './components/info';
import { Order } from './components/order';
import { configSWR } from '@/lib/utils';
import { orderApi } from '@/lib/backend-api';
import { toast } from 'sonner';
import type { AddressFormValues } from './components/forms';

interface ShippingInfoContentProps {
  addresses: ShippingAddressItem[];
  setAddresses: Dispatch<SetStateAction<ShippingAddressItem[]>>;
}

export function ShippingInfoContent({
  addresses,
  setAddresses,
}: ShippingInfoContentProps) {
  const router = useRouter();
  const { data, isLoading } = useSWR('/api/carts', configSWR);
  const cart = data?.data;
  const cartItems = cart?.items ?? [];
  const [creatingOrder, setCreatingOrder] = useState(false);

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

  const selectedAddress =
    addresses.find((item) => item.default) ?? addresses[0] ?? null;

  const shippingDetails = selectedAddress
    ? [
        `${selectedAddress.name} ${selectedAddress.lastName}`,
        `${selectedAddress.address}${
          selectedAddress.apartment ? `, ${selectedAddress.apartment}` : ''
        }`,
        `${selectedAddress.city}, ${selectedAddress.country} ${selectedAddress.postalCode}`,
        `Phone: ${selectedAddress.phone}`,
      ].filter(Boolean)
    : undefined;

  const handleSelectAddress = (index: number) => {
    setAddresses((prev) =>
      prev.map((item, idx) => ({
        ...item,
        default: idx === index,
        badge: idx === index,
      })),
    );
  };

  const handleEditAddress = (index: number, data: AddressFormValues) => {
    setAddresses((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              ...data,
              title: data.addressName,
            }
          : item,
      ),
    );
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length && !next.some((address) => address.default)) {
        next[0] = { ...next[0], default: true, badge: true };
      }
      return next;
    });
  };

  const formatShippingAddress = (item: ShippingAddressItem) =>
    `${item.name} ${item.lastName}\n${item.address}${
      item.apartment ? `, ${item.apartment}` : ''
    }\n${item.city}, ${item.country} ${item.postalCode}\nPhone: ${item.phone}`;

  const handleContinue = async () => {
    if (!selectedAddress) {
      toast.error('Vui lòng thêm địa chỉ giao hàng');
      return;
    }
    if (!cartItems.length) {
      toast.error('Giỏ hàng đang trống');
      return;
    }

    const payloadItems = cartItems.map((item: any) => ({
      productId: item.productId || item.product?.id,
      quantity: Number(item.quantity) || 1,
    }));

    if (payloadItems.some((item) => !item.productId)) {
      toast.error('Không tìm thấy thông tin sản phẩm trong giỏ hàng');
      return;
    }

    try {
      setCreatingOrder(true);
      const response = await orderApi.create({
        shippingAddress: formatShippingAddress(selectedAddress),
        paymentMethod: 'PAYOS',
        items: payloadItems,
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
      <div className="lg:col-span-2 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Info
            items={addresses}
            onSelect={handleSelectAddress}
            onUpdate={handleEditAddress}
            onRemove={handleRemoveAddress}
          />
        </div>
        <div className="flex justify-end items-center flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.push('/checkout/order-summary')}>
            <MoveLeft className="text-base" />
            Order Summary
          </Button>

          <Button
            onClick={handleContinue}
            disabled={
              creatingOrder || !selectedAddress || !cartItems.length || isLoading
            }
          >
            {creatingOrder ? 'Processing...' : 'Payment Method'}
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
            shippingHeadline={selectedAddress ? 'Shipping to' : undefined}
            shippingDetails={shippingDetails}
          />
        </div>
      </div>
    </div>
  );
}
