'use client';

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
          <Link href="/contact?plan=Informazioni" className={styles.primaryBtn} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Richiedi Info</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Digitalizza il tuo Ristorante:<br />
              <span className={styles.highlight}>dal Menu alle Prenotazioni</span>
            </h1>
            <p className={styles.heroText}>
              L'unico sistema che unisce Menu Digitale Premium, Agenda Elettronica e Sito Web Professionale.
              Gestisci prenotazioni WhatsApp e clienti con un'unica piattaforma elegante e veloce.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/contact?plan=Informazioni" className={styles.primaryBtn}>Contattaci per informazioni</Link>
              <button
                onClick={() => {
                  fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'demo@gardigital.it', password: 'demo' }),
                  }).then(res => res.json()).then(data => {
                    if (data.redirect || data.success) window.location.href = data.redirect || '/dashboard';
                  });
                }}
                className={styles.secondaryBtn}
                style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid currentColor' }}
              >
                Prova la demo
              </button>
              <Link href="/menu/demo" className={styles.secondaryBtn} target="_blank" style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}>Visualizza Menu</Link>
              <Link href="/vantaggi" className={styles.secondaryBtn} style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}>Scopri di più</Link>
            </div>
          </div>
        </section>

        <section id="why-us" className={styles.whyUs}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#e2b13c' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Design d'Eccellenza</h3>
              <p className={styles.featureText}>Non un semplice menu, ma un'opera d'arte digitale che riflette l'identità e la classe del tuo locale.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#4caf50' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Semplicità Assoluta</h3>
              <p className={styles.featureText}>Gestisci piatti, prezzi e prenotazioni in pochi clic. Niente app da scaricare, tutto via browser.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: '#1a237e' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Supporto Premium</h3>
              <p className={styles.featureText}>Ti seguiamo personalizzate per configurare il tuo kit digitale. Supporto diretto WhatsApp a tua disposizione.</p>
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
                <li>QR Code</li>
                <li>Limite piatti 20</li>
                <li>Traduzione AI Multilingua</li>
                <li>Supporto Email</li>
              </ul>
              <Link href="/contact?plan=Base" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Contattaci per Info</Link>
            </div>

            {/* Premium Plan */}
            <div className={`${styles.pricingCard} ${styles.premiumCard}`}>
              <div className={styles.badge}>CONSIGLIATO</div>
              <h3 className={styles.planName}>Premium</h3>
              <div className={styles.price}>€29,<small style={{ fontSize: '0.6em' }}>99</small><span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li>Tutto incluso nel Base</li>
                <li>Piatti Illimitati</li>
                <li>Immagini Piatti Personalizzabili</li>
                <li>Traduzione AI Multilingua</li>
                <li>QR Code</li>
                <li>Supporto Prioritario WhatsApp</li>
              </ul>
              <Link href="/contact?plan=Premium" className={styles.primaryBtn} style={{ textAlign: 'center', boxShadow: 'none' }}>Richiedi Premium</Link>
            </div>

            {/* Website / Agency Plan */}
            <div className={`${styles.pricingCard} ${styles.agencyCard}`}>
              <div className={styles.badge} style={{ backgroundColor: '#e2b13c', color: '#000' }}>BEST VALUE</div>
              <h3 className={styles.planName}>Full</h3>
              <div className={styles.price}>€69,<small style={{ fontSize: '0.6em' }}>99</small><span className={styles.period}>/mese</span></div>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Premium Incluso</li>
                <li>Personalizzazione del tuo Menu</li>
                <li>Traduzione AI Multilingua</li>
                <li>Servizio Prenotazioni su WhatsApp</li>
                <li>Agenda Elettronica</li>
                <li>Creazione Sito Internet del tuo Ristorante</li>
                <li>Dominio (es. .it) e Hosting</li>
              </ul>
              <Link href="/contact?plan=Full" className={styles.primaryBtn} style={{ backgroundColor: '#e2b13c', color: '#000', border: 'none', textAlign: 'center' }}>Richiedi Full</Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
