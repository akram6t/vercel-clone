import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const { pathname } = new URL(request.url)

    const token = await getToken({ req: request, secret: process.env.SECRET });

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }


    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}