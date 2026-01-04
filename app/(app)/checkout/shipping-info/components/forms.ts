import { z } from 'zod';

export const addressSchema = z.object({
  addressName: z.string().min(2, { message: 'Tên địa chỉ là bắt buộc' }),
  name: z.string().min(2, { message: 'Tên là bắt buộc' }),
  lastName: z.string().min(2, { message: 'Họ là bắt buộc' }),
  email: z.string().email({ message: 'Email hợp lệ là bắt buộc' }),
  phone: z.string().min(6, { message: 'Số điện thoại là bắt buộc' }),
  address: z.string().min(2, { message: 'Địa chỉ là bắt buộc' }),
  apartment: z.string().optional(),
  city: z.string().min(2, { message: 'Thành phố là bắt buộc' }),
  country: z.string().min(2, { message: 'Quốc gia là bắt buộc' }),
  postalCode: z.string().min(2, { message: 'Mã bưu chính là bắt buộc' }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
