import trpc from '@trpc/server';
import trpcNext from '@trpc/server/adapters/next';
import { getIronSession } from 'iron-session';
import { User } from '@prisma/client';

export async function createTrpcContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const session = await getIronSession(req, res, {
    password:
      'EE7B2AA2477B930101EC91DA2F2BA1EC51E819AC1C1D226C163E614891609951',
    cookieName: 'session-cookie',
    cookieOptions: {
      secure: false,
    },
  });

  return {
    session,
  };
}

export type TrpcContext = trpc.inferAsyncReturnType<typeof createTrpcContext>;

declare module 'iron-session' {
  interface IronSessionData {
    user?: Omit<User, 'password'>;
  }
}
