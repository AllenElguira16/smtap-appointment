import { procedure, router } from '@/rpc';
import { appointmentSchema } from '@/schema';
import { AppointmentForm, AppointmentType } from '@/types';
import { AppointmentEnum, PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const appointmentRouter = router({
  setAppointment: procedure(true)
    .input((val: unknown) => {
      if (typeof val === 'object') {
        const { type, appointment } = val as {
          type: AppointmentType;
          appointment: AppointmentForm<AppointmentType>;
        };
        if (appointmentSchema(type)) return { type, appointment };

        throw new Error(`Invalid input: ${typeof type}`);
      }

      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      const appointment = await prisma.appointment.create({
        data: {
          date: new Date(input.appointment.date),
          userId: ctx.session.user.id,
          paid: false,
          info: input.appointment,
          type: input.type.toLocaleUpperCase() as AppointmentEnum,
        },
      });

      return {
        appointment,
        status: true,
        message: 'Appointment created~!',
      };
    }),
  setAsPaid: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.appointment.update({
        where: {
          id,
        },
        data: {
          paid: true,
        },
      });

      return {
        status: true,
        message: 'Appointment updated~!',
      };
    }),
  setAsApproved: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.appointment.update({
        where: {
          id,
        },
        data: {
          approved: true,
        },
      });

      return {
        status: true,
        message: 'Appointment updated~!',
      };
    }),
  getUserAppointment: procedure(true).query(async ({ ctx }) => {
    if (!ctx.session.user)
      return {
        status: false,
        appointments: [],
        message: 'You have no access, please login first',
      };

    return {
      status: true,
      appointments: await prisma.appointment.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          user: true,
          info: true,
          type: true,
          paid: true,
          createdAt: true,
          date: true,
          id: true,
          approved: true,
        },
      }),
    };
  }),
  getAll: procedure(true)
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      return {
        status: true,
        appointments: await prisma.appointment.findMany({
          where: {
            type: input
              ? (input.toLocaleUpperCase() as AppointmentEnum)
              : undefined,
          },
          select: {
            user: true,
            info: true,
            type: true,
            paid: true,
            createdAt: true,
            date: true,
            id: true,
            approved: true,
          },
        }),
      };
    }),
  update: procedure(true)
    .input((val: unknown) => {
      if (typeof val === 'object') {
        const { id, type, appointment } = val as {
          id: string;
          type: AppointmentType;
          appointment: AppointmentForm<AppointmentType>;
        };
        if (appointmentSchema(type)) return { id, type, appointment };

        throw new Error(`Invalid input: ${typeof type}`);
      }

      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      const { date, ...appointment } = input.appointment;

      await prisma.appointment.update({
        where: {
          id: input.id,
        },
        data: {
          info: appointment,
          date: new Date(date),
        },
      });

      return {
        status: true,
        message: 'Appointment Changed~!',
      };
    }),
  delete: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.appointment.delete({
        where: {
          id: input,
        },
      });

      return {
        status: true,
        message: 'Appointment Deleted!',
      };
    }),
});
