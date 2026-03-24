const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const solo = await prisma.restaurant.findMany({
        where: { slug: { endsWith: '-solo' } },
        select: { id: true, name: true, slug: true }
    });
    console.log(JSON.stringify(solo, null, 2));
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
