import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });

    try {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Today's Stats (Confirmed + Pending)
        const todayReservations = await prisma.reservation.findMany({
            where: {
                restaurantId,
                status: { in: ['CONFIRMED', 'PENDING'] },
                date: {
                    gte: startOfToday,
                    lte: endOfToday
                }
            }
        });

        const todayCount = todayReservations.length;
        const todayGuests = todayReservations.reduce((acc, res) => acc + res.guests, 0);

        // Pending Reservations (Total needing attention)
        const pendingCount = await prisma.reservation.count({
            where: {
                restaurantId,
                status: 'PENDING'
            }
        });

        // Monthly Stats (Confirmed + Pending)
        const monthCount = await prisma.reservation.count({
            where: {
                restaurantId,
                status: { in: ['CONFIRMED', 'PENDING'] },
                date: {
                    gte: startOfMonth
                }
            }
        });

        return NextResponse.json({
            todayCount,
            todayGuests,
            pendingCount,
            monthCount
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
