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

        if (!restaurant) {
            return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
        }

        let stripeCustomerId: string | null = null;

        // Try to get customer ID from subscription first
        if (restaurant.subscription?.stripeSubscriptionId) {
            try {
                const stripeSubscription = await stripe.subscriptions.retrieve(
                    restaurant.subscription.stripeSubscriptionId
                );
                stripeCustomerId = stripeSubscription.customer as string;
            } catch (err) {
                console.warn('Could not retrieve subscription from Stripe:', err);
            }
        }

        // Fallback: Search by email if subscription ID is missing or invalid
        if (!stripeCustomerId) {
            const customers = await stripe.customers.list({
                email: session.user.email,
                limit: 1
            });
            if (customers.data.length > 0) {
                stripeCustomerId = customers.data[0].id;
            }
        }

        if (!stripeCustomerId) {
            return NextResponse.json({
                error: 'Account Stripe non trovato. Se hai pagato di recente, attendi qualche minuto o contatta l\'assistenza.'
            }, { status: 404 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.gardigital.it';

        // Create Portal Session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${origin}/dashboard/subscription`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error: any) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
