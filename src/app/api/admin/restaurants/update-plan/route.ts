
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
        const { restaurantId, newPlan, durationMonths, hasTranslations, hasReservations } = await req.json();

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

        // If only toggling features without changing the plan
        if (restaurantId && newPlan === undefined && (hasTranslations !== undefined || hasReservations !== undefined)) {
            const updateData: any = {};
            if (hasTranslations !== undefined) updateData.hasTranslations = hasTranslations;
            if (hasReservations !== undefined) updateData.hasReservations = hasReservations;

            const subscription = await prisma.subscription.update({
                where: { restaurantId },
                data: updateData
            });

            return NextResponse.json({ success: true, subscription });
        }

        if (!restaurantId || !['FREE', 'PREMIUM', 'WEBSITE', 'FULL', 'PILOT', 'RENEW'].includes(newPlan)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        let endDate = null;
        let isRenew = newPlan === 'RENEW';
        
        // Find existing subscription to base the new end date on if needed
        const existingSub = await prisma.subscription.findUnique({ where: { restaurantId } });

        if (newPlan === 'PILOT') {
            endDate = null;
        } else if ((newPlan === 'PREMIUM' || newPlan === 'FULL' || isRenew) && durationMonths && typeof durationMonths === 'number') {
            const baseDate = (existingSub?.endDate && existingSub.endDate > new Date()) 
                ? new Date(existingSub.endDate) 
                : new Date();
            baseDate.setMonth(baseDate.getMonth() + durationMonths);
            endDate = baseDate;
        }

        const isFull = newPlan === 'FULL' || newPlan === 'PILOT';

        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurantId },
            update: {
                ...(isRenew ? {} : { plan: newPlan }), // Keep existing plan if renewing
                status: 'ACTIVE',
                endDate: endDate,
                ...(isFull ? {
                    hasTranslations: true,
                    hasReservations: true
                } : {})
            },
            create: {
                restaurantId: restaurantId,
                plan: isRenew ? 'BASE' : newPlan,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: endDate,
                hasTranslations: isFull,
                hasReservations: isFull
            }
        });

        return NextResponse.json({ success: true, subscription });
    } catch (error) {
        console.error("Plan update error:", error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
