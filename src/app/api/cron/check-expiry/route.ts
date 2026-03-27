import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPushNotification } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // 1. Basic Security Check (Vercel Cron Secret)
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 2. Fetch all restaurants with an active subscription and an end date
        const restaurants = await prisma.restaurant.findMany({
            where: {
                subscription: {
                    status: 'ACTIVE',
                    endDate: { not: null },
                    plan: { not: 'PILOT' }
                }
            },
            include: {
                subscription: true
            }
        });

        let sentCount = 0;

        for (const restaurant of restaurants) {
            if (!restaurant.subscription?.endDate || !restaurant.pushTokens || restaurant.pushTokens.length === 0) continue;

            const endDate = new Date(restaurant.subscription.endDate);
            endDate.setHours(0, 0, 0, 0);

            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            let title = '';
            let body = '';

            if (diffDays === 7) {
                title = '🔔 Promemoria SoloMenu';
                body = `Il tuo abbonamento scade tra 7 giorni. Rinnova ora per mantenere il tuo menu attivo senza interruzioni!`;
            } else if (diffDays === 3) {
                title = '⚠️ Attenzione Scadenza';
                body = `Mancano solo 3 giorni alla scadenza di SoloMenu. Non rischiare di sospendere il tuo QR code!`;
            } else if (diffDays === 1) {
                title = '🚨 Scadenza Domani!';
                body = `Il tuo abbonamento scade domani. Rinnova subito per evitare che i tuoi clienti trovino il menu sospeso.`;
            } else if (diffDays === 0) {
                title = '❌ Servizio Sospeso';
                body = `Il tuo abbonamento è scaduto oggi. Il menu pubblico è stato disattivato. Rinnova ora per riattivarlo.`;
            }

            if (title && body) {
                console.log(`Sending push for restaurant ${restaurant.name} (${restaurant.id}) - Days left: ${diffDays}`);
                await sendPushNotification(
                    restaurant.pushTokens,
                    title,
                    body,
                    { type: 'SUBSCRIPTION_EXPIRY', daysLeft: diffDays.toString() }
                );
                sentCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Processed ${restaurants.length} restaurants, sent ${sentCount} notifications.` 
        });

    } catch (error) {
        console.error('Error in check-expiry cron:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
