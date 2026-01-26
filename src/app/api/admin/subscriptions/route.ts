import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                restaurant: {
                    owner: {
                        email: {
                            not: 'gardigital234@gmail.com'
                        }
                    }
                }
            },
            include: {
                restaurant: {
                    include: {
                        owner: {
                            select: { name: true, email: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Add users without subscription (Free/Expired implicitly or just not created yet)
        // Actually, if we want to see active plans, we just return subscriptions.
        // User asked for "active subscriptions section ... list and type of subscription".
        // Let's return just the subscriptions for now.

        return NextResponse.json({ subscriptions });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore server' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { restaurantId, plan, status } = await request.json();

        if (!restaurantId || !plan) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

        // Check if subscription exists using upsert
        // But subscription requires separate creation potentially if using relation unique

        // First find rest subscription
        const currentSub = await prisma.subscription.findUnique({
            where: { restaurantId }
        });

        let sub;
        if (currentSub) {
            sub = await prisma.subscription.update({
                where: { restaurantId },
                data: { plan, status: status || 'ACTIVE', updatedAt: new Date() }
            });
        } else {
            sub = await prisma.subscription.create({
                data: {
                    restaurantId,
                    plan,
                    status: status || 'ACTIVE',
                }
            });
        }

        return NextResponse.json({ success: true, subscription: sub });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore aggiornamento piano' }, { status: 500 });
    }
}
