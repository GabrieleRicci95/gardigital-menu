
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan } = await req.json();

        if (!['BASE', 'PREMIUM'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Find Restaurant
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        // Update Subscription
        // Start or update subscription. If not exists, create one.
        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurant.id },
            update: {
                plan: plan,
                status: 'ACTIVE', // Ensure status is active when changing plan
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Dummy 30 days extension
            },
            create: {
                restaurantId: restaurant.id,
                plan: plan,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });

        // Also fetch updated menu count logic if needed, but for now just return subscription
        return NextResponse.json(subscription);

    } catch (error) {
        console.error("Subscription Update Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
