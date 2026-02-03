import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CustomListPublicClient from './CustomListPublicClient';

interface PageProps {
    params: Promise<{
        slug: string;
        customSlug: string;
    }>
}

async function getCustomList(slug: string, customSlug: string) {
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: slug },
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

    if (!restaurant) return null;

    const customList = await (prisma as any).customList.findFirst({
        where: {
            restaurantId: restaurant.id,
            slug: customSlug,
            isActive: true
        },
        include: {
            sections: {
                include: {
                    items: {
                        orderBy: { createdAt: 'asc' }
                    }
                },
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return { restaurant, customList };
}

export default async function PublicCustomListPage({ params }: PageProps) {
    const { slug, customSlug } = await params;
    const data = await getCustomList(slug, customSlug);

    if (!data || !data.restaurant || !data.customList) {
        notFound();
    }

    return (
        <CustomListPublicClient
            restaurant={data.restaurant as any}
            customList={data.customList as any}
        />
    );
}
