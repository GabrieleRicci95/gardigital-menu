const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const restaurants = await prisma.restaurant.findMany({
        include: {
            owner: { select: { email: true } },
            subscription: { select: { plan: true } }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    console.log('--- DUPLICATE ANALYSIS ---');
    const ownerMap = {};
    restaurants.forEach(r => {
        if (!ownerMap[r.ownerId]) {
            ownerMap[r.ownerId] = [];
        }
        ownerMap[r.ownerId].push(r);
    });

    for (const ownerId in ownerMap) {
        const rests = ownerMap[ownerId];
        if (rests.length > 1) {
            console.log(`\nOwner: ${rests[0].owner.email} (${ownerId})`);
            rests.forEach(r => {
                console.log(`  - [${r.id}] ${r.name} (Slug: ${r.slug}) Created: ${r.createdAt.toISOString()} Plan: ${r.subscription?.plan || 'None'}`);
            });
        }
    }
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
