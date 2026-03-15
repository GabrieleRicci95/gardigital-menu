import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session || !session.user || session.user.role !== 'OWNER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the primary restaurant for this owner
        const restaurant = await prisma.restaurant.findFirst({
            where: { 
                ownerId: session.user.id,
                NOT: { slug: { endsWith: '-solo' } }
            },
            include: { subscription: true }
        });

        if (!restaurant || !restaurant.subscription) {
            return NextResponse.json({ error: 'Abbonamento non trovato' }, { status: 404 });
        }

        const subscription = restaurant.subscription;

        // 1. Try to cancel on Stripe if subscription ID exists
        if (subscription.stripeSubscriptionId) {
            try {
                // Set cancel_at_period_end to true so it doesn't renew
                await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
                    cancel_at_period_end: true,
                });
                console.log(`Stripe subscription ${subscription.stripeSubscriptionId} set to cancel at period end.`);
            } catch (stripeError: any) {
                console.warn('Stripe cancellation failed (maybe already canceled or not found):', stripeError.message);
                // We continue to update our DB even if Stripe fails, 
                // as the user wants to "disattivare" and we should reflect that.
            }
        }

        // 2. Update our database
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                isRecurring: false,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, message: 'Rinnovo automatico disattivato' });

    } catch (error: any) {
        console.error('Cancellation Error:', error);
        return NextResponse.json({ error: error.message || 'Errore interno del server' }, { status: 500 });
    }
}
