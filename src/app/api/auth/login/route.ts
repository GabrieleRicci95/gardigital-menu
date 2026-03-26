import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, login } from '@/lib/auth';
 
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        let { email, password } = await request.json();
        email = email?.trim().toLowerCase();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e password richiesti' }, { status: 400 });
        }

        console.log('[LOGIN] Login attempt for:', email);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('[LOGIN] User not found:', email);
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }

        console.log('[LOGIN] User found, verifying password...');
        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
            console.log('[LOGIN] Password mismatch for:', email);
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }

        console.log('[LOGIN] Password verified, creating session...');
        try {
            await login({ id: user.id, email: user.email, role: user.role });
            console.log('[LOGIN] Session created successfully.');
        } catch (sessionError) {
            console.error('[LOGIN] CRITICAL: Session creation failed:', sessionError);
            throw sessionError;
        }

        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        console.log('[LOGIN] Success! Redirecting to:', redirectPath);
        return NextResponse.json({ success: true, redirect: redirectPath });
    } catch (error) {
        console.error('[LOGIN] CRITICAL 500 ERROR:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
