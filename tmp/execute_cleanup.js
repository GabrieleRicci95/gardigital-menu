const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const idsToDelete = [
        'cmmpdz3o50001omd314vi4sgv', // Ristorante La Gorgonia (SOLO)
        'cmmpdz5a30003omd3c32k4273', // Ristorante di Gabriele (SOLO)
        'cmmpdz6ue0007omd3v6eodfhd', // Ristorante di demo.google (SOLO)
        'cmmpdzyqw000bomd3i0bmbn2v', // Mastro arrosticino (SOLO)
        'cmmpdz8yo0009omd3e3z3x816', // Arion club (SOLO)
        'cmmpdzpkn000domd3v5n1b77k'  // Aperifish & XL Drink e Wine (SOLO)
    ];

    console.log(`Eliminazione di ${idsToDelete.length} ristoranti doppi...`);

    for (const id of idsToDelete) {
        try {
            // Check if it exists
            const rest = await prisma.restaurant.findUnique({ where: { id } });
            if (!rest) {
                console.log(`[SKIP] ID ${id} non trovato.`);
                continue;
            }

            console.log(`Eliminazione di: ${rest.name} (${rest.slug})...`);

            // 1. Delete Subscription (no cascade defined in schema for this one)
            await prisma.subscription.deleteMany({ where: { restaurantId: id } });

            // 2. Delete Restaurant (others should cascade)
            await prisma.restaurant.delete({ where: { id } });

            console.log(`[OK] ${rest.name} eliminato.`);
        } catch (error) {
            console.error(`[ERRORE] Impossibile eliminare ${id}:`, error.message);
        }
    }

    console.log('\nPulizia completata.');
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
