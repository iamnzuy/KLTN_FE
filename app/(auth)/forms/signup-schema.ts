import { z } from 'zod';

export const getSignupSchema = () => {
  return z
    .object({
      name: z
        .string()
        .min(5, { message: 'Name must be at least 5 characters long.' })
        .min(1, { message: 'Name is required.' }),
      email: z
        .string()
        .email({ message: 'Please enter a valid email address.' })
        .min(1, { message: 'Email is required.' }),
      password: z
        .string()
        .min(6, {
          message: `Password must be at least 6 characters long.`,
        })
        .min(1, { message: 'Password is required.' }),
      passwordConfirmation: z.string().min(1, {
        message: 'Password confirmation is required.',
      }),
      accept: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions.',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    });
};

export type SignupSchemaType = z.infer<ReturnType<typeof getSignupSchema>>;
