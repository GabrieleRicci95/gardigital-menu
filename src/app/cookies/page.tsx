import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from '../legal.module.css';

export default function CookiePolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Torna alla Home
                </Link>

                <h1 className={styles.title}>Cookie Policy</h1>

                <div className={styles.text}>
                    <section className={styles.section}>
                        <p className={styles.text}>
                            Questa Cookie Policy spiega cosa sono i cookie e come li utilizziamo. Dovresti leggere questa policy per capire il tipo di cookie che utilizziamo,
                            le informazioni che raccogliamo utilizzando i cookie e come tali informazioni vengono utilizzate.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Cosa sono i cookie?</h2>
                        <p className={styles.text}>
                            I cookie sono piccoli file di testo che vengono utilizzati per memorizzare piccole informazioni. Vengono memorizzati sul tuo dispositivo quando il sito web viene caricato sul tuo browser.
                            Questi cookie ci aiutano a far funzionare correttamente il sito web, a renderlo più sicuro, a fornire una migliore esperienza utente e a capire come funziona il sito web e ad analizzare cosa funziona e dove necessita di miglioramenti.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Come utilizziamo i cookie?</h2>
                        <p className={styles.text}>
                            Come la maggior parte dei servizi online, il nostro sito web utilizza cookie per diversi scopi.
                            I cookie di prima parte sono per lo più necessari per il corretto funzionamento del sito web e non raccolgono alcun dato personale identificabile.
                        </p>
                        <ul className={styles.list}>
                            <li><strong>Essenziali:</strong> Alcuni cookie sono essenziali per permetterti di provare la piena funzionalità del nostro sito. Ci permettono di mantenere le sessioni utente e prevenire qualsiasi minaccia alla sicurezza. Non raccolgono né memorizzano alcuna informazione personale.</li>
                            <li><strong>Funzionali:</strong> Questi sono i cookie che aiutano alcune funzionalità non essenziali sul nostro sito web. Queste funzionalità includono l'incorporamento di contenuti come video o la condivisione di contenuti del sito web su piattaforme di social media.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Gestione delle preferenze dei cookie</h2>
                        <p className={styles.text}>
                            Puoi modificare le impostazioni del tuo browser per bloccare/cancellare i cookie. Per saperne di più su come gestire ed eliminare i cookie, visita wikipedia.org, www.allaboutcookies.org.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
