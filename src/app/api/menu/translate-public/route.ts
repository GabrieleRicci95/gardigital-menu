import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { menuId, targetLanguage } = await request.json();

        if (!menuId || !targetLanguage) {
            return NextResponse.json({ error: 'Menu ID and target language are required' }, { status: 400 });
        }

        // 1. Fetch the menu with categories and items in Italian
        const menu = await prisma.menu.findUnique({
            where: { id: menuId },
            include: {
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

        const categoriesToTranslate = menu.categories.filter(cat => cat.translations.length === 0);

        // Items also need checking for translations
        const allItems = menu.categories.flatMap(cat => cat.items);
        const itemIds = allItems.map(i => i.id);

        const existingItemTranslations = await prisma.menuItemTranslation.findMany({
            where: {
                menuItemId: { in: itemIds },
                language: targetLanguage
            }
        });

        const translatedItemIds = new Set(existingItemTranslations.map(t => t.menuItemId));
        const itemsToTranslate = allItems.filter(item => !translatedItemIds.has(item.id));

        if (categoriesToTranslate.length === 0 && itemsToTranslate.length === 0) {
            return NextResponse.json({ message: 'Already translated' });
        }

        // 2. Prepare content for AI
        const contentForAi = {
            categories: categoriesToTranslate.map(cat => ({ id: cat.id, name: cat.name })),
            items: itemsToTranslate.map(item => ({ id: item.id, name: item.name, description: item.description }))
        };

        const prompt = `Translate the following restaurant menu content from Italian to ${targetLanguage}.
        Return ONLY a JSON object with the following structure:
        {
          "categories": [ { "id": "...", "name": "..." } ],
          "items": [ { "id": "...", "name": "...", "description": "..." } ]
        }
        
        Content:
        ${JSON.stringify(contentForAi)}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional restaurant menu translator." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const translated = JSON.parse(response.choices[0].message.content || '{}');

        // 3. Save translations to DB
        await prisma.$transaction([
            // Categories
            ...(translated.categories || []).map((t: any) =>
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
            ...(translated.items || []).map((t: any) =>
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
        console.error('Translation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
