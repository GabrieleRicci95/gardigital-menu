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
            where: { ownerId: session.user.id },
            include: { subscription: true }
        });

        if (!restaurant || !restaurant.subscription?.stripeSubscriptionId) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        // Retrieve subscription to get customer ID
        const stripeSubscription = await stripe.subscriptions.retrieve(
            restaurant.subscription.stripeSubscriptionId
        );

        if (!stripeSubscription.customer) {
            return NextResponse.json({ error: 'Stripe customer not found' }, { status: 404 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.gardigital.it';

        // Create Portal Session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeSubscription.customer as string,
            return_url: `${origin}/dashboard/subscription`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error: any) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
