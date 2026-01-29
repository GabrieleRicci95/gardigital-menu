import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Fetch reservations (Protected - Admin Only)
export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    const date = searchParams.get('date'); // Filter by date (YYYY-MM-DD)

    if (!restaurantId) return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });

    try {
        const whereClause: any = { restaurantId };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.date = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

// PATCH: Update reservation status (Admin Only)
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        // Allow if session exists OR if we are in dev/debug mode? No, strict security.
        // Check if session is null
        if (!session) {
            console.error('PATCH Reservation: Unauthorized (No Session)');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        console.log('PATCH Reservation:', { id, status, user: session.user?.email });

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updated = await prisma.reservation.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('PATCH Reservation Error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

// POST: Create a new reservation (Public)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { restaurantId, name, phone, email, guests, date, time, notes } = body;

        // Basic validation
        if (!restaurantId || !name || !phone || !guests || !date || !time) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Create date assuming Italy timezone (UTC+1 in winter, UTC+2 in summer)
        // Simple heuristic for now: We treat the incoming date/time as "Local Italy Time".
        // To save it correctly in UTC, we need to tell the Date constructor that this string includes the Italy offset.
        // Since we don't have a timezone library, we will append a dynamic offset or defaulting to +01:00 for simplicity now, 
        // but ideally we should use a library. 
        // Let's assume +01:00 for now (Winter). In production for year-round support we should add 'date-fns-tz'.

        // FIXME: Handle Daylight Saving Time automatically. currently hardcoded to +01:00 (CET)
        const dateTimeString = `${date}T${time}:00+01:00`;

        const reservation = await prisma.reservation.create({
            data: {
                restaurantId,
                name,
                phone,
                email,
                guests: Number(guests),
                date: new Date(dateTimeString),
                notes,
                status: 'PENDING'
            }
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Reservation Error:', error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}
