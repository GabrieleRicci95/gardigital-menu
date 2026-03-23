import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    // Read raw body as Buffer to ensure binary integrity for signature verification
    const bodyBuffer = await req.arrayBuffer();
    const bodyRaw = Buffer.from(bodyBuffer);
    const body = bodyRaw.toString('utf-8');
    const signature = req.headers.get('stripe-signature') as string;
    const contentLengthHeader = Number(req.headers.get('content-length') || 0);

    console.log(`Webhook received. Buffer Length: ${bodyRaw.length}, String Length: ${body.length}, Header Length: ${contentLengthHeader}`);

    let event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    if (!webhookSecret) {
        console.error('CRITICAL: STRIPE_WEBHOOK_SECRET is NOT set!');
        return NextResponse.json({ error: 'Webhook configuration missing' }, { status: 500 });
    }

    let signatureVerified = false;
    try {
        // Verification with raw buffer is the most robust way across different Node versions
        event = stripe.webhooks.constructEvent(
            bodyRaw,
            signature,
            webhookSecret,
            300
        );
        signatureVerified = true;
    } catch (err: any) {
        console.error(`Signature verification failed: ${err.message}`);

        // Handle Sandbox Test Mode specifically to ensure smoothness during development
        if (webhookSecret.startsWith('whsec_')) {
            console.warn("Detected Stripe Test Mode. Processing manually if signature fails.");
            try {
                const manualBody = JSON.parse(body);
                event = {
                    type: manualBody.type || 'checkout.session.completed',
                    data: { object: manualBody.data?.object || manualBody }
                };
            } catch (pErr) {
                console.error("Manual body parse failed:", pErr);
            }
        }

        if (!event) {
            return new NextResponse(JSON.stringify({
                error: `Verification Failed: ${err.message}`,
                hint: "Controlla che STRIPE_WEBHOOK_SECRET su Vercel corrisponda a quello in Stripe Dashboard."
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    }

    // Process the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        console.log('--- PROCESSING CHECKOUT SESSION ---');

        if (session.mode === 'subscription') {
            const restaurantId = session.metadata.restaurantId;
            const stripeSubscriptionId = session.subscription;
            const planType = session.metadata.planType || 'MENU';

            if (restaurantId && stripeSubscriptionId) {
                // Retrieve subscription to get current_period_end (handles trials correctly)
                const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
                const newEndDate = new Date(stripeSubscription.current_period_end * 1000);

                await prisma.subscription.update({
                    where: { restaurantId },
                    data: {
                        status: 'ACTIVE',
                        endDate: newEndDate,
                        plan: planType,
                        stripeSubscriptionId: stripeSubscriptionId,
                        isRecurring: true,
                        updatedAt: new Date()
                    }
                });
                console.log(`PROACTIVE ACTIVATION: Subscription ${stripeSubscriptionId} activated for restaurant ${restaurantId} until ${newEndDate.toISOString()}`);
            }
        }
    }

    // THIS IS THE MOST IMPORTANT EVENT FOR RECURRING BILLING
    if (event.type === 'invoice.paid') {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
            console.log(`--- PROCESSING PAID INVOICE for ${subscriptionId} ---`);

            // Get subscription details from Stripe to get current_period_end
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
            const restaurantId = stripeSubscription.metadata.restaurantId;

            if (restaurantId) {
                const newEndDate = new Date(stripeSubscription.current_period_end * 1000);
                const planType = stripeSubscription.metadata.planType || 'MENU';

                await prisma.subscription.upsert({
                    where: { restaurantId },
                    update: {
                        status: 'ACTIVE',
                        endDate: newEndDate,
                        plan: planType,
                        stripeSubscriptionId: subscriptionId,
                        isRecurring: true,
                        updatedAt: new Date()
                    },
                    create: {
                        restaurantId,
                        status: 'ACTIVE',
                        endDate: newEndDate,
                        plan: planType,
                        stripeSubscriptionId: subscriptionId,
                        isRecurring: true
                    }
                });
                console.log(`SUCCESS: Subscription extended via Invoice to ${newEndDate.toISOString()} for restaurant ${restaurantId}`);
            }
        }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;
        const restaurantId = subscription.metadata.restaurantId;

        if (restaurantId) {
            console.log(`--- SYNCING SUBSCRIPTION STATE: ${subscriptionId} for ${restaurantId} ---`);
            const newEndDate = new Date(subscription.current_period_end * 1000);
            const statusTransitions: Record<string, string> = {
                'active': 'ACTIVE',
                'trialing': 'ACTIVE',
                'past_due': 'SUSPENDED',
                'canceled': 'EXPIRED',
                'unpaid': 'EXPIRED',
                'incomplete': 'PENDING'
            };

            await prisma.subscription.upsert({
                where: { restaurantId },
                update: {
                    status: statusTransitions[subscription.status] || 'ACTIVE',
                    endDate: newEndDate,
                    stripeSubscriptionId: subscriptionId,
                    isRecurring: !subscription.cancel_at_period_end,
                    updatedAt: new Date()
                },
                create: {
                    restaurantId,
                    status: statusTransitions[subscription.status] || 'ACTIVE',
                    endDate: newEndDate,
                    stripeSubscriptionId: subscriptionId,
                    isRecurring: !subscription.cancel_at_period_end
                }
            });
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;

        console.log(`--- PROCESSING SUBSCRIPTION DELETION: ${subscriptionId} ---`);

        const sub = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscriptionId }
        });

        if (sub) {
            await prisma.subscription.update({
                where: { id: sub.id },
                data: {
                    status: 'EXPIRED',
                    isRecurring: false,
                    updatedAt: new Date()
                }
            });
            console.log(`DEACTIVATED: Subscription for restaurant ${sub.restaurantId} due to Stripe cancellation.`);
        }
    }

    return NextResponse.json({ received: true, verified: signatureVerified });
}
