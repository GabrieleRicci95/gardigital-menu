import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const allMyRestaurants = await prisma.restaurant.findMany({
        where: { ownerId: session.user.id },
        include: {
            wineList: true,
            champagneList: true,
            drinkList: true
        }
    });

    return NextResponse.json(allMyRestaurants);
}
