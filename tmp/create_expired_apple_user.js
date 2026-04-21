const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Creating expired apple-expired@solomenu.it account...');
    
    // Check if the user exists first
    const existingUser = await prisma.user.findUnique({
        where: { email: 'apple-expired@solomenu.it' }
    });

    const hashedPassword = await bcrypt.hash('appletest', 10);
    // Set expiry date to 1 month ago
    const expireDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 

    if (existingUser) {
        console.log('User exists. Deleting it to ensure clean state...');
        await prisma.user.delete({
            where: { email: 'apple-expired@solomenu.it' }
        });
    }

    console.log('Creating new user with expired subscription...');
    await prisma.user.create({
        data: {
            email: 'apple-expired@solomenu.it',
            name: 'Apple Expired Reviewer',
            password: hashedPassword,
            role: 'OWNER',
            restaurants: {
                create: {
                    name: 'Expired Review Restaurant',
                    slug: 'expired-review-restaurant',
                    subscription: {
                        create: {
                            plan: 'FULL',
                            status: 'ACTIVE', // Status is active but endDate is past, which triggers paywall
                            endDate: expireDate,
                            hasTranslations: true,
                            hasReservations: true,
                            hasOrders: true
                        }
                    }
                }
            }
        }
    });
    console.log('Created expired Apple Test user successfully!');
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
