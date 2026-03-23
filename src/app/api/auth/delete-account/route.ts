import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, logout, isDemoSession } from '@/lib/auth';

export async function DELETE() {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    if (isDemoSession(session)) {
        return NextResponse.json({ error: 'L\'account demo non può essere eliminato.' }, { status: 403 });
    }

    const userId = session.user.id;

    try {
        // 1. Trova tutti i ristoranti dell'utente
        const restaurants = await prisma.restaurant.findMany({
            where: { ownerId: userId }
        });

        // 2. Elimina i ristoranti uno per uno 
        // Nota: Nel Prisma schema, molti modelli hanno onDelete: Cascade rispetto a Restaurant.
        // Tuttavia, per sicurezza e per gestire eventuali mancanze nel cascade, 
        // eseguiamo un'eliminazione pulita.
        
        for (const rest of restaurants) {
            // Eliminiamo il ristorante. Il cascade dovrebbe pulire il resto.
            await prisma.restaurant.delete({
                where: { id: rest.id }
            });
        }

        // 3. Elimina l'utente stesso
        await prisma.user.delete({
            where: { id: userId }
        });

        // 4. Esegui il logout (cancella il cookie di sessione)
        await logout();

        return NextResponse.json({ success: true, message: 'Account e dati eliminati con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'account:', error);
        return NextResponse.json({ 
            error: 'Si è verificato un errore durante l\'eliminazione dell\'account. Riprova più tardi o contatta l\'assistenza.' 
        }, { status: 500 });
    }
}
