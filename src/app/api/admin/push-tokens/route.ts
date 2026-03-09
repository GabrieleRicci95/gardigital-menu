import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        // We ensure the user is logged in (admin/owner) to save their token
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { restaurantId, token } = body;

        if (!restaurantId || !token) {
            return NextResponse.json({ error: 'Missing restaurantId or token' }, { status: 400 });
        }

        // Verify the user owns this restaurant or is admin
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { ownerId: true, pushTokens: true }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        if (session.user.role !== 'ADMIN' && restaurant.ownerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Add the token if it's not already in the array
        let pushTokens = restaurant.pushTokens || [];
        if (!pushTokens.includes(token)) {
            pushTokens.push(token);

            await prisma.restaurant.update({
                where: { id: restaurantId },
                data: { pushTokens }
            });
        }

        return NextResponse.json({ success: true, message: 'Token saved' });

    } catch (error) {
        console.error('Error saving push token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
