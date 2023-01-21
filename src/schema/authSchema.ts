import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .required();

export const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    gender: z.string(),
    address: z.string(),
  })
  .required();

export const editSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    gender: z.string(),
    address: z.string(),
  })
  .required();
