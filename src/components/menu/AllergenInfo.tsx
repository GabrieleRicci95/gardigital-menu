import styles from './AllergenInfo.module.css';

const ALLERGENS_DATA: Record<string, { name: string; icon: string }[]> = {
    it: [
        { name: 'Glutine', icon: '🌾' },
        { name: 'Crostacei', icon: '🦞' },
        { name: 'Uova', icon: '🥚' },
        { name: 'Pesce', icon: '🐟' },
        { name: 'Arachidi', icon: '🥜' },
        { name: 'Soia', icon: '🫘' },
        { name: 'Latte', icon: '🥛' },
        { name: 'Frutta a Guscio', icon: '🌰' },
        { name: 'Sedano', icon: '🥬' },
        { name: 'Senape', icon: '🧴' },
        { name: 'Sesamo', icon: '🌱' },
        { name: 'Lupini', icon: '🧆' },
        { name: 'Molluschi', icon: '🐚' },
        { name: 'Anidride Solforosa', icon: '🧪' },
    ],
    en: [
        { name: 'Gluten', icon: '🌾' },
        { name: 'Crustaceans', icon: '🦞' },
        { name: 'Eggs', icon: '🥚' },
        { name: 'Fish', icon: '🐟' },
        { name: 'Peanuts', icon: '🥜' },
        { name: 'Soybeans', icon: '🫘' },
        { name: 'Milk', icon: '🥛' },
        { name: 'Nuts', icon: '🌰' },
        { name: 'Celery', icon: '🥬' },
        { name: 'Mustard', icon: '🧴' },
        { name: 'Sesame', icon: '🌱' },
        { name: 'Lupins', icon: '🧆' },
        { name: 'Molluscs', icon: '🐚' },
        { name: 'Sulphur Dioxide', icon: '🧪' },
    ],
    fr: [
        { name: 'Gluten', icon: '🌾' },
        { name: 'Crustacés', icon: '🦞' },
        { name: 'Œufs', icon: '🥚' },
        { name: 'Poisson', icon: '🐟' },
        { name: 'Arachides', icon: '🥜' },
        { name: 'Soja', icon: '🫘' },
        { name: 'Lait', icon: '🥛' },
        { name: 'Fruits à coque', icon: '🌰' },
        { name: 'Céleri', icon: '🥬' },
        { name: 'Moutarde', icon: '🧴' },
        { name: 'Sésame', icon: '🌱' },
        { name: 'Lupin', icon: '🧆' },
        { name: 'Mollusques', icon: '🐚' },
        { name: 'Anhydride sulfureux', icon: '🧪' },
    ],
    de: [
        { name: 'Gluten', icon: '🌾' },
        { name: 'Krebstiere', icon: '🦞' },
        { name: 'Eier', icon: '🥚' },
        { name: 'Fisch', icon: '🐟' },
        { name: 'Erdnüsse', icon: '🥜' },
        { name: 'Soja', icon: '🫘' },
        { name: 'Milch', icon: '🥛' },
        { name: 'Schalenfrüchte', icon: '🌰' },
        { name: 'Sellerie', icon: '🥬' },
        { name: 'Senf', icon: '🧴' },
        { name: 'Sesam', icon: '🌱' },
        { name: 'Lupinen', icon: '🧆' },
        { name: 'Weichtiere', icon: '🐚' },
        { name: 'Schwefeldioxid', icon: '🧪' },
    ]
};

const UI_TEXT = {
    it: {
        warning: "SE SEI UN SOGGETTO ALLERGICO, AVVISA IL PERSONALE, CHE SAPRA' INDICARTI LA PRESENZA O MENO NEI NOSTRI PRODOTTI DEGLI INGREDIENTI CONSIDERATI ALLERGENI DALLA NORMATIVA EUROPEA",
        footer1: "*Alcuni prodotti freschi di origine animale, così come i prodotti della pesca somministrati crudi, vengono sottoposti ad abbattimento rapido di temperatura per garantire la qualità e la sicurezza, come descritto nel Piano HACCP ai sensi del Reg. CE 852/04 e Reg. CE 853/04.",
        footer2: "*In merito alla qualità / natura (fresco, congelato, conservato, surgelato) dei prodotti successivamente elaborati in cucina, ci è impossibile trascrivere la qualità/natura accanto ad ogni singola voce del menù poichè essa dipende esclusivamente dall'offerta quotidiana del mercato. Comunque la direzione rimane a Vs completa disposizione per eventuali chiarimenti."
    },
    en: {
        warning: "IF YOU HAVE ANY ALLERGIES, PLEASE INFORM OUR STAFF, WHO WILL BE ABLE TO ADVISE YOU ON THE PRESENCE OF ALLERGENS IN OUR PRODUCTS ACCORDING TO EUROPEAN REGULATIONS",
        footer1: "*Some fresh products of animal origin, as well as fishery products served raw, undergo rapid temperature blast chilling to ensure quality and safety, as described in the HACCP Plan pursuant to Reg. CE 852/04 and Reg. CE 853/04.",
        footer2: "*Regarding the quality/nature (fresh, frozen, preserved, deep-frozen) of products subsequently processed in the kitchen, it is impossible for us to list the quality/nature next to each single menu item because it depends exclusively on the daily market availability. However, the management remains at your complete disposal for any clarifications."
    },
    fr: {
        warning: "SI VOUS AVEZ DES ALLERGIES, VEUILLEZ EN INFORMER NOTRE PERSONNEL, QUI POURRA VOUS CONSEILLER SUR LA PRÉSENCE D'ALLERGÈNES DANS NOS PRODUITS CONFORMÉMENT AUX RÉGLEMENTATIONS EUROPÉENNES",
        footer1: "*Certains produits frais d'origine animale, ainsi que les produits de la pêche servis crus, subissent un refroidissement rapide par air pulsé pour garantir la qualité et la sécurité, comme décrit dans le plan HACCP conformément aux Reg. CE 852/04 et Reg. CE 853/04.",
        footer2: "*En ce qui concerne la qualité/nature (frais, congelé, conservé, surgelé) des produits transformés ultérieurement en cuisine, il nous est impossible d'indiquer la qualité/nature à côté de chaque article du menu car cela dépend exclusivement de la disponibilité quotidienne du marché. Cependant, la direction reste à votre entière disposition per tout complément d'information."
    },
    de: {
        warning: "WENN SIE ALLERGIEN HABEN, INFORMIEREN SIE BITTE UNSER PERSONAL, DAS SIE ÜBER DAS VORHANDENSEIN VON ALLERGENEN IN UNSEREN PRODUKTEN GEMÄSS DEN EUROPÄISCHEN VORSCHRIFTEN BERATEN KANN",
        footer1: "*Einige frische Produkte tierischen Ursprungs sowie roh servierte Fischereierzeugnisse werden einer Schnellabkühlung unterzogen, um Qualität und Sicherheit zu gewährleisten, wie im HACCP-Plan gemäß Reg. CE 852/04 und Reg. CE 853/04 beschrieben.",
        footer2: "*Hinsichtlich der Qualität/Natur (frisch, gefroren, konserviert, tiefgefroren) der anschließend in der Küche verarbeiteten Produkte ist es uns unmöglich, die Qualität/Natur neben jedem einzelnen Menüpunkt anzugeben, da sie ausschließlich von der täglichen Marktverfügbarkeit abhängt. Die Geschäftsleitung steht Ihnen jedoch für weitere Informationen gerne zur Verfügung."
    }
};

export default function AllergenInfo({ language = 'it' }: { language?: string }) {
    const lang = (ALLERGENS_DATA[language] ? language : 'it') as keyof typeof ALLERGENS_DATA;
    const allergens = ALLERGENS_DATA[lang];
    const texts = UI_TEXT[lang as keyof typeof UI_TEXT];

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {allergens.map((allergen, index) => (
                    <div key={index + 1} className={styles.item}>
                        <div className={styles.iconCircle}>
                            <span role="img" aria-label={allergen.name} style={{ fontSize: '1.8rem' }}>
                                {allergen.icon}
                            </span>
                        </div>
                        <span className={styles.label}>{index + 1} - {allergen.name}</span>
                    </div>
                ))}
            </div>

            <div className={styles.warningBox}>
                {texts.warning}
            </div>

            <p className={styles.footerText}>
                {texts.footer1}
            </p>

            <p className={styles.footerText}>
                {texts.footer2}
            </p>
        </div>
    );
}
