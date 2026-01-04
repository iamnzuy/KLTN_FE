import { z } from 'zod';

export const getChangePasswordSchema = () => {
  return z
    .object({
      newPassword: z
      .string()
      .min(6, {
        message: `Mật khẩu phải có ít nhất 6 ký tự.`,
      })
      .min(1, { message: 'Mật khẩu là bắt buộc.' }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu không khớp.',
      path: ['confirmPassword'],
    });
};

export type ChangePasswordSchemaType = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;

export const getChangePasswordApiSchema = () => {
  return z.object({
    token: z.string().nonempty({
      message: 'Cần có mã thông báo hợp lệ để thay đổi mật khẩu.',
    }),
    newPassword: z
      .string()
      .min(6, {
        message: `Mật khẩu phải có ít nhất 6 ký tự.`,
      })
      .min(1, { message: 'Mật khẩu là bắt buộc.' }),
  });
};

export type ChangePasswordApiSchemaType = z.infer<
  ReturnType<typeof getChangePasswordApiSchema>
>;
