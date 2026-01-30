import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as deepl from 'deepl-node';

export async function POST(request: Request) {
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

        // Check if restaurant description needs translation
        let restaurantDescriptionTranslation = null;
        if (restaurant.description) {
            const existingTrans = restaurant.translations?.[0];
            if (!existingTrans || existingTrans.description === restaurant.description) {
                const res = await translator.translateText(restaurant.description, 'it' as any, targetLangCode);
                restaurantDescriptionTranslation = res.text;
            }
        }

        // Filtering logic for categories: include placeholders or missing translations
        const categories = (menu as any).categories || [];
        const categoriesToTranslate = categories.filter((cat: any) =>
            !cat.translations || cat.translations.length === 0 ||
            cat.translations[0].name.startsWith(`[${targetLanguage.toUpperCase()}]`) ||
            cat.translations[0].name === cat.name
        );

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

        if (categoriesToTranslate.length === 0 && itemsToTranslate.length === 0 && !restaurantDescriptionTranslation) {
            return NextResponse.json({ message: 'Already translated' });
        }

        // 2. Translate Categories
        const catTranslations = [];
        for (const cat of categoriesToTranslate) {
            const result = await translator.translateText(cat.name, 'it' as any, targetLangCode);
            catTranslations.push({ id: cat.id, name: result.text });
        }

        // 3. Translate Items
        const itemTranslations = [];
        for (const item of itemsToTranslate) {
            const nameResult = await translator.translateText(item.name, 'it' as any, targetLangCode);
            let descResult = null;
            if (item.description) {
                const res = await translator.translateText(item.description, 'it' as any, targetLangCode);
                descResult = res.text;
            }
            itemTranslations.push({ id: item.id, name: nameResult.text, description: descResult });
        }

        // 4. Save translations to DB
        await prisma.$transaction([
            // Restaurant Description
            ...(restaurantDescriptionTranslation ? [
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
            ] : []),
            // Categories
            ...catTranslations.map((t) =>
                prisma.categoryTranslation.upsert({
                    where: {
                        categoryId_language: {
                            categoryId: t.id,
                            language: targetLanguage
                        }
                    },
                    update: { name: t.name },
                    create: {
                        categoryId: t.id,
                        language: targetLanguage,
                        name: t.name
                    }
                })
            ),
            // Items
            ...itemTranslations.map((t) =>
                prisma.menuItemTranslation.upsert({
                    where: {
                        menuItemId_language: {
                            menuItemId: t.id,
                            language: targetLanguage
                        }
                    },
                    update: { name: t.name, description: t.description },
                    create: {
                        menuItemId: t.id,
                        language: targetLanguage,
                        name: t.name,
                        description: t.description
                    }
                })
            )
        ]);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('DeepL Translation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
