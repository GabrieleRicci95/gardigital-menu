import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const menus = await prisma.menu.findMany({
        where: { restaurantId: session.restaurantId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { categories: true } } }
    });

    return NextResponse.json({ menus });
}

export async function POST(req: Request) {
    console.log("POST /api/menus called");
    try {
        const session = await getSession();
        console.log("Session retrieved:", session ? "Found" : "Null");
        if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name } = await req.json();

        // Find Restaurant for this user
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Ristorante non trovato per questo utente' }, { status: 404 });
        }

        const restaurantId = restaurant.id;

        // Plan Limits Check
        const subscription = await prisma.subscription.findUnique({
            where: { restaurantId: restaurantId }
        });

        const isPremium = subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE';
        const currentMenus = await prisma.menu.count({ where: { restaurantId: restaurantId } });

        if (!isPremium && currentMenus >= 1) {
            return NextResponse.json({ error: 'Il piano Base supporta solo 1 menu. Passa a Premium!' }, { status: 403 });
        }

        const newMenu = await prisma.menu.create({
            data: {
                name,
                restaurantId: restaurantId,
                isActive: currentMenus === 0 // First menu is active by default
            },
            include: { _count: { select: { categories: true } } }
        });

        return NextResponse.json(newMenu);
    } catch (error) {
        console.error("Create Menu Error:", error);
        return NextResponse.json({ error: 'Errore Server: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}
