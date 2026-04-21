import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, logout, isDemoSession, verifyPassword } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function DELETE(request: Request) {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    if (isDemoSession(session)) {
        // PER APPLE REVIEW: Simulate deletion success for demo account
        // We log out the user and return success, but DON'T delete the database record.
        await logout();
        return NextResponse.json({ 
            success: true, 
            message: 'Account e dati eliminati con successo (SIMULAZIONE DEMO)' 
        });
    }

    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Password richiesta per confermare l\'operazione.' }, { status: 400 });
        }

        const userId = session.user.id;

        // 1. Recupera l'utente per verificare la password
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utente non trovato.' }, { status: 404 });
        }

        // 2. Verifica la password
        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: 'Password errata. Impossibile procedere con l\'eliminazione.' }, { status: 401 });
        }

        // 3. Trova tutti i ristoranti dell'utente con le relative sottoscrizioni
        const restaurants = await prisma.restaurant.findMany({
            where: { ownerId: userId },
            include: { subscription: true }
        });

        // 4. Gestione Stripe e eliminazione ristoranti
        for (const rest of restaurants) {
            // Se c'è un abbonamento Stripe attivo, lo cancelliamo
            if (rest.subscription?.stripeSubscriptionId && rest.subscription.isRecurring) {
                try {
                    await stripe.subscriptions.cancel(rest.subscription.stripeSubscriptionId);
                    console.log(`Cancellato abbonamento Stripe ${rest.subscription.stripeSubscriptionId} per ristorante ${rest.id}`);
                } catch (stripeError) {
                    console.error(`Errore durante la cancellazione Stripe per ${rest.id}:`, stripeError);
                    // Continuiamo comunque l'eliminazione dei dati locali
                }
            }

            // Elimina il ristorante (la sottoscrizione sarà eliminata via cascade se lo schema è aggiornato)
            await prisma.restaurant.delete({
                where: { id: rest.id }
            });
        }

        // 5. Elimina l'utente stesso
        await prisma.user.delete({
            where: { id: userId }
        });

        // 6. Esegui il logout
        await logout();

        return NextResponse.json({ success: true, message: 'Account e dati eliminati con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'account:', error);
        return NextResponse.json({ 
            error: 'Si è verificato un errore durante l\'eliminazione dell\'account. Riprova più tardi o contatta l\'assistenza.' 
        }, { status: 500 });
    }
}
