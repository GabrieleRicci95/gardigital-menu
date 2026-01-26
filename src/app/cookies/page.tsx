import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from '../page.module.css'; // Reusing main styles for consistency

export default function CookiePolicy() {
    return (
        <div className={styles.container}>
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        ← Torna alla Home
                    </Link>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Cookie Policy</h1>

                <section style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <p>
                        Questa Cookie Policy spiega cosa sono i cookie e come li utilizziamo. Dovresti leggere questa policy per capire il tipo di cookie che utilizziamo,
                        le informazioni che raccogliamo utilizzando i cookie e come tali informazioni vengono utilizzate.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Cosa sono i cookie?</h2>
                    <p>
                        I cookie sono piccoli file di testo che vengono utilizzati per memorizzare piccole informazioni. Vengono memorizzati sul tuo dispositivo quando il sito web viene caricato sul tuo browser.
                        Questi cookie ci aiutano a far funzionare correttamente il sito web, a renderlo più sicuro, a fornire una migliore esperienza utente e a capire come funziona il sito web e ad analizzare cosa funziona e dove necessita di miglioramenti.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Come utilizziamo i cookie?</h2>
                    <p>
                        Come la maggior parte dei servizi online, il nostro sito web utilizza cookie per diversi scopi.
                        I cookie di prima parte sono per lo più necessari per il corretto funzionamento del sito web e non raccolgono alcun dato personale identificabile.
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li><strong>Essenziali:</strong> Alcuni cookie sono essenziali per permetterti di provare la piena funzionalità del nostro sito. Ci permettono di mantenere le sessioni utente e prevenire qualsiasi minaccia alla sicurezza. Non raccolgono né memorizzano alcuna informazione personale.</li>
                        <li><strong>Funzionali:</strong> Questi sono i cookie che aiutano alcune funzionalità non essenziali sul nostro sito web. Queste funzionalità includono l'incorporamento di contenuti come video o la condivisione di contenuti del sito web su piattaforme di social media.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Gestione delle preferenze dei cookie</h2>
                    <p>
                        Puoi modificare le impostazioni del tuo browser per bloccare/cancellare i cookie. Per saperne di più su come gestire ed eliminare i cookie, visita wikipedia.org, www.allaboutcookies.org.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
