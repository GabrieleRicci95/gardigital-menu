import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email richiesta' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Do not reveal if user exists
            return NextResponse.json({ success: true, message: 'Se l\'email esiste, riceverai un link di reset.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        // Send Email via Resend
        // Only attempt if API key is present
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            try {
                await resend.emails.send({
                    from: 'Gardigital Menu <noreply@gardigital.it>',
                    to: email,
                    subject: 'Reset Password - Gardigital Menu',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Reset Password</h2>
                            <p>È stato richiesto un reset della password per il tuo account.</p>
                            <p>Clicca il bottone qui sotto per reimpostarla:</p>
                            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                            <p style="margin-top: 20px; font-size: 12px; color: #666;">Se non hai richiesto questo reset, ignora questa email.</p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
            }
        } else {
            console.log('RESEND_API_KEY missing, skipping email send.');
            console.log('Reset Link:', resetLink);
        }

        return NextResponse.json({ success: true, message: 'Se l\'email esiste, riceverai un link di reset.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
