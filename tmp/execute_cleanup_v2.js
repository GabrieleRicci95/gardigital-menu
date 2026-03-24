const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const idsToDelete = [
        'cmmpdz5a00004omd3s8e9ffod', // Gabriele SOLO
        'cmmpdz8yg0009omd3jn6ok4u7', // Arion SOLO
        'cmmpdzpk3005nomd3t7r4s5tz', // Aperifish SOLO
        'cmmpdzyq000b2omd3lc43e3kh'  // Mastro SOLO
    ];

    for (const id of idsToDelete) {
        try {
            const rest = await prisma.restaurant.findUnique({ where: { id } });
            if (!rest) continue;
            console.log(`Eliminazione di: ${rest.name} (${rest.slug})...`);
            await prisma.subscription.deleteMany({ where: { restaurantId: id } });
            await prisma.restaurant.delete({ where: { id } });
            console.log(`[OK] ${rest.name} eliminato.`);
        } catch (error) {
            console.error(`[ERRORE] ${id}:`, error.message);
        }
    }
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
