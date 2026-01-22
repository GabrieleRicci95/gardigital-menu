import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token e nuova password richiesti' }, { status: 400 });
        }

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Check if expiry is in the future
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Token non valido o scaduto' }, { status: 400 });
        }

        // Update password and clear token
        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ success: true, message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
