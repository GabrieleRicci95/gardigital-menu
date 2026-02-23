import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSub() {
    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                OR: [
                    { id: 'cmlmuyjwe0002hgn2a547whlk' },
                    { slug: { contains: 'mastro-arrosticino' } }
                ]
            },
            include: {
                subscription: true
            }
        });

        if (!restaurant) {
            console.log('Restaurant not found');
            return;
        }

        console.log('--- RESTAURANT DATA ---');
        console.log('Name:', restaurant.name);
        console.log('Slug:', restaurant.slug);
        console.log('ID:', restaurant.id);
        console.log('Subscription:', restaurant.subscription ? {
            id: restaurant.subscription.id,
            plan: restaurant.subscription.plan,
            isRecurring: restaurant.subscription.isRecurring,
            stripeId: (restaurant.subscription as any).stripeSubscriptionId,
            endDate: restaurant.subscription.endDate,
            status: (restaurant.subscription as any).status
        } : 'NONE');

    } catch (error) {
        console.error('Query error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkSub();
