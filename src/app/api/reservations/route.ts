import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession, decrypt } from '@/lib/auth';

// GET: Fetch reservations (Protected - Admin Only)
export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    const date = searchParams.get('date'); // Filter by date (YYYY-MM-DD)
    const countPending = searchParams.get('countPending') === 'true';
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!restaurantId) return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });

    try {
        // Option 1: Just count pending reservations
        if (countPending) {
            const count = await prisma.reservation.count({
                where: {
                    restaurantId,
                    status: 'PENDING'
                }
            });
            return NextResponse.json({ pendingCount: count });
        }

        // Option 2: Get days with reservations for a specific month
        if (month && year) {
            const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

            const reservations = await prisma.reservation.findMany({
                where: {
                    restaurantId,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                },
                select: {
                    date: true
                }
            });

            // Extract unique dates (YYYY-MM-DD)
            const daysWithReservations = Array.from(new Set(
                reservations.map(r => r.date.toISOString().split('T')[0])
            ));

            return NextResponse.json({ days: daysWithReservations });
        }

        // Default: Fetch full reservation details
        const whereClause: any = { restaurantId };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            // Fetch reservations that matches the date OR are pending (regardless of date)
            whereClause.OR = [
                {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                },
                {
                    status: 'PENDING'
                }
            ];
        }

        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            orderBy: { date: 'asc' } // Changed from createdAt to date for better sorting in agenda
        });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error('GET Reservation Error:', error);
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
export async function POST(req: NextRequest) {
    try {
        // Explicitly get session from request cookies for robustness
        const sessionCookie = req.cookies.get('session')?.value;
        let session = null;
        if (sessionCookie) {
            try {
                session = await decrypt(sessionCookie);
            } catch (e) { console.error('Token decrypt error', e); }
        }

        const body = await req.json();
        const { restaurantId, name, phone, email, guests, date, time, notes } = body;

        if (!restaurantId || !name || !guests || !date || !time) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const dateTimeString = `${date}T${time}:00+01:00`;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { bookingAutoConfirm: true }
        });

        let initialStatus = 'PENDING';

        if (session) {
            const { status } = body;
            if (status === 'CONFIRMED') initialStatus = 'CONFIRMED';
            else initialStatus = 'CONFIRMED';
        } else if (restaurant?.bookingAutoConfirm) {
            initialStatus = 'CONFIRMED';
        }

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
