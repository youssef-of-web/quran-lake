# Quran Lake - UI Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Design System](#design-system)
4. [Component Library](#component-library)
5. [Pages & Routes](#pages--routes)
6. [Layout Structure](#layout-structure)
7. [State Management](#state-management)
8. [Internationalization](#internationalization)
9. [Theming System](#theming-system)
10. [Animations & Interactions](#animations--interactions)
11. [Responsive Design](#responsive-design)
12. [Accessibility](#accessibility)
13. [Performance Optimizations](#performance-optimizations)

---

## Overview

Quran Lake is a modern, responsive web application for listening to the Holy Quran with multiple reciters, featuring prayer times, bilingual support (English/Arabic), and a Progressive Web App (PWA) implementation.

### Key Features
- **Audio Player**: Full-featured audio player with playlist support
- **Reciters**: Browse and select from multiple Quran reciters
- **Prayer Times**: Location-based prayer times with notifications
- **Bilingual Support**: English and Arabic with RTL support
- **Dark Mode**: System-aware dark mode with manual override
- **PWA**: Installable Progressive Web App
- **Responsive**: Mobile-first design approach

---

## Architecture

### Technology Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Animations**: Framer Motion 12.34.0
- **Internationalization**: next-intl 4.8.3
- **Icons**: Lucide React 0.570.0
- **Select Component**: React Select 5.10.2

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # Internationalized routes
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Home page
│       ├── reciters/       # Reciters pages
│       └── prayer-times/  # Prayer times page
├── components/
│   ├── ui/                 # Base UI components
│   ├── features/          # Feature-specific components
│   │   ├── home/          # Home page components
│   │   ├── reciters/      # Reciter-related components
│   │   └── prayer-times/  # Prayer times components
│   ├── context/           # React Context providers
│   └── [shared components] # Shared components
├── lib/                   # Utility libraries
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

---

## Design System

### Color Palette

#### Primary Colors
- **Primary**: `#0e3b5a` (Deep blue)
- **Green**: `#16a34a` (Prayer times accent)
- **Slate**: Various shades for backgrounds and text

#### Light Mode
- Background: `white` / `bg-white`
- Text: `gray-900` / `text-gray-900`
- Cards: `white` with `border-gray-200`
- Primary: `#0e3b5a`

#### Dark Mode
- Background: `slate-900` / `dark:bg-slate-900`
- Text: `gray-100` / `dark:text-gray-100`
- Cards: `slate-800` with `border-slate-700`
- Primary: Lighter variants for contrast

### Typography

#### Fonts
- **English**: Figtree (Google Fonts)
- **Arabic**: Amiri (Google Fonts)
- Font loading handled via Next.js `next/font/google`

#### Font Sizes
- Hero: `text-4xl md:text-6xl lg:text-7xl`
- Headings: `text-2xl sm:text-3xl md:text-4xl`
- Body: `text-base` / `text-sm`
- Small: `text-xs sm:text-sm`

### Spacing System
Uses Tailwind's default spacing scale:
- Container padding: `px-4 md:px-6`
- Section gaps: `gap-4`, `gap-8`
- Component spacing: `space-y-4`, `space-y-6`

### Border Radius
- Default: `rounded-lg` (0.5rem)
- Buttons: `rounded-md`, `rounded-full`
- Cards: `rounded-lg`

### Shadows
- Cards: `shadow-sm`
- Hover: `shadow-md`
- Fixed elements: `shadow-lg`

---

## Component Library

### Base Components

#### Button (`components/ui/Button.tsx`)
A flexible button component with customizable styling.

**Props:**
- `children`: React.ReactNode
- `className`: string (optional)
- All standard HTML button attributes

**Usage:**
```tsx
<Button className="bg-primary text-white px-4 py-2">
  Click me
</Button>
```

### Navigation Components

#### Navbar (`components/Navbar.tsx`)
Main navigation bar with responsive mobile menu.

**Features:**
- Fixed on scroll
- Mobile hamburger menu
- Desktop navigation links
- GitHub link
- Install PWA button
- Settings dropdown

**States:**
- `isScrolled`: Changes styling when scrolled
- `mobileMenuOpen`: Controls mobile menu visibility

**Animations:**
- Fade in on mount
- Scale on hover for logo
- Spring animation for mobile menu

#### LocaleSwitcher (`components/LocaleSwitcher.tsx`)
Language switcher component with two variants.

**Props:**
- `variant`: `'default' | 'settings'` (optional, default: `'default'`)

**Features:**
- Supports English (`en`) and Arabic (`ar`)
- Smooth transitions
- Loading state during locale change
- RTL-aware positioning

**Usage:**
```tsx
<LocaleSwitcher variant="settings" />
```

#### ThemeToggle (`components/ThemeToggle.tsx`)
Theme switcher with three options: Light, Dark, System.

**Props:**
- `variant`: `'default' | 'settings'` (optional)

**Features:**
- Light/Dark/System modes
- Icon animations
- Dropdown menu (default variant)
- Settings panel integration

**Theme Options:**
- `light`: Light mode
- `dark`: Dark mode
- `system`: Follows OS preference

#### Settings (`components/Settings.tsx`)
Settings dropdown component for mobile navigation.

**Features:**
- Language switcher
- Theme toggle
- RTL-aware positioning
- Backdrop overlay

#### FloatingSettings (`components/FloatingSettings.tsx`)
Fixed floating settings button (desktop only).

**Features:**
- Fixed position (left/right based on locale)
- Slide-in panel
- Language and theme controls
- Click outside to close

### Feature Components

#### HeroSection (`components/features/home/HeroSection.tsx`)
Homepage hero section with call-to-action.

**Features:**
- Gradient background
- Pattern overlay
- Animated title and subtitle
- CTA button to reciters page
- Full-screen height

**Animations:**
- Fade in with stagger
- Scale animations
- Smooth transitions

#### SurahSection (`components/features/home/SurahSection.tsx`)
Grid display of all Quran chapters (Surahs).

**Features:**
- Responsive grid layout
- Play button for each Surah
- Staggered animations
- Hover effects

**Grid Layout:**
- Mobile: 1 column
- Tablet: 2 columns (`md:grid-cols-2`)
- Desktop: 3 columns (`lg:grid-cols-3`)
- Large: 4 columns (`xl:grid-cols-4`)

#### AudioPlayer (`components/AudioPlayer.tsx`)
Full-featured audio player component.

**Features:**
- Play/Pause controls
- Previous/Next Surah navigation
- Progress bar with seek functionality
- Time display (current/total)
- Reciter selector dropdown
- Download audio functionality
- Collapsible interface
- Media Session API integration

**States:**
- `open`: Expanded/collapsed state
- `isPlaying`: Playback state
- `currentTime`: Current playback position
- `duration`: Total audio duration
- `isDownloading`: Download progress

**Controls:**
- Play/Pause button
- Skip backward/forward
- Progress bar (clickable)
- Reciter selector
- Download button
- Expand/collapse toggle

**Animations:**
- Slide up from bottom
- Smooth height transitions
- Fade animations for controls

#### Reciters (`components/features/reciters/Reciters.tsx`)
Reciters listing page with search.

**Features:**
- Search/filter functionality
- Grid layout
- Animated list items
- Hero section with search

**Search:**
- Real-time filtering
- Case-insensitive
- Debounced updates

#### Reciter (`components/features/reciters/Reciter.tsx`)
Individual reciter card component.

**Features:**
- Reciter image
- Name display
- Hover effects
- Link to reciter detail page

#### PrayerTimesClient (`components/features/prayer-times/PrayerTimesClient.tsx`)
Main prayer times page component.

**Features:**
- Location-based prayer times
- Next prayer countdown
- Prayer times grid
- Location card
- Cache status indicator
- Adhan player
- Offline support
- Error handling

**States:**
- `loading`: Initial load state
- `error`: Error state
- `refreshing`: Refresh in progress
- `isOffline`: Offline mode indicator
- `cacheStatus`: Cache information

#### NextPrayerCard (`components/features/prayer-times/NextPrayerCard.tsx`)
Displays the next upcoming prayer with countdown.

**Features:**
- Prayer name
- Time remaining
- Visual countdown
- Highlighted styling

#### PrayerTimesCard (`components/features/prayer-times/PrayerTimesCard.tsx`)
Individual prayer time card.

**Features:**
- Prayer name
- Prayer time
- Status indicator (past/upcoming)
- Responsive grid item

#### LocationCard (`components/features/prayer-times/LocationCard.tsx`)
Displays current location information.

**Features:**
- Location name
- Coordinates
- Refresh button
- Loading state

#### AdhanPlayer (`components/features/prayer-times/AdhanPlayer.tsx`)
Audio player for Adhan (call to prayer).

**Features:**
- Play Adhan audio
- Auto-play on prayer time
- Manual controls

#### CacheStatus (`components/features/prayer-times/CacheStatus.tsx`)
Shows cache status and controls.

**Features:**
- Cache age indicator
- Refresh button
- Clear cache button
- Offline mode indicator

### Utility Components

#### Search (`components/Search.tsx`)
Search input component with icon.

**Features:**
- Focus animations
- Placeholder text
- Search icon
- Responsive width

#### Install (`components/Install.tsx`)
PWA install button component.

**Features:**
- Install prompt
- Installation state
- Browser compatibility check

#### Hero (`components/Hero.tsx`)
Reusable hero section component.

**Props:**
- `title`: string
- `placeholder`: string (for search)
- `onChange`: ChangeEventHandler

**Features:**
- Title display
- Integrated search
- Gradient background

---

## Pages & Routes

### Route Structure
All routes are internationalized under `[locale]` parameter:
- `/` or `/[locale]` - Home page
- `/[locale]/reciters` - Reciters listing
- `/[locale]/reciters/[id]` - Reciter detail page
- `/[locale]/prayer-times` - Prayer times page

### Home Page (`app/[locale]/page.tsx`)

**Components:**
- `HeroSection`
- `SurahSection`

**Features:**
- Server-side data fetching
- SEO metadata
- Internationalized content

### Reciters Page (`app/[locale]/reciters/page.tsx`)

**Components:**
- `Reciters`

**Features:**
- Server-side data fetching
- Revalidation (1 hour)
- SEO metadata

### Reciter Detail Page (`app/[locale]/reciters/[id]/page.tsx`)

**Components:**
- `Detail`
- `Moshaf`
- `SurahList`

**Features:**
- Dynamic route
- Reciter-specific content
- Audio player integration

### Prayer Times Page (`app/[locale]/prayer-times/page.tsx`)

**Components:**
- `PrayerTimesClient`

**Features:**
- Client-side rendering
- Location-based data
- Real-time updates

---

## Layout Structure

### Root Layout (`app/[locale]/layout.tsx`)

**Structure:**
```tsx
<html>
  <head>
    <script> // Theme initialization
  </head>
  <body>
    <NextIntlClientProvider>
      <ThemeProvider>
        <FloatingSettings /> {/* Desktop only */}
        <AudioWrapper>
          <Navbar />
          {children}
        </AudioWrapper>
      </ThemeProvider>
    </NextIntlClientProvider>
  </body>
</html>
```

**Features:**
- Locale-aware HTML attributes (`lang`, `dir`)
- Font loading (Amiri for Arabic, Figtree for English)
- Theme initialization script
- Context providers
- PWA manifest

**Providers:**
1. `NextIntlClientProvider` - Internationalization
2. `ThemeProvider` - Theme management
3. `AudioWrapper` - Audio context

---

## State Management

### Context Providers

#### AudioContext (`components/context/AudioContext.tsx`)
Manages audio player state globally.

**State:**
- `reciter`: Current reciter
- `surah`: Current Surah
- `server`: Audio server URL
- `open`: Player visibility
- `surah_list`: List of Surahs

**Methods:**
- `setReciter`: Update reciter
- `setSurah`: Update Surah
- `setServer`: Update audio URL
- `setOpen`: Toggle player
- `setSuratList`: Update Surah list
- `playAudio`: Play audio with reciter and Surah

#### ThemeContext (`components/context/ThemeContext.tsx`)
Manages theme state.

**State:**
- `theme`: `'light' | 'dark' | 'system'`
- `resolvedTheme`: Actual theme (`'light' | 'dark'`)

**Methods:**
- `setTheme`: Update theme preference

**Features:**
- localStorage persistence
- System preference detection
- SSR-safe implementation

---

## Internationalization

### Configuration

**Locales:**
- `en` - English
- `ar` - Arabic

**Locale Prefix:**
- `as-needed` - Only shows locale prefix when not default

**Locale Detection:**
- Disabled (manual selection only)

### Implementation

**Files:**
- `src/i18n.ts` - Request configuration
- `src/lib/intl.ts` - Navigation utilities
- `src/proxy.ts` - Locale routing proxy
- `src/messages/` - Translation files

**Navigation:**
- `Link` - Localized link component
- `usePathname` - Localized pathname hook
- `useRouter` - Localized router hook
- `redirect` - Localized redirect

**Translation:**
- `useTranslations` - Translation hook
- `getMessages` - Server-side translations

### RTL Support

**Implementation:**
- `dir` attribute on HTML element
- Conditional RTL classes
- RTL-aware positioning utilities
- Font switching (Amiri for Arabic)

**Examples:**
```tsx
<div className={locale === 'ar' ? 'rtl' : 'ltr'}>
<div className={isRTL ? 'right-4' : 'left-4'}>
```

---

## Theming System

### Theme Modes

1. **Light Mode**
   - White backgrounds
   - Dark text
   - Light borders

2. **Dark Mode**
   - Dark slate backgrounds
   - Light text
   - Dark borders

3. **System Mode**
   - Follows OS preference
   - Uses `prefers-color-scheme` media query

### Implementation

**Theme Storage:**
- localStorage key: `theme`
- Values: `'light' | 'dark' | 'system'`

**Theme Initialization:**
- Inline script in `<head>` for instant application
- Prevents flash of wrong theme
- Checks localStorage and system preference

**CSS Variables:**
- Defined in `globals.css`
- HSL color format
- Separate light/dark definitions

**Theme Classes:**
- `dark` class on `<html>` element
- Tailwind `dark:` prefix for dark mode styles

### Theme Transitions

**Smooth Transitions:**
- Color transitions: 150ms
- Background transitions
- Border transitions
- Applied globally via CSS

---

## Animations & Interactions

### Animation Library
**Framer Motion** is used throughout the application.

### Animation Patterns

#### Page Transitions
- Fade in: `opacity: 0 → 1`
- Slide up: `y: 20 → 0`
- Duration: 0.3-0.5s

#### Stagger Animations
- Used in grid layouts
- Children animate sequentially
- Delay: 0.1s between items

#### Hover Effects
- Scale: `scale: 1 → 1.05`
- Background color transitions
- Shadow elevation changes

#### Loading States
- Spinner animations
- Skeleton screens
- Fade transitions

### Component-Specific Animations

#### Navbar
- Fade in on mount
- Fixed position on scroll
- Mobile menu slide down

#### Audio Player
- Slide up from bottom
- Height transitions
- Control fade in/out

#### Cards
- Scale on hover
- Shadow elevation
- Border color transitions

#### Settings Panel
- Scale and fade
- Slide from side
- Backdrop fade

---

## Responsive Design

### Breakpoints

**Tailwind Defaults:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

**Common Patterns:**
```tsx
// Mobile: single column, Desktop: grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Mobile: smaller text, Desktop: larger
className="text-2xl sm:text-3xl md:text-4xl"

// Mobile: less padding, Desktop: more
className="px-4 md:px-6 lg:px-8"
```

### Responsive Components

#### Navbar
- Mobile: Hamburger menu
- Desktop: Full navigation

#### Grid Layouts
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

#### Typography
- Mobile: Smaller font sizes
- Desktop: Larger font sizes
- Responsive line heights

#### Spacing
- Mobile: Tighter spacing
- Desktop: More generous spacing

---

## Accessibility

### ARIA Labels
- Buttons have `aria-label` attributes
- Navigation landmarks
- Form labels

### Keyboard Navigation
- Focus states visible
- Tab order logical
- Keyboard shortcuts support

### Screen Reader Support
- Semantic HTML
- Alt text for images
- ARIA attributes where needed

### Focus Management
- Visible focus rings
- Focus trap in modals
- Focus restoration

### Color Contrast
- WCAG AA compliant
- Dark mode contrast checked
- Text readability ensured

---

## Performance Optimizations

### Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images
- WebP/AVIF formats

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### Font Optimization
- Next.js font optimization
- Subset loading
- Display swap

### Animation Performance
- GPU-accelerated transforms
- Will-change hints
- Reduced motion support

### Caching
- Static page caching
- API response caching
- Service worker caching (PWA)

### Bundle Size
- Tree shaking
- Code splitting
- Minimal dependencies

---

## Styling Guidelines

### Tailwind CSS Usage

**Utility Classes:**
- Prefer utility classes over custom CSS
- Use component classes sparingly
- Leverage Tailwind's design tokens

**Custom Classes:**
- Defined in `globals.css`
- Use `@layer` for organization
- Document custom utilities

### CSS Variables

**Color System:**
- HSL format
- Semantic naming
- Theme-aware

**Usage:**
```css
background-color: hsl(var(--background));
color: hsl(var(--foreground));
```

### Dark Mode

**Implementation:**
- `dark:` prefix for dark mode styles
- CSS variables for theme colors
- Smooth transitions

**Example:**
```tsx
className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
```

---

## Component Patterns

### Client Components
- Marked with `'use client'`
- Used for interactivity
- State management
- Event handlers

### Server Components
- Default in App Router
- Data fetching
- SEO metadata
- Static content

### Composition Pattern
- Small, focused components
- Props for customization
- Children for flexibility

### Container/Presentational Pattern
- Containers: Logic and state
- Presentational: UI only
- Clear separation

---

## Best Practices

### Component Design
1. **Single Responsibility**: Each component has one purpose
2. **Reusability**: Extract common patterns
3. **Composition**: Build complex from simple
4. **Props Interface**: Clear, typed props
5. **Default Props**: Sensible defaults

### State Management
1. **Local State**: Use `useState` for component state
2. **Context**: For global, shared state
3. **Server State**: Use Server Components when possible
4. **Derived State**: Compute from props/state

### Performance
1. **Memoization**: Use `useMemo` for expensive computations
2. **Callbacks**: Use `useCallback` for stable references
3. **Lazy Loading**: Load components on demand
4. **Image Optimization**: Always use Next.js Image

### Accessibility
1. **Semantic HTML**: Use correct elements
2. **ARIA**: When needed, not as replacement
3. **Keyboard**: Ensure keyboard accessible
4. **Focus**: Visible focus indicators

### Internationalization
1. **Translation Keys**: Use descriptive keys
2. **RTL Support**: Test both directions
3. **Locale Formatting**: Use locale-aware formatting
4. **Text Length**: Account for text expansion

---

## Development Workflow

### Adding a New Component

1. **Create Component File**
   ```tsx
   'use client'; // If needed
   
   interface Props {
     // Define props
   }
   
   export default function ComponentName({ props }: Props) {
     // Implementation
   }
   ```

2. **Add Types** (if needed)
   - Create type file in `types/`
   - Export interfaces/types

3. **Add Styles**
   - Use Tailwind utilities
   - Add custom styles if needed

4. **Add Translations**
   - Add keys to message files
   - Use `useTranslations` hook

5. **Test**
   - Test in light/dark mode
   - Test in both locales
   - Test responsive breakpoints
   - Test accessibility

### Adding a New Page

1. **Create Page File**
   ```tsx
   // app/[locale]/new-page/page.tsx
   export async function generateMetadata() {
     // SEO metadata
   }
   
   export default function Page() {
     // Page content
   }
   ```

2. **Add Route**
   - File-based routing (automatic)
   - Add to navigation if needed

3. **Add Translations**
   - Page-specific translations
   - Navigation labels

4. **Test**
   - All locales
   - SEO metadata
   - Performance

---

## Troubleshooting

### Common Issues

#### Theme Flash
- **Cause**: Theme applied after render
- **Solution**: Inline script in `<head>`

#### RTL Layout Issues
- **Cause**: Missing RTL classes
- **Solution**: Check `dir` attribute and conditional classes

#### Animation Performance
- **Cause**: Too many animations
- **Solution**: Reduce motion, use `will-change`

#### Translation Missing
- **Cause**: Key not in message file
- **Solution**: Add key to all locale files

#### Image Not Loading
- **Cause**: Incorrect path or format
- **Solution**: Check path, use Next.js Image component

---

## Future Enhancements

### Planned Features
- [ ] More animation options
- [ ] Additional theme customization
- [ ] Enhanced accessibility features
- [ ] Performance monitoring
- [ ] Analytics integration

### Component Improvements
- [ ] Component documentation
- [ ] Storybook integration
- [ ] Visual regression testing
- [ ] Component playground

---

## Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [next-intl Documentation](https://next-intl-docs.vercel.app)

### Design Resources
- [Tailwind UI](https://tailwindui.com)
- [Heroicons](https://heroicons.com)
- [Lucide Icons](https://lucide.dev)

---

## Conclusion

This documentation provides a comprehensive overview of the Quran Lake UI architecture, components, and patterns. For specific implementation details, refer to the component source code and inline comments.

For questions or contributions, please refer to the project repository or contact the development team.
