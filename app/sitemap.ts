import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://kroja.example/', priority: 1 },
    { url: 'https://kroja.example/configurator', priority: 0.8 },
  ];
}
