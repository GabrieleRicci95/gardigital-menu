import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingClient from './BookingClient';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export default async function BookingPage({ params }: PageProps) {
    const { slug } = await params;

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            themeColor: true,
            bookingMaxGuestsPerSlot: true,
            bookingAutoConfirm: true,
            whatsappNumber: true,
            subscription: {
                select: {
                    status: true,
                    hasReservations: true
                }
            }
        }
    });

    if (!restaurant) {
        notFound();
    }

    const sub = restaurant.subscription;
    const isActive = sub && (sub.status === 'ACTIVE' || sub.status === 'TRIAL') && sub.hasReservations;

    if (!isActive) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: 'sans-serif' }}>
                <h1>Servizio non disponibile</h1>
                <p>Il servizio di prenotazione non è attivo per questo ristorante.</p>
            </div>
        );
    }

    return (
        <BookingClient restaurant={restaurant} />
    );
}
