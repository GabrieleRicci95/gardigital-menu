
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ChampagneListPublicClient from './ChampagneListPublicClient'; // Using the specific client component

export const dynamic = 'force-dynamic';

async function getRestaurant(slug: string) {
    return await prisma.restaurant.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            themeColor: true,
            backgroundColor: true,
            textColor: true,
            fontFamily: true,
            logoUrl: true
        }
    });
}

async function getChampagneList(restaurantId: string) {
    // @ts-ignore - Ignore type error if client isn't fully updated yet
    return await prisma.champagneList.findUnique({
        where: { restaurantId },
        include: {
            sections: {
                include: { items: true },
                orderBy: { sortOrder: 'asc' }
            }
        }
    });
}

export default async function ChampagneListPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) {
        notFound();
    }

    const fullChampagneList = await getChampagneList(restaurant.id);

    return (
        <ChampagneListPublicClient
            restaurant={restaurant}
            // @ts-ignore - Prisma Decimal serialization issue
            champagneList={fullChampagneList}
        />
    );
}
