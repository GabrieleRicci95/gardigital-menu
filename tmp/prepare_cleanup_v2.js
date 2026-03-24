const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const restaurants = await prisma.restaurant.findMany({
        include: { owner: true }
    });

    const toDelete = [];
    const ownerMap = {};
    restaurants.forEach(r => {
        if (!ownerMap[r.ownerId]) ownerMap[r.ownerId] = [];
        ownerMap[r.ownerId].push(r);
    });

    let report = 'RISTORANTI DOPPI INDENTIFICATI PER L\'ELIMINAZIONE:\n\n';

    for (const ownerId in ownerMap) {
        const rests = ownerMap[ownerId];
        if (rests.length > 1) {
            const solo = rests.find(r => r.slug.endsWith('-solo'));
            const main = rests.find(r => !r.slug.endsWith('-solo'));
            
            if (solo && main) {
                if (rests[0].owner.email === 'apple-test@solomenu.it') {
                    report += `[SKIP] ${rests[0].owner.email}: Entrambi mantenuti per Apple Review.\n`;
                    continue;
                }
                toDelete.push({ id: solo.id, name: solo.name, slug: solo.slug, owner: solo.owner.email });
                report += `[DELETE] ${solo.name} (${solo.slug}) - Proprietario: ${solo.owner.email}\n`;
                report += `         -> Mantenuto: ${main.name} (${main.slug})\n\n`;
            }
        }
    }

    fs.writeFileSync('tmp/cleanup_final.txt', report, 'utf8');
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
