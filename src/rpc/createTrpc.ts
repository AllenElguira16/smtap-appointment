import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { TrpcContext } from './createTrpcContext';

const {
  router,
  procedure: rootProcedure,
  middleware,
  mergeRouters,
} = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const checkAuthMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.session.user)
    throw new Error('You have no access, please login first');

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const procedure = (isAuth = false) =>
  !isAuth ? rootProcedure : rootProcedure.use(checkAuthMiddleware);

export { router, procedure, middleware, mergeRouters };
