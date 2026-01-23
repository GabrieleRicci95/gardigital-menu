import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();

    // Security Check
    // TEMPORARY: Allow for testing
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { restaurantId, newPlan, durationMonths } = await req.json();

        if (!restaurantId || !['FREE', 'PREMIUM'].includes(newPlan)) {
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
                endDate: endDate // Update end date if provided
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
