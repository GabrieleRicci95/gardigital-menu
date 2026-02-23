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

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.gardigital.it';

        const { planType } = await req.json().catch(() => ({ planType: 'MENU' }));

        let priceAmount = 1500; // Default Menu (€15.00)
        let productName = `Rinnovo Menu Digitale - ${restaurant.name}`;
        let productDescription = 'Accesso al menu digitale interattivo e traduzioni base.';

        if (planType === 'FULL') {
            priceAmount = 2999; // Full Package Bundle Discount (€29.99)
            // SPECIAL PRICE FOR PILOT PARTNER: Mastroarrosticino (Gaspare)
            if (restaurant.id === 'cmlmuyjwe0002hgn2a547whlk' || restaurant.slug.includes('mastro-arrosticino')) {
                priceAmount = 1500;
            }
            productName = `Rinnovo Pacchetto FULL - ${restaurant.name}`;
            productDescription = 'Menu Digitale + Traduzioni AI illimitate + Agenda Prenotazioni.';
        } else if (planType === 'MENU_AI') {
            priceAmount = 2500; // Menu + AI (€25.00)
            productName = `Rinnovo Menu + Traduzioni AI - ${restaurant.name}`;
            productDescription = 'Menu Digitale e sistema di traduzione automatica AI.';
        } else if (planType === 'MENU_AGENDA') {
            priceAmount = 2500; // Menu + Agenda (€25.00)
            productName = `Rinnovo Menu + Agenda - ${restaurant.name}`;
            productDescription = 'Menu Digitale e sistema di gestione prenotazioni interattivo.';
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName,
                            description: productDescription,
                        },
                        unit_amount: priceAmount,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/dashboard/subscription?success=true`,
            cancel_url: `${origin}/dashboard/subscription?canceled=true`,
            metadata: {
                restaurantId: restaurant.id,
                ownerId: session.user.id,
                type: 'subscription_renewal',
                planType: planType
            },
            subscription_data: {
                metadata: {
                    restaurantId: restaurant.id,
                    ownerId: session.user.id,
                    planType: planType
                }
            },
            customer_email: session.user.email
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);

        // Provide diagnostic info to help identify 'Invalid API Key' issues
        const secretKey = process.env.STRIPE_SECRET_KEY || '';
        const debugInfo = {
            message: error.message,
            keyInfo: {
                length: secretKey.length,
                prefix: secretKey.substring(0, 10),
                suffix: secretKey.substring(secretKey.length - 4),
                rawPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 5) // Check if raw env var is there
            }
        };

        return NextResponse.json({
            error: error.message || 'Internal server error',
            debug: debugInfo
        }, { status: 500 });
    }
}
