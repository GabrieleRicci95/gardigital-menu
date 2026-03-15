import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.gardigital.it'

    const routes: MetadataRoute.Sitemap = [
        '',
        '/chi-siamo',
        '/contact',
        '/login',
        '/cookies',
        '/privacy',
        '/terms'
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
