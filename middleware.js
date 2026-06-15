import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  const auth = request.cookies.get('auth')?.value;
  if (auth && auth === process.env.SITE_PASSWORD) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
