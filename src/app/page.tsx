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
          <Link href="/chi-siamo" className={styles.navLink}>Chi Siamo</Link>
          <Link href="/login" className={styles.navLink}>Accedi</Link>
          <Link href="/contact?plan=Informazioni" className={styles.primaryBtn} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Richiedi Info</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Non solo un Menu.<br />
              <span className={styles.highlight}>Un'Esperienza Unica</span>
            </h1>
            <p className={styles.heroText}>
              Digitalizziamo ogni aspetto del tuo ristorante con un sistema su misura curato nei minimi dettagli.
              Dalla creazione del Menu Digitale Premium al Sito Web, fino alla gestione delle Prenotazioni e al Marketing strategico.
              Tutto quello che ti serve per eccellere, in un'unica piattaforma esclusiva.
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
            </div>
          </div>
        </section>

        <section id="why-us" className={styles.whyUs}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Design d'Eccellenza</h3>
              <p className={styles.featureText}>Non un semplice menu, ma un'opera d'arte digitale che riflette l'identità e la classe del tuo locale.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Semplicità Assoluta</h3>
              <p className={styles.featureText}>Gestisci piatti, prezzi e prenotazioni in pochi clic. Niente app da scaricare, tutto via browser.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Supporto Premium</h3>
              <p className={styles.featureText}>Ti seguiamo passo passo per configurare il tuo kit digitale. Supporto diretto WhatsApp a tua disposizione.</p>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Gestione Semplice</h3>
              <p className={styles.featureText}>Aggiorna piatti, prezzi e foto in tempo reale direttamente dal tuo smartphone. Le modifiche sono istantanee.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <h3 className={styles.featureTitle}>QR Code Istantaneo</h3>
              <p className={styles.featureText}>Scarica il tuo QR code personalizzato pronto per la stampa non appena crei il profilo del tuo ristorante.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <h3 className={styles.featureTitle}>Design Elegante</h3>
              <p className={styles.featureText}>I tuoi clienti apprezzeranno un'interfaccia pulita, veloce e curata nei minimi dettagli.</p>
            </div>
          </div>
        </section>

        <section className={styles.marketingSection}>
          <div className={styles.marketingContent}>
            <div className={styles.marketingTextContent}>
              <h2 className={styles.marketingTitle}>Non solo Software: <br /><span className={styles.highlight}>Strategia e Crescita</span></h2>
              <p className={styles.marketingDesc}>
                Il menu digitale è solo l'inizio. Sappiamo che per un ristorante il successo passa anche da come ci si presenta al mondo.
                <br /><br />
                Per questo, <strong>collaboriamo con professionisti del marketing</strong> per offrirti non solo strumenti tecnologici, ma una vera strategia di crescita. Social Media, Google Ads, e Brand Identity: ti aiutiamo a riempire i tavoli, non solo a gestirli.
              </p>
              <Link href="/contact?plan=Marketing" className={styles.primaryBtn}>Scopri la Consulenza</Link>
            </div>
            <div className={styles.marketingVisual}>
              <div className={styles.marketingImageContainer}>
                <img src="/assets/marketing-strategy.jpg" alt="Strategia Marketing Ristorante" className={styles.marketingImage} />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Scegli il tuo Piano</h2>
          <p className={styles.sectionSubtitle}>Soluzioni flessibili per ogni tipo di attività, dal piccolo bar al grande ristorante.</p>

          <div className={styles.pricingGrid}>

            {/* Basic Plan */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Start</h3>
              <p className={styles.solutionDesc}>L'essenziale per digitalizzare il tuo menu.</p>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Semplice</li>
                <li>QR Code Personalizzato</li>
                <li>Fino a 20 Piatti</li>
                <li>Traduzione AI Multilingua</li>
                <li>Supporto Email</li>
              </ul>
              <Link href="/contact?plan=Start" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Richiedi Preventivo</Link>
            </div>

            {/* Premium Plan */}
            <div className={`${styles.pricingCard} ${styles.premiumCard}`}>
              <div className={styles.badge}>POPOLARE</div>
              <h3 className={styles.planName}>Professional</h3>
              <p className={styles.solutionDesc}>Per chi vuole offrire un'esperienza impeccabile.</p>
              <ul className={styles.planFeatures}>
                <li><strong>Tutto incluso nel Start</strong></li>
                <li>Piatti e Categorie Illimitati</li>
                <li>Foto Piatti in Alta Definizione</li>
                <li>Allergeni e Filtri Avanzati</li>
                <li>Supporto Prioritario WhatsApp</li>
              </ul>
              <Link href="/contact?plan=Professional" className={styles.primaryBtn} style={{ textAlign: 'center', boxShadow: 'none' }}>Parla con un Esperto</Link>
            </div>

            {/* Website / Agency Plan */}
            <div className={`${styles.pricingCard} ${styles.agencyCard}`}>
              <div className={styles.badge} style={{ backgroundColor: '#e2b13c', color: '#000' }}>COMPLETO</div>
              <h3 className={styles.planName}>Enterprise</h3>
              <p className={styles.solutionDesc} style={{ color: '#ccc' }}>L'ecosistema digitale per il tuo brand.</p>
              <ul className={styles.planFeatures}>
                <li><strong>Menu Professional Incluso</strong></li>
                <li>Sito Web Design Personalizzato</li>
                <li>Sistema di Prenotazione Tavoli</li>
                <li>Dominio (es. .it) e Hosting</li>
                <li>Indicizzazione Google (SEO)</li>
                <li>Consulenza Marketing Dedicata</li>
              </ul>
              <Link href="/contact?plan=Enterprise" className={styles.primaryBtn} style={{ backgroundColor: '#e2b13c', color: '#000', border: 'none', textAlign: 'center' }}>Richiedi Consulenza</Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
