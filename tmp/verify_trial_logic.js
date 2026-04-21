const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRegistrationLogic() {
    const email = `test-apple-${Date.now()}@test.com`;
    console.log(`Testing registration for ${email}...`);

    try {
        // We simulate what the API does
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        const user = await prisma.user.create({
            data: {
                email,
                name: 'Test Apple',
                password: 'password123',
                role: 'OWNER',
                restaurants: {
                    create: {
                        name: 'Test Restaurant',
                        slug: `test-rest-${Date.now()}`,
                        subscription: {
                            create: {
                                plan: 'FULL',
                                status: 'ACTIVE',
                                startDate: new Date(),
                                endDate: trialEndDate,
                                hasTranslations: true,
                                hasReservations: true
                            }
                        }
                    }
                }
            },
            include: {
                restaurants: {
                    include: {
                        subscription: true
                    }
                }
            }
        });

        const sub = user.restaurants[0].subscription;
        console.log('--- Registration Result ---');
        console.log('Status:', sub.status);
        console.log('Plan:', sub.plan);
        console.log('End Date:', sub.endDate);
        
        const isTrialActive = sub.status === 'ACTIVE' && new Date(sub.endDate) > new Date();
        console.log('Is Trial Active:', isTrialActive);

        if (isTrialActive && sub.plan === 'FULL') {
            console.log('SUCCESS: Trial is correctly activated!');
        } else {
            console.log('FAILURE: Trial logic is incorrect.');
        }

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });
        console.log('Test user deleted.');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testRegistrationLogic();
