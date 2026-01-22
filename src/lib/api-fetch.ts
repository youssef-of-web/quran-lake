/**
 * Native fetch-based API module for Next.js with proper caching.
 * Uses Next.js extended fetch with ISR (Incremental Static Regeneration).
 */

const API_BASE = 'https://www.mp3quran.net/api/v3';

interface FetchOptions {
    revalidate?: number;
    tags?: string[];
}

async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { revalidate = 3600, tags } = options;

    const res = await fetch(`${API_BASE}/${endpoint}`, {
        next: {
            revalidate,
            ...(tags && { tags })
        }
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}

/**
 * Fetch all reciters with 24-hour cache
 */
export async function fetchReciters<T>(locale: string): Promise<T> {
    return apiFetch<T>(`reciters?language=${locale}`, {
        revalidate: 86400, // 24 hours
        tags: ['reciters']
    });
}

/**
 * Fetch surah list with 24-hour cache
 */
export async function fetchSurahList<T>(locale: string): Promise<T> {
    return apiFetch<T>(`suwar?language=${locale}`, {
        revalidate: 86400, // 24 hours
        tags: ['surahs']
    });
}

/**
 * Fetch a specific reciter by ID with 1-hour cache
 */
export async function fetchReciterById<T>(id: number, locale: string): Promise<T> {
    return apiFetch<T>(`reciters?language=${locale}&reciter=${id}`, {
        revalidate: 3600, // 1 hour
        tags: ['reciter', `reciter-${id}`]
    });
}
