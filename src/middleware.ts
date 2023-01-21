import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isIndex = req.nextUrl.pathname === '/';
  const isPageNotAuth = ['/auth/sign-in', '/auth/sign-up'].includes(
    req.nextUrl.pathname,
  );

  const session = await getIronSession(req, res, {
    password:
      'EE7B2AA2477B930101EC91DA2F2BA1EC51E819AC1C1D226C163E614891609951',
    cookieName: 'session-cookie',
    cookieOptions: {
      secure: false,
    },
  });

  const isLoggedIn = !!session.user;

  if (isIndex) return NextResponse.redirect(new URL('/auth', req.url));

  if (isLoggedIn && isPageNotAuth) {
    return NextResponse.redirect(new URL(`/${session.user?.role}`, req.url));
  }

  return res;
}
