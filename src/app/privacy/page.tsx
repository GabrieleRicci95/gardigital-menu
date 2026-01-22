export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose">
                <p className="mb-4">Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduzione</h2>
                <p>
                    Gardigital Menu ("noi", "nostro") si impegna a proteggere la tua privacy.
                    Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">2. Dati Raccolti</h2>
                <p>
                    Raccogliamo i seguenti dati necessari per l'erogazione del servizio:
                    <ul className="list-disc ml-6 mt-2">
                        <li>Indirizzo email (per account e recupero password)</li>
                        <li>Dati relativi al ristorante (menu, immagini, descrizioni)</li>
                        <li>Dati di utilizzo del servizio</li>
                    </ul>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">3. Finalità del Trattamento</h2>
                <p>
                    Utilizziamo i tuoi dati per:
                    <ul className="list-disc ml-6 mt-2">
                        <li>Fornire e mantenere il servizio</li>
                        <li>Gestire il tuo account e abbonamento</li>
                        <li>Inviare comunicazioni di servizio</li>
                    </ul>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">4. Terze Parti</h2>
                <p>
                    Potremmo condividere i dati con fornitori di servizi terzi strettamente necessari, come:
                    <ul className="list-disc ml-6 mt-2">
                        <li>Processori di pagamento (Stripe)</li>
                        <li>Servizi di hosting e infrastruttura</li>
                        <li>Servizi di invio email</li>
                    </ul>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">5. Contatti</h2>
                <p>
                    Per domande sulla privacy, contattaci all'indirizzo email di supporto.
                </p>
            </div>
        </div>
    );
}
