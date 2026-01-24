import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, login } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        let { email, password } = await request.json();
        email = email?.trim().toLowerCase();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e password richiesti' }, { status: 400 });
        }

        console.log('Login attempt for:', email);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found:', email);
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }

        console.log('User found, verifying password...');
        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
            console.log('Password mismatch for:', email);
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }

        console.log('Password verified, creating session...');
        // Create session
        await login({ id: user.id, email: user.email, role: user.role });
        console.log('Session created successfully.');

        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        return NextResponse.json({ success: true, redirect: redirectPath });
    } catch (error) {
        console.error('Login error - FULL DETAILS:', error);
        // @ts-ignore
        if (error.message) console.error('Error message:', error.message);
        // @ts-ignore
        if (error.stack) console.error('Error stack:', error.stack);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
