import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/shotlist', '/api/'],
    },
    sitemap: 'https://kroja.example/sitemap.xml',
  };
}
