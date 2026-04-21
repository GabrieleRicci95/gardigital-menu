'use client';

import { useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  GlassWater,
  Waves,
  Hotel,
  ChevronRight,
  Globe,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Check,
  ChevronDown
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ua = navigator.userAgent || '';
      const hasParam = params.get('platform') === 'app';
      const hasSession = sessionStorage.getItem('isAppMode') === 'true';
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isCapacitorNative = (window as any).Capacitor?.isNativePlatform?.() === true;
      
      if (hasParam || hasSession || isIOS || isCapacitorNative) {
        setIsAppMode(true);
        sessionStorage.setItem('isAppMode', 'true');
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="SoloMenu" className={styles.logoImg} />
        </div>
        <nav className={styles.nav}>
          {!isAppMode && <Link href="/register" className={styles.navBtnPrimary}>Registrati</Link>}
          <Link href="/login" className={styles.navBtn}>Area Clienti</Link>
        </nav>
      </header>

      <main>
        {/* --- HERO SECTION --- */}
        <section className={styles.hero}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Sparkles size={14} /> Menu Digitale Professionale
            </motion.div>

            <h1 className={styles.heroTitle}>
              Il Menu Digitale.<br />
              <span className={styles.highlight}>Semplice e Moderno.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Crea il tuo menu in pochi minuti. Elegante, veloce e pronto per i tuoi clienti su ogni dispositivo.
            </p>

            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.mainBtn}>
                Contattaci per informazioni <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* --- APP SHOWCASE --- */}
        <section className={styles.appSection}>
          <div className={styles.appGrid}>
            <motion.div 
              className={styles.appVisual}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.appCircle} />
              <img src="/assets/app-mockup.png" alt="SoloMenu App Mockup" className={styles.appImage} />
            </motion.div>

            <motion.div 
              className={styles.appInfo}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className={styles.heroBadge}
                style={{ marginBottom: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.3)' }}
              >
                <Smartphone size={14} /> SoloMenu Mobile
              </motion.div>
              <h2>L&apos;Evoluzione del <span className={styles.highlight}>Tuo Lavoro.</span></h2>
              <p>
                Gestisci il tuo ristorante ovunque tu sia. La nostra applicazione nativa ti permette di aggiornare piatti, prezzi e disponibilità in tempo reale direttamente dal tuo smartphone.
              </p>
              
              <div className={styles.storeButtons}>
                <Link href="#" className={styles.storeBtn}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.5 12.5C25.5 8.9 28.5 6.9 28.6 6.8C26.9 4.3 24.3 4 23.4 4C21.1 3.8 18.9 5.4 17.7 5.4C16.5 5.4 14.8 4.1 12.9 4.1C10.4 4.1 8 5.6 6.7 7.9C4.1 12.5 6 19.3 8.5 22.9C9.7 24.7 11.2 26.7 13.1 26.6C15 26.5 15.7 25.4 17.9 25.4C20.2 25.4 20.8 26.6 22.8 26.5C24.8 26.4 26.1 24.7 27.4 22.8C28.8 20.7 29.4 18.7 29.4 18.6C29.4 18.6 25.5 17.1 25.5 12.5ZM21.1 8.2C22.1 7 22.8 5.3 22.6 3.7C20.9 3.8 19.1 4.7 18 5.9C17 7 16.2 8.7 16.4 10.3C18 10.4 19.7 9.5 21.1 8.2Z" fill="#d4af37"/>
                  </svg>
                  <div className={styles.storeInfo}>
                    <span className={styles.storeSmall}>Download on the</span>
                    <span className={styles.storeLarge}>App Store</span>
                  </div>
                </Link>

                <Link href="#" className={styles.storeBtn}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.3C5.2 3.6 5 4.1 5 4.8V27.2C5 27.9 5.2 28.4 5.5 28.7L5.6 28.8L18.4 16.1V15.9L5.6 3.2L5.5 3.3Z" fill="#d4af37" fillOpacity="0.8"/>
                    <path d="M22.7 20.4L18.4 16.1V15.9L22.7 11.6L22.8 11.7L28 14.6C29.4 15.4 29.4 16.6 28 17.4L22.8 20.3L22.7 20.4Z" fill="#d4af37"/>
                    <path d="M22.8 20.4L18.4 16.1L5.5 29L6.5 29.1C7.5 29.1 8.4 28.6 9 28.2L22.8 20.4Z" fill="#d4af37" fillOpacity="0.6"/>
                    <path d="M22.8 11.6L9 3.8C8.4 3.4 7.5 2.9 6.5 2.9L5.5 3L18.4 15.9L22.8 11.6Z" fill="#d4af37" fillOpacity="0.9"/>
                  </svg>
                  <div className={styles.storeInfo}>
                    <span className={styles.storeSmall}>GET IT ON</span>
                    <span className={styles.storeLarge}>Google Play</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>


        {/* --- STATS --- */}
        <section className={styles.stats}>
          <div className={styles.statsGrid}>
            <StatItem value="+28%" label="Più Vendite" />
            <StatItem value="300ms" label="Velocità" />
            <StatItem value="100%" label="Intuitivo" />
          </div>
        </section>

        {/* --- NICHE SELECTOR --- */}
        <section id="solutions" className={styles.nicheSelector}>
          <div className={styles.sectionHeader}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Soluzioni<br /><span className={styles.highlight}>Digitali per</span></h2>
            </motion.div>
          </div>

          <div className={styles.nicheGrid}>
            <NicheCard
              href="/ristoranti"
              title="Ristorazione"
              description="Visualizzazione immersiva della tua cucina. Ordini fluidi e gestione in tempo reale."
              image="/assets/menu-hero.png"
              icon={<UtensilsCrossed size={20} />}
            />
            <NicheCard
              href="/cocktail-bar"
              title="Cocktail & Bar"
              description="L&apos;atmosfera notturna incontra il minimalismo digitale. Modalità scura inclusa."
              image="/assets/menu-cocktail.png"
              icon={<GlassWater size={20} />}
            />
            <NicheCard
              href="/beach-club"
              title="Spiaggia e Relax"
              description="Prestazioni perfette sotto il sole. Tecnologia progettata per stabilimenti balneari."
              image="/assets/menu-beach.png"
              icon={<Waves size={20} />}
            />
            <NicheCard
              href="/hotel-room-service"
              title="Hotel e Resort"
              description="L&apos;eccellenza del servizio in camera, elevata da un&apos;interfaccia a 5 stelle."
              image="/assets/hotel-room-service.png"
              icon={<Hotel size={20} />}
            />
          </div>
        </section>

        {/* --- FEATURES BENTO --- */}
        <section className={styles.featuresBento}>
          <div className={styles.bentoGrid}>
            <BentoItem
              icon={<Globe size={32} />}
              title="Traduzioni AI"
              description="Traduzioni istantanee basate su reti neurali. Localizzazione perfetta per ospiti internazionali in tempo reale."
            />
            <BentoItem
              icon={<Zap size={32} />}
              title="Super Velocità"
              description="Caricamenti istantanei. Il software menu più veloce mai ingegnerizzato."
            />
            <BentoItem
              icon={<Smartphone size={32} />}
              title="Uso da Mobile"
              description="Interfaccia progettata esclusivamente per l&apos;uso con una mano. Fluidità assoluta."
            />
            <BentoItem
              icon={<TrendingUp size={32} />}
              title="Dati e Statistiche"
              description="Analisi avanzata delle preferenze. Prevedi i trend del tuo locale prima ancora che accadano."
            />
          </div>
        </section>



        {/* --- CONCIERGE ASSISTANCE --- */}
        <section className={styles.conciergeSection}>
          <motion.div 
            className={styles.conciergeContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className={styles.conciergeIcon}>
              <Smartphone size={40} />
            </div>
            <h2>Zero Pensieri.<br /><span className={styles.highlight}>Lo carichiamo noi.</span></h2>
            <p>
              Temi la tecnologia o semplicemente non hai tempo? Nessun problema. 
              <strong> Mandaci una foto o il PDF del tuo menù su WhatsApp.</strong> Lo caricheremo noi per te nel sistema, pronto per essere utilizzato, in meno di 24 ore.
            </p>
            <a 
              href="https://wa.me/393278278278?text=Ciao%20Gabriele,%20vorrei%20attivare%20SoloMenu%20ma%20avrei%20bisogno%20di%20aiuto%20per%20caricare%20il%20mio%20menù." 
              target="_blank" 
              className={styles.conciergeBtn}
            >
              Aiutami a caricare il menù
            </a>
          </motion.div>
        </section>

        {/* --- PRICING --- */}
        {!isAppMode && (
          <section id="pricing" className={styles.pricing}>
            <div className={styles.sectionHeader}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2>Scegli il tuo <span className={styles.highlight}>Piano</span></h2>
                <p className={styles.sectionSubtitle}>Soluzioni flessibili per ogni tipo di attività, dal piccolo bar al grande ristorante.</p>
              </motion.div>
            </div>

            <div className={styles.pricingGrid}>
              <PricingCard 
                name="Menu" 
                price="15" 
                description="Il tuo menu digitale professionale."
                features={[
                  "Menu Digitale Premium",
                  "QR Code Personalizzato",
                  "Piatti e Categorie Illimitati",
                  "Gestione Foto & Prezzi",
                  "Supporto WhatsApp"
                ]}
                planKey="Menu"
              />
              <PricingCard 
                name="Traduzioni" 
                price="10" 
                description="Rendi il tuo menu internazionale."
                features={[
                  "Traduzioni AI Istantanee",
                  "Aggiornamento automatico",
                  "Indispensabile per Turisti"
                ]}
                planKey="Traduzioni"
              />
              <PricingCard 
                name="Agenda Digitale" 
                price="10" 
                description="Ricevi prenotazioni direttamente."
                features={[
                  "Prenotazioni via WhatsApp",
                  "Tasto 'Prenota Tavolo' Live",
                  "Gestione Agenda Dashboard",
                  "Conferma rapida al cliente",
                  "Link diretto Google",
                  "Aumenta i tuoi Coperti"
                ]}
                planKey="Agenda"
              />
              <PricingCard 
                name="Full Pack" 
                price="29,99" 
                oldPrice="35"
                description="Il pacchetto completo ad un prezzo speciale."
                features={[
                  "Menu Digitale Incluso",
                  "Modulo Traduzioni Incluso",
                  "Modulo Agenda Digitale Incluso",
                  "Tutte le Liste Speciali",
                  "Supporto Prioritario WhatsApp",
                  "Risparmio Imbattibile"
                ]}
                highlighted={true}
                planKey="OFFERTA-FULL"
              />
            </div>
          </section>
        )}

        {/* --- FAQ SECTION --- */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Come funziona la prova gratuita di 7 giorni?",
      a: "Puoi esplorare tutte le funzionalità di SoloMenu senza limitazioni. Dopo 7 giorni, potrai decidere se attivare l'abbonamento o meno. Non ci sono costi nascosti."
    },
    {
      q: "Posso disdire l'abbonamento in ogni momento?",
      a: "Assolutamente sì. Dalla tua dashboard puoi disattivare il rinnovo automatico con un solo click. Continuerai ad avere accesso ai servizi fino alla fine del periodo già pagato."
    },
    {
      q: "È necessario acquistare hardware specifico (tablet o simili)?",
      a: "No, SoloMenu è una web-app ottimizzata che funziona su qualsiasi smartphone, tablet o PC. Non hai bisogno di acquistare terminali dedicati."
    },
    {
      q: "Come vengono generati i QR Code per i tavoli?",
      a: "Una volta creato il menu, la dashboard genera automaticamente dei QR Code professionali in alta risoluzione che puoi scaricare, stampare e posizionare sui tuoi tavoli."
    },
    {
      q: "Il menu supporta le traduzioni in altre lingue?",
      a: "Sì, offriamo un modulo di traduzione basato su Intelligenza Artificiale che traduce istantaneamente i tuoi piatti e descrizioni per i tuoi clienti internazionali."
    }
  ];

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.faqHeader}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Domande <span className={styles.highlight}>Frequenti</span>
          </motion.h2>
          <p className={styles.sectionSubtitle}>Tutto quello che c&apos;è da sapere su SoloMenu</p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.q}
                <ChevronDown size={20} className={styles.faqIcon} />
              </button>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <motion.div
      className={styles.statItem}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h4>{value}</h4>
      <p>{label}</p>
    </motion.div>
  );
}

function NicheCard({ href, title, description, image, icon }: { href: string, title: string, description: string, image: string, icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Link href={href} className={styles.nicheCard}>
        <div className={styles.nicheImageContainer}>
          <img src={image} alt={title} className={styles.nicheImage} />
        </div>
        <div className={styles.nicheContent}>
          <div className={styles.bentoIcon} style={{ marginBottom: '1.5rem' }}>{icon}</div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function BentoItem({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) {
  return (
    <div className={`${styles.bentoItem} ${className}`}>
      <div className={styles.bentoIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function PricingCard({ name, price, oldPrice, description, features, highlighted, planKey }: { 
  name: string, 
  price: string, 
  oldPrice?: string,
  description: string, 
  features: string[], 
  highlighted?: boolean,
  planKey: string
}) {
  return (
    <motion.div
      className={`${styles.pricingCard} ${highlighted ? styles.highlightedCard : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {highlighted && <div className={styles.planBadge}>OFFERTA LIMITATA</div>}
      <h3 className={styles.planName}>{name}</h3>
      <div className={styles.planPrice}>
        {oldPrice && <span className={styles.oldPrice}>€{oldPrice}</span>}
        <span className={styles.currency}>€</span>{price}<span className={styles.period}>/mese</span>
      </div>
      <p className={styles.planDescription}>{description}</p>
      <ul className={styles.planFeatures}>
        {features.map((feature, i) => (
          <li key={i}><Check size={16} className={styles.checkIcon} /> {feature}</li>
        ))}
      </ul>
      <Link href={`/contact?plan=${planKey}`} className={highlighted ? styles.planBtnPrimary : styles.planBtn}>
        {highlighted ? 'Prendi l\'Offerta' : 'Scegli Piano'}
      </Link>
    </motion.div>
  );
}
