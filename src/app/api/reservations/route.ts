import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

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
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

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

        if (!restaurantId || !name || !phone || !guests || !date || !time) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const dateTimeString = `${date}T${time}:00+01:00`;

        const session = await getSession();
        // Even if session is demo, we allow creating public reservations but block status manipulation
        const initialStatus = (session && body.status && !isDemoSession(session)) ? body.status : 'PENDING';

        const reservation = await prisma.reservation.create({
            data: {
                restaurantId,
                name,
                phone,
                email,
                guests: Number(guests),
                date: new Date(dateTimeString),
                notes,
                status: initialStatus
            }
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Reservation Error:', error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}

// DELETE: Remove a reservation (Admin Only)
export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.reservation.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE Reservation Error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
