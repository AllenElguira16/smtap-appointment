import { z, ZodObject, ZodString } from 'zod';
import { AppointmentForm, AppointmentType } from '@/types';

export const appointmentSchema = <T extends AppointmentType>(
  type: T,
): ZodObject<Record<keyof AppointmentForm<T>, ZodString>> => {
  if (type === 'wedding') {
    return z
      .object({
        brideName: z.string().min(2),
        groomName: z.string().min(2),
        phone: z.string().min(11),
        email: z.string().email(),
        date: z.string(),
      })
      .required() as ZodObject<Record<keyof AppointmentForm<T>, ZodString>>;
  }
  if (type === 'baptism' || type === 'burial' || type === 'others')
    return z
      .object({
        name: z.string().min(2),
        phone: z.string().min(11),
        email: z.string().email(),
        date: z.string(),
      })
      .required() as ZodObject<Record<keyof AppointmentForm<T>, ZodString>>;

  throw new Error('Hello World~!');
};
