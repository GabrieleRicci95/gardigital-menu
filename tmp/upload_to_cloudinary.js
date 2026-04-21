const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
    console.log('Uploading images to Cloudinary for Apple Review Restaurant...');

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: 'apple-review-restaurant' },
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
    });

    if (!restaurant) {
        console.error('Restaurant not found!');
        return;
    }

    const imagesToUpload = [
        { name: 'Bruschette Miste', localPath: 'public/uploads/apple-test/bruschette.png' },
        { name: 'Spaghetti alla Chitarra con Pallottine', localPath: 'public/uploads/apple-test/spaghetti_pallottine.png' },
        { name: 'Arrosticini Regionali', localPath: 'public/uploads/apple-test/arrosticini.png' },
        { name: 'Patate al Forno', localPath: 'public/uploads/apple-test/patate_forno.png' },
        { name: 'Tiramisù della Casa', localPath: 'public/uploads/apple-test/tiramisu.png' }
    ];

    const urlMap = new Map();

    for (const img of imagesToUpload) {
        try {
            console.log(`Uploading ${img.localPath}...`);
            const result = await cloudinary.uploader.upload(img.localPath, {
                folder: 'gardigital-menu/apple-test',
                use_filename: true,
                unique_filename: false
            });
            urlMap.set(img.name, result.secure_url);
            console.log(`Uploaded ${img.name} -> ${result.secure_url}`);
        } catch (error) {
            console.error(`Error uploading ${img.name}:`, error);
        }
    }

    console.log('Updating database with Cloudinary URLs...');

    for (const menu of restaurant.menus) {
        for (const category of menu.categories) {
            for (const item of category.items) {
                if (urlMap.has(item.name)) {
                    await prisma.menuItem.update({
                        where: { id: item.id },
                        data: { imageUrl: urlMap.get(item.name) }
                    });
                    console.log(`Updated DB for: ${item.name}`);
                }
            }
        }
    }

    console.log('All images uploaded and DB updated successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
