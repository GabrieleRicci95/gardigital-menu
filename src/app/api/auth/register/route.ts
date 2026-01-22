import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, login } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    // Removed outer try
    try {
        let { name, email, password } = await request.json();
        email = email?.trim().toLowerCase();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Utente già registrato' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'OWNER', // Default role for signup
            },
        });

        // Create Default Restaurant for the user
        const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await prisma.restaurant.create({
            data: {
                name: `Ristorante di ${name.split(' ')[0]}`,
                slug: defaultSlug,
                ownerId: user.id
            }
        });

        // Auto login after register
        await login({ id: user.id, email: user.email, role: user.role });

        return NextResponse.json({ success: true, redirect: '/onboarding' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Errore durante la registrazione' }, { status: 500 });
    }
}
