import Link from "next/link";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/gardigital-logo-header.png" alt="Gardigital Menu" className={styles.logoImage} />
        </div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.navLink}>Accedi</Link>
          <Link href="/register" className={styles.primaryBtn} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Registrati</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Il Menu Digitale <span className={styles.highlight}>Premium</span><br />per il tuo Ristorante
            </h1>
            <p className={styles.heroText}>
              Crea menu eleganti e offri un'esperienza moderna ai tuoi clienti.
              Realizziamo anche <strong>Siti Web Professionali</strong> su misura per la tua attività.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/register" className={styles.primaryBtn}>Crea il tuo Menu</Link>
              <Link href="#features" className={styles.secondaryBtn}>Scopri le funzionalità</Link>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#ff9800' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Gestione Semplice</h3>
              <p className={styles.featureText}>Aggiorna piatti, prezzi e foto in tempo reale direttamente dal tuo smartphone. Le modifiche sono istantanee.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#1a237e' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <h3 className={styles.featureTitle}>QR Code Istantaneo</h3>
              <p className={styles.featureText}>Scarica il tuo QR code personalizzato pronto per la stampa non appena crei il profilo del tuo ristorante.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#e91e63' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Design Elegante</h3>
              <p className={styles.featureText}>I tuoi clienti apprezzeranno un'interfaccia pulita, veloce e curata nei minimi dettagli.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Scegli il tuo Piano</h2>
          <p className={styles.sectionSubtitle}>Soluzioni flessibili per ogni tipo di attività, dal piccolo bar al grande ristorante.</p>

          <div className={styles.pricingGrid}>

            {/* Basic Plan */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Base</h3>
              <div className={styles.price}>€9,<small style={{ fontSize: '0.6em' }}>99</small><span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Semplice</li>
                <li>QR Code Standard</li>
                <li>Limite piatti 20</li>
                <li>Supporto Email</li>
              </ul>
              <Link href="/contact?plan=Base" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Contattaci per Info</Link>
            </div>

            {/* Premium Plan */}
            <div className={`${styles.pricingCard} ${styles.premiumCard}`}>
              <div className={styles.badge}>CONSIGLIATO</div>
              <h3 className={styles.planName}>Premium</h3>
              <div className={styles.price}>€29<span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li><strong>Tutto incluso nel Base</strong></li>
                <li>Piatti Illimitati</li>
                <li>Immagini Piatti Personalizzabili</li>

                <li>QR Code Personalizzato</li>

                <li>Supporto Prioritario WhatsApp</li>
              </ul>
              <Link href="/contact?plan=Premium" className={styles.primaryBtn} style={{ textAlign: 'center', boxShadow: 'none' }}>Richiedi Premium</Link>
            </div>

            {/* Website / Agency Plan */}
            <div className={`${styles.pricingCard} ${styles.agencyCard}`}>
              <div className={styles.badge} style={{ backgroundColor: '#e2b13c', color: '#000' }}>BEST VALUE</div>
              <h3 className={styles.planName}>Sito Web Completo</h3>
              <div className={styles.price}>Su Misura</div>
              <ul className={styles.planFeatures}>
                <li><strong>Realizzazione Sito Internet</strong></li>
                <li>Menu Digitale Premium Incluso</li>
                <li>Design Unico per il tuo Locale</li>
                <li>Dominio (es. .it) e Hosting</li>
                <li>Sistema Prenotazioni Tavoli</li>
                <li>Indicizzazione Google (SEO)</li>
              </ul>
              <Link href="/contact?plan=Website" className={styles.primaryBtn} style={{ backgroundColor: '#e2b13c', color: '#000', border: 'none', textAlign: 'center' }}>Richiedi Preventivo</Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
