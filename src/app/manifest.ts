import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Gardigital Menu',
        short_name: 'Gardigital',
        description: 'Il menu digitale premium per il tuo ristorante.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a1a1a',
        icons: [
            {
                src: '/logo_v2.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/logo_v2.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo_v2.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
