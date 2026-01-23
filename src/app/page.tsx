import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo_v2.png" alt="Gardigital Menu" className={styles.logoImage} />
        </div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.navLink}>Accedi</Link>
          <Link href="/register" className="btn btn-primary">Registrati</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Il Menu Digitale <span className={styles.highlight}>Premium</span> per il tuo Ristorante
          </h1>
          <p className={styles.heroText}>
            Crea menu eleganti, gestisci gli ordini e offri un'esperienza moderna ai tuoi clienti.
            Tutto in un'unica piattaforma semplice e potente.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/register" className="btn btn-primary">Crea il tuo Menu</Link>
            <Link href="#features" className={styles.secondaryLink}>Scopri le funzionalità</Link>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className="card">
            <h3>Gestione Semplice</h3>
            <p>Aggiorna piatti, prezzi e foto in tempo reale direttamente dal tuo smartphone.</p>
          </div>
          <div className="card">
            <h3>QR Code Istantaneo</h3>
            <p>Scarica il QR code pronto per la stampa appena crei il tuo profilo.</p>
          </div>
          <div className="card">
            <h3>Design Elegante</h3>
            <p>I tuoi clienti apprezzeranno un'interfaccia pulita, veloce e bellissima.</p>
          </div>
        </section>

        <section id="pricing" className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Scegli il tuo Piano</h2>
          <div className={styles.pricingGrid}>

            {/* Basic Plan */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Base</h3>
              <div className={styles.price}>€15<span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Semplice</li>
                <li>QR Code Standard</li>
                <li>Limite piatti 15</li>
              </ul>
              <Link href="/contact?plan=Base" className="btn btn-primary" style={{ backgroundColor: '#757575' }}>Contattaci per Info</Link>
            </div>

            {/* Premium Plan */}
            <div className={`${styles.pricingCard} ${styles.premiumCard}`}>
              <div className={styles.badge}>CONSIGLIATO</div>
              <h3 className={styles.planName}>Premium</h3>
              <div className={styles.price}>€29<span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li><strong>Tutto incluso nel Base</strong></li>
                <li>Piatti Illimitati</li>
                <li>Inserire immagini personalizzabili</li>
                <li><strong>IA Generatore Menu</strong> ✨</li>
                <li>QR Code Personalizzato</li>
                <li>Traduzione Multilingua</li>
              </ul>
              <Link href="/contact?plan=Premium" className="btn btn-primary">Richiedi Premium</Link>
            </div>

          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Gardigital Menu. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
