import { prisma } from './src/lib/prisma';

async function checkXL() {
    const slug = 'aperifish-xl-drink-e-wine-733-solo';
    const rest = await prisma.restaurant.findUnique({
        where: { slug },
        include: { subscription: true }
    });
    if (!rest) {
        console.log("NOT_FOUND");
        return;
    }
    console.log("NAME:", rest.name);
    console.log("SLUG:", rest.slug);
    console.log("SUB_STATUS:", rest.subscription?.status);
    console.log("HAS_RESERVATIONS:", rest.subscription?.hasReservations);
}

checkXL();
