import { MetadataRoute } from 'next';
import { BASE_URL } from '@/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          ar: `${BASE_URL}/ar`,
        },
      },
    },
    {
      url: `${BASE_URL}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          ar: `${BASE_URL}/ar`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/reciters`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/reciters`,
          ar: `${BASE_URL}/ar/reciters`,
        },
      },
    },
    {
      url: `${BASE_URL}/ar/reciters`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/reciters`,
          ar: `${BASE_URL}/ar/reciters`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/prayer-times`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/prayer-times`,
          ar: `${BASE_URL}/ar/prayer-times`,
        },
      },
    },
    {
      url: `${BASE_URL}/ar/prayer-times`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/prayer-times`,
          ar: `${BASE_URL}/ar/prayer-times`,
        },
      },
    },
  ];
}
