
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DrinkListPublicClient from './DrinkListPublicClient';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

async function getDrinkList(slug: string) {
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: slug }
    });

    if (!restaurant) return null;

    const drinkList = await prisma.drinkList.findUnique({
        where: { restaurantId: restaurant.id },
        include: {
            sections: {
                include: { items: true },
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return { restaurant, drinkList };
}

export default async function PublicDrinkListPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getDrinkList(slug);

    if (!data || !data.restaurant) {
        notFound();
    }

    // Transform Decimal to number for the client component
    const safeDrinkList = data.drinkList ? {
        ...data.drinkList,
        sections: data.drinkList.sections.map(s => ({
            ...s,
            items: s.items.map(i => ({
                ...i,
                price: Number(i.price)
            }))
        }))
    } : null;

    return (
        <DrinkListPublicClient
            restaurant={data.restaurant}
            drinkList={safeDrinkList}
        />
    );
}
