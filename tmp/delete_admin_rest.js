const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const ownerEmail = 'gabrielericci234@gmail.com';
    const rests = await prisma.restaurant.findMany({
        where: { owner: { email: ownerEmail } },
        select: { id: true, name: true, slug: true }
    });

    if (rests.length === 0) {
        console.log(`Nessun ristorante trovato per ${ownerEmail}.`);
        return;
    }

    console.log(`Trovati ${rests.length} ristoranti per l'admin:`);
    for (const r of rests) {
        console.log(`Eliminazione di: ${r.name} (${r.slug})...`);
        await prisma.subscription.deleteMany({ where: { restaurantId: r.id } });
        await prisma.restaurant.delete({ where: { id: r.id } });
        console.log(`[OK] ${r.name} eliminato.`);
    }
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
