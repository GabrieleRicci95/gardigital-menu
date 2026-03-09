import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTokens() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                pushTokens: true
            }
        });

        console.log('--- Restaurant Push Tokens Status ---');
        restaurants.forEach(r => {
            console.log(`Restaurant: ${r.name} (${r.slug})`);
            console.log(`ID: ${r.id}`);
            console.log(`Tokens count: ${r.pushTokens?.length || 0}`);
            if (r.pushTokens && r.pushTokens.length > 0) {
                console.log(`Tokens: ${JSON.stringify(r.pushTokens)}`);
            }
            console.log('-----------------------------------');
        });

    } catch (error) {
        console.error('Error checking tokens:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTokens();
