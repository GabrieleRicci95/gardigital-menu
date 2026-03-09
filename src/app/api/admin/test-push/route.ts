import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPushNotification } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const restaurantId = searchParams.get('restaurantId');

        if (!restaurantId) return NextResponse.json({ error: 'Missing restaurantId' });

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { pushTokens: true, name: true }
        });

        if (!restaurant || !restaurant.pushTokens || restaurant.pushTokens.length === 0) {
            return NextResponse.json({ error: 'No tokens found' });
        }

        const result = await sendPushNotification(
            restaurant.pushTokens,
            "Test Notifica Gardigital",
            "Questa è una notifica di test inviata manualmente.",
            { test: "true" }
        );

        return NextResponse.json({
            success: true,
            tokensSent: restaurant.pushTokens.length,
            tokens: restaurant.pushTokens
        });

    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
