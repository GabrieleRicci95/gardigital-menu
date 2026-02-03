import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function POST() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurant.id },
            update: {
                plan: 'PREMIUM',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null
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
