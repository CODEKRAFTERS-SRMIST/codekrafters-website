import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://codekraftersrmp.in';
  const now = new Date();

  // Public-only pages — admin, profile, login, signup, api, join/tasks are EXCLUDED
  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date('2026-09-01'),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date('2026-08-01'),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/krafterslink`,
      lastModified: new Date('2026-08-15'),
    },
  ];
}
