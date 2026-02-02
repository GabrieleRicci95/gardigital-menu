import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                restaurants: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Errore nel recupero degli utenti' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email già in uso' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'OWNER'
            }
        });

        // Create a default restaurant for the new user
        const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
        await prisma.restaurant.create({
            data: {
                name: `Ristorante di ${name.split(' ')[0]}`,
                slug: defaultSlug,
                ownerId: user.id
            }
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Errore nella creazione dell\'utente' }, { status: 500 });
    }
}
