
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { restaurantId, newPlan, durationMonths } = await req.json();

        if (newPlan === 'BLOCKED') {
            try {
                await prisma.subscription.delete({ where: { restaurantId } });
                return NextResponse.json({ success: true, status: 'BLOCKED' });
            } catch (ignore) {
                return NextResponse.json({ success: true, status: 'BLOCKED' });
            }
        }

        if (newPlan === 'DELETED') {
            try {
                const restaurant = await prisma.restaurant.findUnique({
                    where: { id: restaurantId },
                    select: { ownerId: true }
                });

                if (restaurant) {
                    try { await prisma.subscription.delete({ where: { restaurantId } }); } catch (e) { }
                    await prisma.restaurant.delete({ where: { id: restaurantId } });
                    await prisma.user.delete({ where: { id: restaurant.ownerId } });
                }

                return NextResponse.json({ success: true, status: 'DELETED' });
            } catch (error) {
                console.error("Delete error:", error);
                return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
            }
        }

        if (!restaurantId || !['FREE', 'PREMIUM', 'WEBSITE', 'FULL'].includes(newPlan)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        let endDate = null;
        if (newPlan === 'PREMIUM' && durationMonths && typeof durationMonths === 'number') {
            const date = new Date();
            date.setMonth(date.getMonth() + durationMonths);
            endDate = date;
        }

        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurantId },
            update: {
                plan: newPlan,
                status: 'ACTIVE',
                endDate: endDate
            },
            create: {
                restaurantId: restaurantId,
                plan: newPlan,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: endDate
            }
        });

        return NextResponse.json({ success: true, subscription });
    } catch (error) {
        console.error("Plan update error:", error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
