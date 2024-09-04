import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionData, sessionOption } from './lib/session';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { faro } from '@grafana/faro-web-sdk';

// This function can be marked `async` if using `await` inside
export default async function middleware(req: NextRequest) {
  if (process.env.NODE_ENV == 'production') {
    // const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    // const cspHeader = `
    //     default-src 'self';
    //     script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    //     style-src 'self' 'nonce-${nonce}';
    //     img-src 'self' blob: data:;
    //     font-src 'self';
    //     object-src 'none';
    //     base-uri 'self';
    //     form-action 'self';
    //     frame-ancestors 'none';
    //     upgrade-insecure-requests;
    // `
    // // Replace newline characters and spaces
    // const contentSecurityPolicyHeaderValue = cspHeader
    //   .replace(/\s{2,}/g, ' ')
    //   .trim()
    // const requestHeaders = new Headers(request.headers)
    // requestHeaders.set('x-nonce', nonce)
    // requestHeaders.set(
    //   'Content-Security-Policy',
    //   contentSecurityPolicyHeaderValue
    // )
    // const response = NextResponse.next({
    //   request: {
    //     headers: requestHeaders,
    //   },
    // })
    // response.headers.set(
    //   'Content-Security-Policy',
    //   contentSecurityPolicyHeaderValue
    // )
    // return response
  }

  const sess = await getIronSession<SessionData>(cookies(), sessionOption);
  if (!sess.tokenInfo) {
    return NextResponse.redirect(new URL('/api/signin', req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/:path',
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
