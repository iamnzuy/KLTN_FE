import { z } from 'zod';

export const getChangePasswordSchema = () => {
  return z
    .object({
      newPassword: z
      .string()
      .min(6, {
        message: `Password must be at least 6 characters long.`,
      })
      .min(1, { message: 'Password is required.' }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });
};

export type ChangePasswordSchemaType = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;

export const getChangePasswordApiSchema = () => {
  return z.object({
    token: z.string().nonempty({
      message: 'A valid token is required to change the password.',
    }),
    newPassword: z
      .string()
      .min(6, {
        message: `Password must be at least 6 characters long.`,
      })
      .min(1, { message: 'Password is required.' }),
  });
};

export type ChangePasswordApiSchemaType = z.infer<
  ReturnType<typeof getChangePasswordApiSchema>
>;
