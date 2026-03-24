const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const s = await prisma.subscription.findFirst({
        where: { restaurant: { name: { contains: 'Mastro' } } }
    });
    console.log(JSON.stringify(s, null, 2));
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
