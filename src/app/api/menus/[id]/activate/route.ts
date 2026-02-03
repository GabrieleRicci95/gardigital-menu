import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    const { id } = await params;

    // Resolve restaurantId from session if possible or fetch it
    const userRestaurant = await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!userRestaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

    // Transaction to switch active menu
    await prisma.$transaction([
        // Deactivate all
        prisma.menu.updateMany({
            where: { restaurantId: userRestaurant.id },
            data: { isActive: false }
        }),
        // Activate target
        prisma.menu.update({
            where: { id: id, restaurantId: userRestaurant.id },
            data: { isActive: true }
        })
    ]);

    return NextResponse.json({ success: true });
}
