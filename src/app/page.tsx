'use client';

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
  Check
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="SoloMenu" className={styles.logoImg} />
        </div>
        <nav className={styles.nav}>
          <Link href="/register" className={styles.navBtnPrimary}>Registrati</Link>
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
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6667 14.6667V17.3333C26.6667 20.2667 24.2667 22.6667 21.3333 22.6667H10.6667C7.73333 22.6667 5.33333 20.2667 5.33333 17.3333V9.33333C5.33333 6.4 7.73333 4 10.6667 4H21.3333C24.2667 4 26.6667 6.4 26.6667 9.33333V10.6667" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11.3333C12.7364 11.3333 13.3333 10.7364 13.3333 10C13.3333 9.26362 12.7364 8.66666 12 8.66666C11.2636 8.66666 10.6667 9.26362 10.6667 10C10.6667 10.7364 11.2636 11.3333 12 11.3333Z" fill="#d4af37"/>
                    <path d="M20 11.3333C20.7364 11.3333 21.3333 10.7364 21.3333 10C21.3333 9.26362 20.7364 8.66666 20 8.66666C19.2636 8.66666 18.6667 9.26362 18.6667 10C18.6667 10.7364 19.2636 11.3333 20 11.3333Z" fill="#d4af37"/>
                    <path d="M12 17.3333C12 17.3333 13.3333 19.3333 16 19.3333C18.6667 19.3333 20 17.3333 20 17.3333" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className={styles.storeInfo}>
                    <span className={styles.storeSmall}>Disponibile su</span>
                    <span className={styles.storeLarge}>App Store</span>
                  </div>
                </Link>

                <Link href="#" className={styles.storeBtn}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.6667 2.66666H9.33333C5.65144 2.66666 2.66666 5.65144 2.66666 9.33333V22.6667C2.66666 26.3485 5.65144 29.3333 9.33333 29.3333H22.6667C26.3485 29.3333 29.3333 26.3485 29.3333 22.6667V9.33333C29.3333 5.65144 26.3485 2.66666 22.6667 2.66666Z" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 8V24" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 16H24" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className={styles.storeInfo}>
                    <span className={styles.storeSmall}>Disponibile su</span>
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



        {/* --- PRICING --- */}
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
      </main>

      <Footer />
    </div>
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
