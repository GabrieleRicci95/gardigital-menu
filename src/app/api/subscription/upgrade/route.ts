import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        // Upsert subscription (create if new, update if exists)
        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurant.id },
            update: {
                plan: 'PREMIUM',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null // Indefinite for now, or +1 year
            },
            create: {
                restaurantId: restaurant.id,
                plan: 'PREMIUM',
                status: 'ACTIVE',
                startDate: new Date(),
            }
        });

        return NextResponse.json({ success: true, subscription });
    } catch (error) {
        console.error("Upgrade error:", error);
        return NextResponse.json({ error: 'Upgrade failed' }, { status: 500 });
    }
}
