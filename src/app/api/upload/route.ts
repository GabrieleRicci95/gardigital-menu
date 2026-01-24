import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;
        const itemId = data.get('itemId') as string | null;
        const restaurantId = data.get('restaurantId') as string | null;
        const fieldName = data.get('fieldName') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a stream
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'gardigital-menu',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const imageUrl = uploadResult.secure_url;

        // Update Prisma
        if (itemId) {
            await prisma.menuItem.update({
                where: { id: itemId },
                data: { imageUrl }
            });
        } else if (restaurantId && fieldName) {
            if (fieldName !== 'logoUrl' && fieldName !== 'coverImageUrl') {
                return NextResponse.json({ error: 'Invalid field name' }, { status: 400 });
            }
            await prisma.restaurant.update({
                where: { id: restaurantId },
                data: { [fieldName]: imageUrl }
            });
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
