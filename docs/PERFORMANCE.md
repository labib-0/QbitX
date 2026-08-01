# QbitX Performance Optimization Guide (RC-1)

Overview of code splitting, dynamic imports, bundle size optimizations, and caching strategies.

---

## 1. Code Splitting & Dynamic Imports
- **Turbopack Bundler**: Next.js 16 Turbopack delivers fast incremental compilation.
- **Dynamic Component Loading**: Heavy drawer components (`GlobalOmniboxSearch`, `GuidedOnboardingTour`, `MediaLibraryModal`) are lazily imported to minimize initial bundle size.

---

## 2. Image Optimization & Asset Delivery
- Next.js `<Image>` component automatically converts images to modern WebP / AVIF formats, serving responsive pixel sizes based on viewport width.

---

## 3. Caching & Data Fetching
- Client-side data caching via React state and SWR/React Query models.
- Pre-rendering static pages (`○ Static`) during `next build` for instant page load times.
