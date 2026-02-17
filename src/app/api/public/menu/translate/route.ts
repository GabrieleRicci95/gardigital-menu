import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';
import * as deepl from 'deepl-node';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const session = await getSession();
    if (session && isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const apiKey = process.env.DEEPL_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'DeepL API Key non configurata nel server.' }, { status: 500 });
        }

        const translator = new deepl.Translator(apiKey);
        const { menuId, targetLanguage } = await request.json();

        if (!menuId || !targetLanguage) {
            return NextResponse.json({ error: 'Menu ID and target language are required' }, { status: 400 });
        }

        // Map language codes to DeepL expected format
        const langMap: Record<string, deepl.TargetLanguageCode> = {
            'it': 'it',
            'en': 'en-GB',
            'fr': 'fr',
            'de': 'de',
        };

        const targetLangCode = langMap[targetLanguage] || (targetLanguage as any);

        // 1. Fetch the menu with categories and items AND restaurant in Italian
        const menu = await prisma.menu.findUnique({
            where: { id: menuId },
            include: {
                restaurant: {
                    include: {
                        translations: {
                            where: { language: targetLanguage }
                        }
                    }
                },
                categories: {
                    include: {
                        items: true,
                        translations: {
                            where: { language: targetLanguage }
                        }
                    }
                }
            }
        });

        if (!menu) {
            return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
        }

        const restaurant = (menu as any).restaurant;

        // CHECK SUBSCRIPTION
        const subscription = await prisma.subscription.findUnique({
            where: { restaurantId: restaurant.id }
        });

        if (!subscription || (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIAL') || !subscription.hasTranslations) {
            return NextResponse.json({ error: 'Feature "Translations" not active for this restaurant.' }, { status: 403 });
        }

        // --- BATCH COLLECTION START ---
        const textsToTranslate: string[] = [];
        const translationMap: { type: 'restaurant_desc' | 'cat_name' | 'item_name' | 'item_desc', id: string }[] = [];

        // Restaurant Description
        let restaurantDescriptionTranslation = null;
        if (restaurant.description) {
            const existingTrans = restaurant.translations?.[0];
            if (!existingTrans || existingTrans.description === restaurant.description) {
                textsToTranslate.push(restaurant.description);
                translationMap.push({ type: 'restaurant_desc', id: restaurant.id });
            }
        }

        // Filtering logic for categories
        const categories = (menu as any).categories || [];
        const categoriesToTranslate = categories.filter((cat: any) =>
            !cat.translations || cat.translations.length === 0 ||
            cat.translations[0].name.startsWith(`[${targetLanguage.toUpperCase()}]`) ||
            cat.translations[0].name === cat.name
        );

        for (const cat of categoriesToTranslate) {
            textsToTranslate.push(cat.name);
            translationMap.push({ type: 'cat_name', id: cat.id });
        }

        // Filtering logic for items
        const allItems: any[] = categories.flatMap((cat: any) => cat.items || []);
        const itemIds = allItems.map(i => i.id);

        const existingItemTranslations = await prisma.menuItemTranslation.findMany({
            where: {
                menuItemId: { in: itemIds },
                language: targetLanguage
            }
        });

        const translatedItemIds = new Set(existingItemTranslations
            .filter(t => !t.name.startsWith(`[${targetLanguage.toUpperCase()}]`) && t.name !== allItems.find(i => i.id === t.menuItemId)?.name)
            .map(t => t.menuItemId)
        );
        const itemsToTranslate = allItems.filter(item => !translatedItemIds.has(item.id));

        for (const item of itemsToTranslate) {
            textsToTranslate.push(item.name);
            translationMap.push({ type: 'item_name', id: item.id });

            if (item.description) {
                textsToTranslate.push(item.description);
                translationMap.push({ type: 'item_desc', id: item.id });
            }
        }

        if (textsToTranslate.length === 0) {
            return NextResponse.json({ message: 'Already translated' });
        }

        // --- BATCH TRANSLATION EXECUTION (Chunked) ---
        const translatedTexts: string[] = [];
        const chunkSize = 50; // DeepL limit is 50 texts per request

        const chunkArray = (array: string[], size: number) => {
            const chunked = [];
            let index = 0;
            while (index < array.length) {
                chunked.push(array.slice(index, size + index));
                index += size;
            }
            return chunked;
        };

        const chunks = chunkArray(textsToTranslate, chunkSize);

        for (const chunk of chunks) {
            const results = await translator.translateText(chunk, 'it' as any, targetLangCode);
            // Since chunk is string[], results is guaranteed to be TextResult[]
            const resultArray = results as deepl.TextResult[];
            translatedTexts.push(...resultArray.map(r => r.text));
        }

        // --- PROCESS RESULTS ---
        const catResults = new Map<string, string>();
        const itemResults = new Map<string, { name: string, description: string | null }>();

        translationMap.forEach((meta, index) => {
            const text = translatedTexts[index];
            if (meta.type === 'restaurant_desc') {
                restaurantDescriptionTranslation = text;
            } else if (meta.type === 'cat_name') {
                catResults.set(meta.id, text);
            } else if (meta.type === 'item_name') {
                const existing = itemResults.get(meta.id) || { name: '', description: null };
                existing.name = text;
                itemResults.set(meta.id, existing);
            } else if (meta.type === 'item_desc') {
                const existing = itemResults.get(meta.id) || { name: '', description: null };
                existing.description = text;
                itemResults.set(meta.id, existing);
            }
        });

        // --- DB UPDATE ---
        const transactionOperations = [];

        // 1. Restaurant
        if (restaurantDescriptionTranslation) {
            transactionOperations.push(
                (prisma as any).restaurantTranslation.upsert({
                    where: {
                        restaurantId_language: {
                            restaurantId: restaurant.id,
                            language: targetLanguage
                        }
                    },
                    update: { description: restaurantDescriptionTranslation },
                    create: {
                        restaurantId: restaurant.id,
                        language: targetLanguage,
                        description: restaurantDescriptionTranslation
                    }
                })
            );
        }

        // 2. Categories
        for (const [id, name] of catResults.entries()) {
            transactionOperations.push(
                prisma.categoryTranslation.upsert({
                    where: {
                        categoryId_language: {
                            categoryId: id,
                            language: targetLanguage
                        }
                    },
                    update: { name: name },
                    create: {
                        categoryId: id,
                        language: targetLanguage,
                        name: name
                    }
                })
            );
        }

        // 3. Items
        for (const [id, data] of itemResults.entries()) {
            if (data.name) {
                transactionOperations.push(
                    prisma.menuItemTranslation.upsert({
                        where: {
                            menuItemId_language: {
                                menuItemId: id,
                                language: targetLanguage
                            }
                        },
                        update: { name: data.name, description: data.description },
                        create: {
                            menuItemId: id,
                            language: targetLanguage,
                            name: data.name,
                            description: data.description
                        }
                    })
                );
            }
        }

        if (transactionOperations.length > 0) {
            await prisma.$transaction(transactionOperations);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('DeepL Translation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
