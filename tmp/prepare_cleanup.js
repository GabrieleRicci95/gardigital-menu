const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const restaurants = await prisma.restaurant.findMany({
        include: {
            owner: true
        }
    });

    const toDelete = [];
    const toKeep = [];

    // Group by owner
    const ownerMap = {};
    restaurants.forEach(r => {
        if (!ownerMap[r.ownerId]) ownerMap[r.ownerId] = [];
        ownerMap[r.ownerId].push(r);
    });

    for (const ownerId in ownerMap) {
        const rests = ownerMap[ownerId];
        if (rests.length > 1) {
            // It has duplicates
            const solo = rests.find(r => r.slug.endsWith('-solo'));
            const main = rests.find(r => !r.slug.endsWith('-solo'));
            
            if (solo && main) {
                // We have a direct duplicate pair
                // Special case: Ristorante di test (apple-test@solomenu.it)
                if (rests[0].owner.email === 'apple-test@solomenu.it') {
                    console.log(`Owner: ${rests[0].owner.email} - KEEPING BOTH for Apple Review.`);
                    continue;
                }
                
                toDelete.push(solo);
                toKeep.push(main);
            } else if (rests.length > 1) {
                console.log(`Owner: ${rests[0].owner.email} - Ambiguous duplicates:`, rests.map(r => r.slug));
            }
        }
    }

    console.log('\n--- CANDIDATES FOR DELETION ---');
    toDelete.forEach(r => {
        console.log(`DELETE: [${r.id}] ${r.name} (${r.slug})`);
    });

    console.log('\n--- MAIN RESTAURANTS TO KEEP ---');
    toKeep.forEach(r => {
        console.log(`KEEP: [${r.id}] ${r.name} (${r.slug})`);
    });
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
