/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { createTrpcContext } from '@/rpc';
import { appRouter } from '@/server';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTrpcContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      // eslint-disable-next-line no-console
      console.error('Something went wrong', error);
    }
  },
  batching: {
    enabled: true,
  },
});
