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

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
        }
        // Create session
        await login({ id: user.id, email: user.email, role: user.role });

        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        return NextResponse.json({ success: true, redirect: redirectPath });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
