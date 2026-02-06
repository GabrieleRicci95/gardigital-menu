
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WineListPublicClient from './WineListPublicClient';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

async function getWineList(slug: string) {
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: slug }
    });

    if (!restaurant) return null;

    const wineList = await prisma.wineList.findUnique({
        where: { restaurantId: restaurant.id },
        include: {
            sections: {
                include: { items: true },
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return { restaurant, wineList };
}

export default async function PublicWineListPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getWineList(slug);

    if (!data || !data.restaurant) {
        notFound();
    }

    return (
        <WineListPublicClient
            restaurant={data.restaurant}
            // @ts-ignore - Prisma Decimal serialization issue
            wineList={data.wineList}
        />
    );
}
