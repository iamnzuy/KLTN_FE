'use client';

import { Fragment, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
  DialogClose,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addressSchema, AddressFormValues } from './forms';
import { AddressDialog } from './address-dialog';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';

export interface ShippingAddressItem {
  default: boolean;
  title: string;
  addressName: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
  badge?: boolean;
}

interface InfoProps {
  items: ShippingAddressItem[];
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: AddressFormValues) => void;
}

export function Info({ items, onSelect, onRemove, onUpdate }: InfoProps) {
  const [editOpen, setEditOpen] = useState<number | null>(null);
  const [removeOpen, setRemoveOpen] = useState<number | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressName: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      postalCode: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (editOpen !== null) {
      const item = items[editOpen];
      form.reset({
        addressName: item?.addressName || '',
        name: item?.name || '',
        lastName: item?.lastName || '',
        email: item?.email || '',
        phone: item?.phone || '',
        address: item?.address || '',
        apartment: item?.apartment || '',
        city: item?.city || '',
        country: item?.country || '',
        postalCode: item?.postalCode || '',
      });
    }
  }, [editOpen, items, form]);

  function handleEditSubmit(data: AddressFormValues) {
    if (editOpen === null) return;
    onUpdate(editOpen, data);
    setEditOpen(null);
  }

  function handleRemove(idx: number) {
    onRemove(idx);
    setRemoveOpen(null);
  }

  const handleSelect = (idx: number) => {
    onSelect(idx);
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>Đã chọn địa chỉ!</AlertTitle>
        </Alert>
      ),
      { duration: 5000 },
    );
  };

  if (!items.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Thêm địa chỉ giao hàng để tiếp tục thanh toán.
        </CardContent>
      </Card>
    );
  }

  const renderItem = (item: ShippingAddressItem, index: number) => (
    <Card key={`${item.title}-${index}`}>
      <CardHeader className="px-5">
        <CardTitle>{item.title}</CardTitle>
        {item.default && (
          <Badge variant="success" appearance="outline">
            Giao đến đây
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-5 space-y-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-mono mb-1.5">
            {item.name} {item.lastName}
          </span>

          <div className="flex flex-col gap-2 text-sm font-normal text-mono">
            <span>
              {item.address}
              {item.apartment ? `, ${item.apartment}` : ''}
            </span>
            <span>
              {item.city}, {item.country} {item.postalCode}
            </span>
            <span>Số điện thoại: {item.phone}</span>
            <span>{item.email}</span>
          </div>
        </div>

        <div className="flex justify-between items-center min-h-8.5">
          <div className="flex items-center gap-5">
            <AddressDialog
              open={editOpen === index}
              onOpenChange={(val) => setEditOpen(val ? index : null)}
              initialValues={item}
              onSubmit={handleEditSubmit}
              title="Chỉnh sửa địa chỉ"
              description="Cập nhật chi tiết địa chỉ bên dưới."
              submitLabel="Cập nhật địa chỉ"
              trigger={
                <Button mode="link" underlined="dashed">
                  Chỉnh sửa
                </Button>
              }
            />

            <Dialog
              open={removeOpen === index}
              onOpenChange={(open) => setRemoveOpen(open ? index : null)}
            >
              <DialogTrigger asChild>
                <Button mode="link" underlined="dashed">
                  Xóa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xóa địa chỉ giao hàng</DialogTitle>
                </DialogHeader>
                <DialogBody className="text-sm">
                  Bạn có chắc chắn muốn xóa địa chỉ giao hàng này không? Hành động
                  này không thể hoàn tác.
                </DialogBody>
                <DialogFooter>
                  <Button variant="destructive" onClick={() => handleRemove(index)}>
                    Có, Xóa
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!item.default && (
            <Button size="sm" variant="outline" onClick={() => handleSelect(index)}>
              Chọn địa chỉ
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Fragment>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
}

