import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession, decrypt } from '@/lib/auth';
import { sendPushNotification } from '@/lib/firebase-admin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dynamic = 'force-dynamic';

// GET: Fetch reservations (Protected - Admin Only)
export async function GET(req: Request) {
    try {
        console.log('GET /api/reservations - Request started');
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const restaurantId = searchParams.get('restaurantId');
        const date = searchParams.get('date');
        const countPending = searchParams.get('countPending') === 'true';
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        console.log('Parameters:', { restaurantId, date, countPending, month, year });

        if (!restaurantId) return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });

        // Option 1: Just count pending reservations
        if (countPending) {
            console.log('Counting pending for restaurant:', restaurantId);
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
            console.log('Fetching month data:', { month, year });
            const m = parseInt(month);
            const y = parseInt(year);
            // The original code had a check for isNaN(m) || isNaN(y) here.
            // The provided instruction removes this check, implying that
            // the parsing is considered "safer" or that invalid inputs
            // will be handled by subsequent operations or are not expected.
            const startOfMonth = new Date(y, m - 1, 1);
            const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

            const reservations = await prisma.reservation.findMany({
                where: {
                    restaurantId,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                },
                select: { date: true }
            });

            const daysWithReservations = Array.from(new Set(
                reservations.map(r => r.date.toISOString().split('T')[0])
            ));

            console.log('Found days:', daysWithReservations.length);
            return NextResponse.json({ days: daysWithReservations });
        }

        // Default: Fetch full reservation details
        console.log('Fetching reservations for date:', date);
        const whereClause: any = { restaurantId };

        if (date && date !== 'undefined') {
            const day = new Date(date);
            if (!isNaN(day.getTime())) {
                const startOfDay = new Date(day);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(day);
                endOfDay.setHours(23, 59, 59, 999);

                whereClause.OR = [
                    { date: { gte: startOfDay, lte: endOfDay } },
                    { status: 'PENDING' }
                ];
            }
        }

        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            orderBy: { date: 'asc' }
        });

        console.log('Filtered reservations found:', reservations.length);
        return NextResponse.json(reservations);
    } catch (error) {
        console.error('GET Reservation Error:', error);
        return NextResponse.json({ error: 'Database error', details: String(error) }, { status: 500 });
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

        const reservationDate = dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Europe/Rome').toDate();

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { bookingAutoConfirm: true, pushTokens: true, name: true }
        });

        let initialStatus = 'PENDING';

        if (session && body.status) {
            initialStatus = body.status;
        } else if (restaurant?.bookingAutoConfirm) {
            initialStatus = 'CONFIRMED';
        } else {
            initialStatus = 'PENDING';
        }

        const reservation = await prisma.reservation.create({
            data: {
                restaurantId,
                name,
                phone,
                email,
                guests: Number(guests),
                date: reservationDate,
                notes,
                status: initialStatus
            }
        });

        // Trigger Push Notification if tokens exist
        if (restaurant?.pushTokens && restaurant.pushTokens.length > 0) {
            console.log(`Sending push to ${restaurant.pushTokens.length} tokens for restaurant ${restaurantId}`);
            const title = `Nuova Prenotazione: ${restaurant.name}`;
            const body = `${name} ha prenotato per ${guests} persone il ${date} alle ${time}.`;
            // Non inviamo il messaggio push aspettando la fine (async) per non rallentare l'utente finale
            sendPushNotification(restaurant.pushTokens, title, body, { reservationId: reservation.id })
                .then(() => console.log('Push function executed'))
                .catch(e => console.error('Push notification error:', e));
        } else {
            console.log(`No push tokens found for restaurant ${restaurantId}`);
        }

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
