
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

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
                            not: 'gabrielericci234@gmail.com'
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
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { restaurantId, plan, status } = await request.json();

        if (!restaurantId || !plan) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

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
