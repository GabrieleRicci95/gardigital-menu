
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Polyfill DOMMatrix for pdfjs-dist (used by pdf-parse) in Node environment
if (typeof DOMMatrix === 'undefined') {
    class DOMMatrixPolyfill {
        a: number = 1;
        b: number = 0;
        c: number = 0;
        d: number = 1;
        e: number = 0;
        f: number = 0;

        constructor() { }
        setMatrixValue(str: string) { return this; }
        translate(x: number, y: number) { return this; }
        scale(x: number, y: number) { return this; }
        multiply(m: any) { return this; }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    }
    (global as any).DOMMatrix = DOMMatrixPolyfill;
}


// Use the main entry point which exports the PDFParse class
// The 'fake worker' error should be resolved by serverExternalPackages in next.config.ts
const pdfParseLib = require('pdf-parse');
const PDFParse = pdfParseLib.PDFParse || pdfParseLib.default || pdfParseLib;

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const menuName = formData.get('menuName') as string || 'Menu Importato (PDF)';

        if (!file) return NextResponse.json({ error: 'File richiesto' }, { status: 400 });

        // Convert File to Buffer/Uint8Array
        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        console.log('Starting PDF parsing...');
        // Parse PDF using v2 API from 'pdf-parse'

        const parser = new PDFParse({ data: buffer });
        console.log('Parser instantiated');
        const data = await parser.getText();
        console.log('Parsing complete, text length:', data.text?.length);
        let text = data.text;

        // --- Smart Decipher Logic ---
        const ITALIAN_DICT = new Set([
            "CON", "IL", "LO", "LA", "I", "GLI", "LE", "UN", "UNO", "UNA", "DI", "A", "DA", "IN", "SU", "PER", "TRA", "FRA",
            "ANTIPASTI", "PRIMI", "SECONDI", "CONTORNI", "DOLCI", "DESSERT", "VINI", "BEVANDE", "COCKTAIL", "PIZZE", "INSALATE",
            "BOTTIGLIE", "CHAMPAGNE", "ROSSE", "BIANCHE", "BIRRE", "DRINKS", "CAFFE", "AMARI", "LIQUORI", "GRAPPE", "WHISKY",
            "RUM", "GIN", "VODKA", "TEQUILA", "COGNAC", "BRANDY", "ACQUA", "BIBITE", "SUCCHI", "SPREMUTE", "CENTRIFUGATI",
            "ANTIPASTO", "PRIMO", "SECONDO", "CONTORNO", "DOLCE", "VINO", "PIZZA", "CARNE", "PESCE", "VERDURA", "FORMAGGIO",
            "FRUTTA", "INSALATA", "ZUPPA", "RISO", "PASTA", "SPAGHETTI", "PENNE", "RIGATONI", "FUSILLI", "GNOCCHI", "RAVIOLI",
            "TORTELLINI", "RISOTTO", "OSTRICHE", "GAMBERO", "GAMBERI", "SCAMPI", "CALAMARI", "COZZE", "VONGOLE", "BRANZINO",
            "ORATA", "SALMONE", "TONNO", "SPADA", "MANZO", "MAIALE", "POLLO", "VITELLO", "AGNELLO", "SALSICCIA", "WURSTEL",
            "PROSCIUTTO", "SALAME", "SPECK", "BRESAOLA", "PANCETTA", "GUANCIALE", "MOZZARELLA", "BURRATA", "STRACCIATELLA",
            "RICOTTA", "PARMIGIANO", "GRANA", "PECORINO", "GORGONZOLA", "FONTINA", "TALEGGIO", "POMODORO", "ZUCCHINE",
            "MELANZANE", "PEPERONI", "PATATE", "FUNGHI", "TARTUFO", "RUCOLA", "LATTUGA", "RADICCHIO", "CIPOLLA", "AGLIO",
            "OLIO", "ACETO", "SALE", "PEPE", "PEPERONCINO", "ORIGANO", "BASILICO", "PREZZEMOLO", "ROSMARINO", "SALVIA",
            "TIMO", "MENTA", "LIMONE", "ARANCIA", "FASOLARI", "CRUDO", "COTTO", "MARINATO", "AFFUMICATO", "GRIGLIA",
            "FORNO", "FRITTO", "BOLLITO", "VAPORE", "CRUDITÈ", "TARTARE", "CARPACCIO", "BISTECCA", "FILETTO", "TAGLIATA",
            "COSTATA", "FIORENTINA", "HAMBURGER", "CHEESEBURGER", "PANINO", "TOAST", "TRAMEZZINO", "PIADINA", "FOCACCIA",
            "BRUSCHETTA", "CROSTINI", "OLIVE", "PATATINE", "VERDURE", "GRIGLIATE", "MISTE", "IMPANATE", "PASTELLATE",
            "SORBETTO", "GELATO", "TIRAMISU", "PANNA", "COTTA", "CREMA", "CATALANA", "CHEESECAKE", "TORTA", "CROSTATA",
            "SEMIFREDDO", "PROFITEROLES", "ZUPPA", "INGLESE", "MEDITERRANEA", "CAPRESE", "CESAR", "GREEK", "NIZZARDA",
            "BUFALA", "DOP", "IGP", "DOC", "DOCG", "BIO", "VEGAN", "VEGANO", "VEGETARIANO", "SENZA", "GLUTINE", "ALLERGENI"
        ]);

        function shiftString(str: string, offset: number): string {
            return str.split('').map(char => {
                const code = char.charCodeAt(0);
                // Keep minimal separators/symbols
                if (code <= 32 || char === '.' || char === ',' || char === '€') return char;
                return String.fromCharCode(code + offset);
            }).join('');
        }

        function countVowels(str: string) {
            return (str.match(/[AEIOUaeiou]/g) || []).length;
        }

        function isBadChar(char: string) {
            // [ (91), \ (92), ] (93), ^ (94), _ (95), ` (96) are often shift artifacts of Uppercase
            // Non-ASCII or obscure symbols
            return /[\[\]\\^_`{|}~]/.test(char);
        }

        function scoreWord(word: string): number {
            let score = 0;
            const clean = word.replace(/[^a-zA-ZÀ-ÿ]/g, '').toUpperCase();
            if (clean.length < 2) return 0; // Skip short ambiguous

            if (ITALIAN_DICT.has(clean)) return 1000; // Jackpot

            // Penalties
            if (word.split('').some(isBadChar)) score -= 500;
            if (/[JKWXYjkwxy]/.test(clean)) score -= 50; // Rare in Italian

            // Bonuses
            if (countVowels(clean) > 0) score += 50;

            // Consonant clusters (e.g. 4+ consonants in a row is bad)
            if (/[B-DF-HJ-NP-TV-Z]{4,}/i.test(clean)) score -= 100;

            return score;
        }

        function decipherText(rawText: string): string {
            // Split by lines to preserve structure, then words
            return rawText.split('\n').map(line => {
                if (!line.trim()) return line;

                // Split preserving spaces? For simplicity split by space, decipher, join
                // But PDF might have weird spacing.
                const words = line.split(/(\s+)/); // Keep separators

                const decodedWords = words.map(word => {
                    if (!word.trim()) return word; // Separator
                    if (word.length < 2 && !word.match(/[a-zA-Z]/)) return word; // Symbols/Numbers

                    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                    if (cleanWord.length < 2) return word; // Too short to judge? Maybe.

                    // Candidates
                    const c1 = word; // Original
                    const c2 = shiftString(word, -1); // Shift All

                    // Shift Rest (First char kept, rest shifted)
                    // Be careful with punctuation at boundaries
                    const firstCharMatch = word.match(/^([^\w]*)([a-zA-Z])(.*)$/);
                    let c3 = word;
                    if (firstCharMatch) {
                        const [_, prefix, first, rest] = firstCharMatch;
                        c3 = prefix + first + shiftString(rest, -1);
                    }

                    const s1 = scoreWord(c1);
                    const s2 = scoreWord(c2);
                    const s3 = scoreWord(c3);

                    // Debug log for ambiguous cases
                    // if (word.length > 4 && Math.max(s1, s2, s3) < 100) console.log(`Ambiguous: ${word} -> ${c1}(${s1}) | ${c2}(${s2}) | ${c3}(${s3})`);

                    if (s2 > s1 && s2 > s3) return c2;
                    if (s3 > s1 && s3 > s2) return c3;
                    return c1;
                });

                return decodedWords.join('');
            }).join('\n');
        }

        text = decipherText(text);

        const menu = await prisma.menu.create({
            data: {
                name: menuName,
                restaurantId: session.restaurantId || (await prisma.restaurant.findFirst({ where: { ownerId: session.user.id } }))?.id!,
                isActive: false
            }
        });

        const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l);

        // Simple Heuristic Parser logic...
        let currentCategory: string | null = null;
        let categoryMap: Record<string, string> = {};
        let bufferItem = { name: '', description: '', price: 0 };

        const commonCats = ["ANTIPASTI", "PRIMI", "SECONDI", "CONTORNI", "DOLCI", "DESSERT", "VINI", "BEVANDE", "COCKTAIL", "PIZZE", "INSALATE", "BOTTIGLIE", "CHAMPAGNE", "ROSSE", "BIANCHE", "BIRRE", "DRINKS"];

        async function getCategory(name: string) {
            // name might need cleanup if regex failed to catch symbols
            const cleanName = name.replace(/[^\w\s&]/g, '').trim();
            if (categoryMap[cleanName]) return categoryMap[cleanName];
            const cat = await prisma.category.create({
                data: { name: cleanName, menuId: menu.id }
            });
            categoryMap[cleanName] = cat.id;
            return cat.id;
        }

        async function flushItem() {
            if (!bufferItem.name || !currentCategory) return;

            // Cleanup
            let name = bufferItem.name.replace(/\t/g, ' ').replace(/  +/g, ' ').trim();
            if (name.length < 2) return;

            // Fix for "PIZZ E" -> "PIZZE" if spacing is weird
            // Not applying aggressive regex replacement to avoid breaking valid names

            await prisma.menuItem.create({
                data: {
                    name: name,
                    description: bufferItem.description,
                    price: bufferItem.price,
                    categoryId: await getCategory(currentCategory),
                }
            });
            bufferItem = { name: '', description: '', price: 0 };
        }

        for (let line of lines) {
            const priceMatch = line.match(/(\d+[.,]?\d*)\s*(€|eur)?$/i) || line.match(/^(€|eur)\s*(\d+[.,]?\d*)/i);

            const isUpperCase = line === line.toUpperCase() && line.length > 3 && !priceMatch;
            const isCommonCat = commonCats.some(c => line.toUpperCase().includes(c));

            if ((isUpperCase || isCommonCat) && !priceMatch && line.length < 50) {
                await flushItem();
                currentCategory = line.replace(/[^\w\s&]/g, '').trim();
                continue;
            }

            if (priceMatch) {
                let pStr = priceMatch[1] || priceMatch[2];
                pStr = pStr.replace(',', '.');
                const price = parseFloat(pStr);
                let text = line.replace(priceMatch[0], '').trim();

                if (text.length > 2) {
                    await flushItem();
                    bufferItem.name = text;
                    bufferItem.price = price;
                    await flushItem();
                } else if (bufferItem.name) {
                    bufferItem.price = price;
                    await flushItem();
                }
            } else {
                if (!bufferItem.name) {
                    bufferItem.name = line;
                } else {
                    bufferItem.description += (bufferItem.description ? ' ' : '') + line;
                }
            }
        }
        await flushItem();

        return NextResponse.json({ success: true, menuId: menu.id });

    } catch (error) {
        console.error("Import PDF Error:", error);
        return NextResponse.json({
            error: 'Errore durante importazione: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 });
    }
}
