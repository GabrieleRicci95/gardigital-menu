import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Find the restaurant belonging to this user
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            // User registered but has no restaurant (shouldn't happen with current flow, but possible)
            return NextResponse.json({ menus: [] });
        }

        const menus = await prisma.menu.findMany({
            where: { restaurantId: restaurant.id },
            orderBy: { createdAt: 'asc' },
            include: { _count: { select: { categories: true } } }
        });

        return NextResponse.json({ menus });
    } catch (error) {
        console.error("Get Menus Error:", error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

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

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

        const body = await req.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Verify ownership
        const menu = await prisma.menu.findUnique({
            where: { id },
            include: { restaurant: true }
        });

        if (!menu || menu.restaurant.ownerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedMenu = await prisma.menu.update({
            where: { id },
            data: { name },
            include: { _count: { select: { categories: true } } }
        });

        return NextResponse.json(updatedMenu);
    } catch (error) {
        console.error("Update Menu Error:", error);
        return NextResponse.json({ error: 'Errore Server' }, { status: 500 });
    }
}
