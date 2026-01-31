import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message, plan } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = 'gabrielericci234@gmail.com'; // Target email for inquiries

        if (!resendApiKey) {
            console.error('RESEND_API_KEY missing');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
            from: 'Gardigital Contact <info@gardigital.it>', // Use verified domain if available, otherwise test domain
            to: adminEmail,
            replyTo: email,
            subject: `Nuova Richiesta: Piano ${plan} - ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #1a237e;">Nuovo Contatto dal Sito</h2>
                    <p><strong>Piano di interesse:</strong> ${plan}</p>
                    <hr />
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telefono:</strong> ${phone || 'Non specificato'}</p>
                    <hr />
                    <h3>Messaggio:</h3>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Errore invio messaggio' }, { status: 500 });
    }
}
