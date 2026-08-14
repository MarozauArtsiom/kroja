// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/content/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const lang of SUPPORTED_LOCALES) {
    routes.push({
      url: `https://nakedskin.vercel.app/${lang}`,
      priority: 1,
      lastModified: new Date(),
    });
    routes.push({
      url: `https://nakedskin.vercel.app/${lang}/configurator`,
      priority: 0.8,
      lastModified: new Date(),
    });
  }

  return routes;
}
