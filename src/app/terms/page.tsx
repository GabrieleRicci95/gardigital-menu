export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Termini e Condizioni</h1>
            <div className="prose">
                <p className="mb-4">Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">1. Accettazione dei Termini</h2>
                <p>
                    Utilizzando Gardigital Menu, accetti di essere vincolato da questi Termini e Condizioni.
                    Se non accetti questi termini, ti preghiamo di non utilizzare il servizio.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">2. Descrizione del Servizio</h2>
                <p>
                    Gardigital Menu fornisce una piattaforma per la creazione e gestione di menu digitali per ristoranti.
                    Ci riserviamo il diritto di modificare o interrompere il servizio in qualsiasi momento.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">3. Account Utente</h2>
                <p>
                    Sei responsabile della sicurezza del tuo account e della password.
                    Non siamo responsabili per eventuali perdite derivanti dall'uso non autorizzato del tuo account.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">4. Abbonamenti e Pagamenti</h2>
                <p>
                    Alcune funzionalità richiedono un abbonamento a pagamento.
                    Tutti i pagamenti sono gestiti in modo sicuro tramite processori di pagamento terzi.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">5. Proprietà Intellettuale</h2>
                <p>
                    Mantieni la proprietà dei contenuti (foto, testi) che carichi.
                    Concedi a noi una licenza per ospitare e visualizzare tali contenuti al solo scopo di fornire il servizio.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">6. Legge Applicabile</h2>
                <p>
                    Questi termini sono regolati dalle leggi vigenti in Italia.
                </p>
            </div>
        </div>
    );
}
