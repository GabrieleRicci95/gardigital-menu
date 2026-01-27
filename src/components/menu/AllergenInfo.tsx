import styles from './AllergenInfo.module.css';

const allergens = [
    { id: 1, name: 'Glutine', icon: '🌾' },
    { id: 2, name: 'Crostacei', icon: '🦞' },
    { id: 3, name: 'Uova', icon: '🥚' },
    { id: 4, name: 'Pesce', icon: '🐟' },
    { id: 5, name: 'Arachidi', icon: '🥜' },
    { id: 6, name: 'Soia', icon: '🫘' },
    { id: 7, name: 'Latte', icon: '🥛' },
    { id: 8, name: 'Frutta a Guscio', icon: '🌰' },
    { id: 9, name: 'Sedano', icon: '🥬' },
    { id: 10, name: 'Senape', icon: '🧴' },
    { id: 11, name: 'Sesamo', icon: '🌱' },
    { id: 12, name: 'Lupini', icon: '🧆' },
    { id: 13, name: 'Molluschi', icon: '🐚' },
    { id: 14, name: 'Anidride Solforosa', icon: '🧪' },
];

export default function AllergenInfo() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {allergens.map((allergen) => (
                    <div key={allergen.id} className={styles.item}>
                        <div className={styles.iconCircle}>
                            {/* Using Emoji as placeholder for icons */}
                            <span role="img" aria-label={allergen.name} style={{ fontSize: '1.8rem' }}>
                                {allergen.icon}
                            </span>
                        </div>
                        <span className={styles.label}>{allergen.id} - {allergen.name}</span>
                    </div>
                ))}
            </div>

            <div className={styles.warningBox}>
                SE SEI UN SOGGETTO ALLERGICO, AVVISA IL PERSONALE, CHE SAPRA' INDICARTI LA
                PRESENZA O MENO NEI NOSTRI PRODOTTI DEGLI INGREDIENTI CONSIDERATI ALLERGENI
                DALLA NORMATIVA EUROPEA
            </div>

            <p className={styles.footerText}>
                *Alcuni prodotti freschi di origine animale, così come i prodotti della
                pesca somministrati crudi, vengono sottoposti ad abbattimento rapido
                di temperatura per garantire la qualità e la sicurezza, come descritto nel
                Piano HACCP ai sensi del Reg. CE 852/04 e Reg. CE 853/04.
            </p>

            <p className={styles.footerText}>
                *In merito alla qualità / natura (fresco, congelato, conservato, surgelato) dei prodotti
                successivamente elaborati in cucina, ci è impossibile trascrivere la
                qualità/natura accanto ad ogni singola voce del menù poichè essa
                dipende esclusivamente dall'offerta quotidiana del mercato. Comunque la direzione rimane a Vs completa disposizione per eventuali
                chiarimenti.
            </p>
        </div>
    );
}
