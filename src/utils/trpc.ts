import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { NextPageContext } from 'next';
import superjson from 'superjson';

import type { AppRouter } from '../server';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export interface SSRContext extends NextPageContext {
  status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        ],
      };
    }

    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (!ctx?.req) return {};

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { connection: _connection, ...headers } = ctx.req.headers;
            return { ...headers, 'x-ssr': '1' };
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      },
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;

    if (ctx.status) return { status: ctx.status };

    const error = opts.clientErrors[0];
    if (error) return { status: error.data?.httpStatus ?? 500 };

    return {};
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
