const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'apple-test@solomenu.it' },
        include: {
            restaurants: {
                include: {
                    menus: {
                        include: {
                            categories: {
                                include: {
                                    items: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User found:', user.email);
    user.restaurants.forEach(r => {
        console.log(`Restaurant: ${r.name} (${r.slug})`);
        r.menus.forEach(m => {
            console.log(`  Menu: ${m.name} (Active: ${m.isActive})`);
            m.categories.forEach(c => {
                console.log(`    Category: ${c.name}`);
                c.items.forEach(i => {
                    console.log(`      Item: ${i.name} - ${i.price}€`);
                });
            });
        });
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
