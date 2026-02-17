import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/register' || path === '/forgot-password' || path === '/reset-password' || path === '/' || path === '/contact' || path === '/vantaggi' || path === '/chi-siamo' || path === '/privacy' || path === '/terms' || path === '/cookies' || path.startsWith('/api/auth') || path.startsWith('/api/contact') || path.startsWith('/api/public');

    if (!session && !isPublicPath && !path.startsWith('/menu') && !path.startsWith('/book')) {
        // Redirect to login if not authenticated and trying to access protected route
        // Allow /menu and /book public access
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session && (path === '/login' || path === '/register')) {
        // Redirect to dashboard or admin if already authenticated
        const role = session.user?.role;
        return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/dashboard', request.url));
    }

    // Protect Admin Routes
    if (path.startsWith('/admin')) {
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
