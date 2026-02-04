import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

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

        const customLists = await (prisma as any).customList.findMany({
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
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: 'Il nome è obbligatorio' }, { status: 400 });

        const restaurant = await (prisma as any).restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const slug = generateSlug(name);

        const customList = await (prisma as any).customList.create({
            data: {
                name,
                slug,
                restaurantId: restaurant.id,
                isActive: true,
                sections: {
                    create: [
                        {
                            name: 'Categoria 1',
                            sortOrder: 0
                        }
                    ]
                }
            }
        });

        return NextResponse.json({ customList });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nella creazione del modulo' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) return NextResponse.json({ error: 'Lo slug è obbligatorio' }, { status: 400 });

        const restaurant = await (prisma as any).restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        await (prisma as any).customList.deleteMany({
            where: {
                slug: slug,
                restaurantId: restaurant.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nell\'eliminazione del modulo' }, { status: 500 });
    }
}
