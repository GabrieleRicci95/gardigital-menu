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
        }
    });

    if (!restaurant) {
        notFound();
    }

    return (
        <BookingClient restaurant={restaurant} />
    );
}
