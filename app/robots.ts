import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/shotlist', '/*/shotlist', '/api/'],
    },
    sitemap: 'https://nakedskin.vercel.app/sitemap.xml',
  };
}
