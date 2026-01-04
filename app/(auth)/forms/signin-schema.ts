import { z } from 'zod';

export const getSigninSchema = () => {
  return z.object({
    username: z
      .string()
      .min(1, { message: 'Tên đăng nhập là bắt buộc.' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
      .min(1, { message: 'Mật khẩu là bắt buộc.' }),
    rememberMe: z.boolean().optional(),
  });
};

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;
