import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Block all crawlers from private/admin pages
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile',
          '/login',
          '/signup',
          '/join/tasks/',
        ],
      },
      {
        // Allow AI search crawlers for GEO visibility (ChatGPT, Claude, Perplexity)
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile', '/login', '/signup', '/join/tasks/'],
      },
      {
        // Block training-only crawlers (not search-facing)
        userAgent: ['CCBot', 'Bytespider', 'Google-Extended', 'anthropic-ai', 'cohere-ai'],
        disallow: '/',
      },
    ],
    sitemap: 'https://codekraftersrmp.in/sitemap.xml',
    host: 'https://codekraftersrmp.in',
  };
}
