import { router } from '@/rpc';
import { appointmentRouter as appointment } from './appointment';
import { userRouter as user } from './user';

export const appRouter = router({
  user,
  appointment,
});

export type AppRouter = typeof appRouter;
