import { z } from 'zod';

export const getSignupSchema = () => {
  return z
    .object({
      name: z
        .string()
        .min(5, { message: 'Họ và tên phải có ít nhất 5 ký tự.' })
        .min(1, { message: 'Họ và tên là bắt buộc.' }),
      email: z
        .string()
        .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' })
        .min(1, { message: 'Email là bắt buộc.' }),
      password: z
        .string()
        .min(6, {
          message: `Mật khẩu phải có ít nhất 6 ký tự.`,
        })
        .min(1, { message: 'Mật khẩu là bắt buộc.' }),
      passwordConfirmation: z.string().min(1, {
        message: 'Xác nhận mật khẩu là bắt buộc.',
      }),
      accept: z.boolean().refine((val) => val === true, {
        message: 'Bạn phải đồng ý với các điều khoản và điều kiện.',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Mật khẩu không khớp.',
      path: ['passwordConfirmation'],
    });
};

export type SignupSchemaType = z.infer<ReturnType<typeof getSignupSchema>>;
