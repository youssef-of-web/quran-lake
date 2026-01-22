# 🚀 Performance Optimization Implementation Plan

## Overview
This plan addresses the slow initial load time of the Quran website by implementing caching, lazy loading, and removing unnecessary API calls.

---

## 📊 Current State Analysis

### Problems Identified:
| Issue | Impact | Location |
|-------|--------|----------|
| **Axios bypasses Next.js caching** | Fresh API call on every page load | `src/lib/axios.ts` |
| **Cache-busting timestamp** | Prevents browser/CDN caching | `src/lib/axios.ts` line 16 |
| **114 Surahs rendered at once** | Large initial DOM, slow hydration | `SurahSection.tsx` |
| **100+ Reciters rendered at once** | Heavy component with animations | `Reciters.tsx` |
| **Duplicate API calls** | Same data fetched multiple times | `layout.tsx` + `reciters/page.tsx` |
| **Static data not utilized** | Surah data exists locally but API is called | `data/data.ts` |
| **Parallel waterfall requests** | Layout waits for API before rendering | `layout.tsx` lines 41-43 |
| **Heavy Framer Motion animations** | 114 staggered animations on mount | `SurahSection.tsx` |

### Current API Calls Per Page Load:
```
Home Page:
├── Layout: getReciters() → mp3quran.net/api/v3/reciters (BLOCKING)
├── Layout: getMessages() → next-intl messages
├── Page: getSurahList() → mp3quran.net/api/v3/suwar (BLOCKING)
└── Page: getMessages() → next-intl messages

Reciters Page:
├── Layout: getReciters() → DUPLICATE
└── Page: getReciters() → DUPLICATE (same call!)

Reciter Detail Page:
├── Layout: getReciters() → DUPLICATE
├── Metadata: getReciterById() → API call #1
├── Page: getReciterById() → DUPLICATE (same ID!)
└── Page: getSurahList() → DUPLICATE
```

---

## 🎯 Implementation Phases

### Phase 1: Quick Wins (High Impact, Low Effort)
**Estimated Time: 1-2 hours**

#### 1.1 Remove Cache-Busting Timestamp
**File:** `src/lib/axios.ts`
```typescript
// REMOVE this interceptor logic:
if (config.method === 'get') {
  config.params = { ...config.params, _t: Date.now() };
}
```
**Impact:** Enables browser caching for repeated requests

#### 1.2 Use Static Surah Data
**File:** `src/app/[locale]/page.tsx`
```typescript
// BEFORE: API call
const suwar = await getSurahList<Suwar>();

// AFTER: Use local static data (already exists!)
import { SurahData } from '@/data/data';
// Just pass SurahData directly - no API needed!
```
**Impact:** Eliminates 1 blocking API call on home page

#### 1.3 Add Revalidation to API Calls
**Files:** All page.tsx files
```typescript
// Add to all pages
export const revalidate = 3600; // Cache for 1 hour
```
**Impact:** Enables ISR, pages are served from cache

---

### Phase 2: Migrate from Axios to Native Fetch
**Estimated Time: 2-3 hours**

#### 2.1 Create New Fetch-Based API Module
**New File:** `src/lib/api-fetch.ts`
```typescript
const API_BASE = 'https://www.mp3quran.net/api/v3';

export async function fetchReciters(locale: string) {
  const res = await fetch(`${API_BASE}/reciters?language=${locale}`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  return res.json();
}

export async function fetchSurahList(locale: string) {
  const res = await fetch(`${API_BASE}/suwar?language=${locale}`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  return res.json();
}

export async function fetchReciterById(id: number, locale: string) {
  const res = await fetch(`${API_BASE}/reciters?language=${locale}&reciter=${id}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}
```
**Impact:** Automatic request deduplication, ISR caching

#### 2.2 Update Pages to Use New API
- Update `layout.tsx`
- Update `page.tsx` (home)
- Update `reciters/page.tsx`
- Update `reciters/[id]/page.tsx`

#### 2.3 Remove Duplicate API Calls
**Problem:** `getReciters()` called in both layout AND reciters page
**Solution:** Only call in layout, pass via context or restructure

---

### Phase 3: Lazy Loading & Virtualization
**Estimated Time: 3-4 hours**

#### 3.1 Implement Virtual Scrolling for Surahs
**File:** `src/components/features/home/SurahSection.tsx`

Option A: Use react-window (recommended)
```bash
pnpm add react-window @types/react-window
```

Option B: Implement infinite scroll with intersection observer
```typescript
// Show first 20 surahs, load more on scroll
const [visibleCount, setVisibleCount] = useState(20);
const loadMore = () => setVisibleCount(prev => prev + 20);
```

#### 3.2 Implement Virtual Scrolling for Reciters
**File:** `src/components/features/reciters/Reciters.tsx`
- Same approach as Surahs
- Start with 20 reciters, load more on scroll

#### 3.3 Reduce Framer Motion Animations
**Current Issue:** 114 staggered animations with spring physics
```typescript
// BEFORE: Heavy animation
staggerChildren: 0.1 // 114 × 0.1 = 11.4 seconds of staggering!

// AFTER: Lighter animation
staggerChildren: 0.02 // Much faster
// Or: Only animate items in viewport
```

---

### Phase 4: Component-Level Optimizations
**Estimated Time: 2-3 hours**

#### 4.1 Move Reciters Fetch to Client-Side
**Reasoning:** Reciters list for the audio player can load after initial paint
```typescript
// In layout.tsx
// Don't block render for reciters
// Instead, load them client-side with SWR or React Query
```

#### 4.2 Implement Suspense Boundaries
**File:** `src/app/[locale]/page.tsx`
```typescript
import { Suspense } from 'react';
import SurahSkeleton from '@/components/skeletons/SurahSkeleton';

export default function Page() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<SurahSkeleton />}>
        <SurahSection />
      </Suspense>
    </>
  );
}
```

#### 4.3 Add Loading Skeletons
Create skeleton components for:
- Surah cards
- Reciter cards
- Prayer times

---

### Phase 5: Advanced Optimizations
**Estimated Time: 2-3 hours**

#### 5.1 Implement Streaming SSR
```typescript
// In page.tsx files
import { Suspense } from 'react';

export default async function Page() {
  // Stream content as it becomes available
  return (
    <Suspense fallback={<Loading />}>
      <AsyncContent />
    </Suspense>
  );
}
```

#### 5.2 Prefetch Critical Data at Build Time
```typescript
// Generate static pages for common locales
export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}
```

#### 5.3 Image Optimization
- Use Next.js `<Image>` component
- Add blur placeholders
- Lazy load offscreen images

---

## 📋 Task Checklist

### Phase 1: Quick Wins
- [ ] Remove cache-busting timestamp from axios interceptor
- [ ] Use static SurahData instead of API call on home page
- [ ] Add `revalidate` export to all page files
- [ ] Remove duplicate `getReciters()` call from reciters page

### Phase 2: Migrate to Fetch
- [ ] Create `src/lib/api-fetch.ts` with native fetch
- [ ] Update `layout.tsx` to use new fetch API
- [ ] Update home `page.tsx` to use new fetch API
- [ ] Update `reciters/page.tsx` to use new fetch API
- [ ] Update `reciters/[id]/page.tsx` to use new fetch API
- [ ] Delete or deprecate axios-based `src/api.ts`

### Phase 3: Lazy Loading
- [ ] Install `react-window` for virtualization
- [ ] Implement virtual list for SurahSection (114 items)
- [ ] Implement virtual list for Reciters (100+ items)
- [ ] Reduce Framer Motion animation intensity
- [ ] Add intersection observer for "load more"

### Phase 4: Component Optimizations
- [ ] Create loading skeleton for Surah cards
- [ ] Create loading skeleton for Reciter cards
- [ ] Add Suspense boundaries to pages
- [ ] Move non-critical data to client-side fetching

### Phase 5: Advanced
- [ ] Implement streaming SSR with Suspense
- [ ] Add `generateStaticParams` for static generation
- [ ] Optimize images with Next.js Image component

---

## 📈 Expected Performance Improvements

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| First Contentful Paint | ~3-5s | <1s |
| Largest Contentful Paint | ~5-8s | <2s |
| Time to Interactive | ~6-10s | <3s |
| API Calls (Home) | 3-4 blocking | 0-1 cached |
| API Calls (Reciters) | 2 duplicate | 0 (cached from layout) |
| DOM Nodes on Load | 500+ | ~100 (virtualized) |

---

## 🚦 Recommended Order of Implementation

1. **Start with Phase 1** - These are quick fixes that will have immediate impact
2. **Do Phase 2 next** - This is the most important structural change
3. **Phase 3 for better UX** - Virtualization prevents DOM bloat
4. **Phases 4-5 for polish** - These add progressive enhancement

---

## 💡 Notes

- The static Surah data in `data/data.ts` already contains all 114 surahs - this should be used instead of API calls for the home page
- The reciters list changes infrequently - a 24-hour cache is reasonable
- Framer Motion's `staggerChildren` with 0.1 delay on 114 items creates an 11+ second animation sequence
- Consider removing the PWA service worker during development as it can cache old versions
