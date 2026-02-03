import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const customLists = await prisma.customList.findMany({
            where: { restaurantId: restaurant.id },
            include: {
                sections: {
                    include: {
                        items: true
                    }
                }
            }
        });

        return NextResponse.json({ customLists });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel recupero dei moduli' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: 'Il nome è obbligatorio' }, { status: 400 });

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const slug = generateSlug(name);

        const customList = await prisma.customList.create({
            data: {
                name,
                slug,
                restaurantId: restaurant.id,
                isActive: true
            }
        });

        return NextResponse.json({ customList });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nella creazione del modulo' }, { status: 500 });
    }
}
