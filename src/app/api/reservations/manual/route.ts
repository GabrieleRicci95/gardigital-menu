import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized: Session not found' }, { status: 401 });
        }

        const body = await req.json();
        const { restaurantId, name, phone, email, guests, date, time, notes } = body;

        if (!restaurantId || !name || !guests || !date || !time) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const reservationDate = dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Europe/Rome').toDate();

        const reservation = await prisma.reservation.create({
            data: {
                restaurantId,
                name,
                phone,
                email,
                guests: Number(guests),
                date: reservationDate,
                notes,
                status: 'CONFIRMED' // Always confirmed for manual entry
            }
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Manual Reservation Error:', error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}
