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

        <section className={styles.marketingSection} style={{ background: 'white', color: '#0d1b2a', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <div className={styles.marketingContent} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.marketingTextContent}>
              <h2 className={styles.marketingTitle} style={{ color: '#0d1b2a' }}>Il Tuo Ristorante Online: <br /><span className={styles.highlight}>Siti Web su Misura</span></h2>
              <p className={styles.marketingDesc} style={{ color: '#555' }}>
                Oltre al menu digitale, realizziamo siti web professionali ed eleganti, ottimizzati per convertire i visitatori in clienti.
                Un design esclusivo che riflette l'anima del tuo locale e ti posiziona sopra la concorrenza.
                <br /><br />
                Dominio personalizzato, velocità estrema e un'esperienza utente impeccabile su ogni dispositivo.
              </p>
              <Link href="/contact?plan=SitoWeb" className={styles.primaryBtn}>Richiedi il tuo Sito</Link>
            </div>
            <div className={styles.marketingVisual}>
              <div className={styles.marketingImageContainer} style={{ transform: 'perspective(1000px) rotateY(5deg)' }}>
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80" alt="Sito Web Ristorante" className={styles.marketingImage} />
              </div>
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

        <section id="pricing" className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Scegli il tuo Piano</h2>
          <p className={styles.sectionSubtitle}>Soluzioni flessibili per ogni tipo di attività, dal piccolo bar al grande ristorante.</p>

          <div className={styles.pricingGrid}>

            {/* Menu Card */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Menu</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: '#1a237e' }}>€15<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mese</span></div>
              <p className={styles.solutionDesc}>Il tuo menu digitale professionale.</p>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Premium</li>
                <li>QR Code Personalizzato</li>
                <li>Piatti e Categorie Illimitati</li>
                <li>Gestione Foto & Prezzi</li>
                <li>Supporto Email</li>
              </ul>
              <Link href="/contact?plan=Menu" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Richiedi Menu</Link>
            </div>

            {/* Traduzioni Card */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Traduzioni</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0', color: '#1a237e' }}>€10<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mese</span></div>
              <p className={styles.solutionDesc}>Rendi il tuo menu internazionale.</p>
              <ul className={styles.planFeatures}>
                <li>Traduzioni AI Istantanee</li>
                <li>Aggiornamento automatico</li>
                <li>Indispensabile per Turisti</li>
              </ul>
              <Link href="/contact?plan=Traduzioni" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Attiva Traduzioni</Link>
            </div>

            {/* Agenda Card */}
            <div className={styles.pricingCard}>
              <h3 className={styles.planName}>Agenda Digitale</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0', color: '#1a237e' }}>€10<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mese</span></div>
              <p className={styles.solutionDesc}>Ricevi prenotazioni direttamente.</p>
              <ul className={styles.planFeatures}>
                <li>Prenotazioni via WhatsApp</li>
                <li>Tasto "Prenota Tavolo" Live</li>
                <li>Gestione Agenda Dashboard</li>
                <li>Conferma rapida al cliente</li>
                <li>Aumenta i tuoi Coperti</li>
              </ul>
              <Link href="/contact?plan=Agenda" className={styles.secondaryBtn} style={{ background: '#f3f4f6', color: '#333', border: 'none', textAlign: 'center' }}>Attiva Agenda</Link>
            </div>

            {/* Offerta Card */}
            <div className={`${styles.pricingCard} ${styles.agencyCard}`}>
              <div className={styles.badge} style={{ backgroundColor: '#e2b13c', color: '#000' }}>OFFERTA LIMITATA</div>
              <h3 className={styles.planName}>Full Pack</h3>
              <div style={{ margin: '1rem 0' }}>
                <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: '#ccc', marginRight: '8px' }}>€35</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2b13c' }}>€25<span style={{ fontSize: '1rem', fontWeight: 400, color: '#ccc' }}>/mese</span></span>
              </div>
              <p className={styles.solutionDesc} style={{ color: '#ccc' }}>Il pacchetto completo ad un prezzo speciale.</p>
              <ul className={styles.planFeatures}>
                <li>Menu Digitale Incluso</li>
                <li>Modulo Traduzioni Incluso</li>
                <li>Modulo Agenda Digitale Incluso</li>
                <li>Tutte le Liste Speciali</li>
                <li>Supporto Prioritario WhatsApp</li>
                <li>Risparmio Imbattibile</li>
              </ul>
              <Link href="/contact?plan=OFFERTA-FULL" className={styles.primaryBtn} style={{ backgroundColor: '#e2b13c', color: '#000', border: 'none', textAlign: 'center' }}>Prendi l'Offerta</Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
