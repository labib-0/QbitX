# ADR-001: Adoption of Next.js 16 (App Router) & React 19

- **Status**: Accepted
- **Date**: 2026-08-01
- **Deciders**: QbitX Architecture Team

---

## Problem
QbitX requires a fast, modern, serverless-ready web framework that supports hybrid Static Site Generation (SSG), Server-Side Rendering (SSR), API route serverless handlers, dynamic routing, and fast client-side navigation for Student, Mentor, and Admin portals.

---

## Options Considered
1. **Plain Single-Page Application (Vite + React Router)**: Fast setup, but lacks built-in serverless API routes, SSR, and SEO pre-rendering for public portfolio pages.
2. **Next.js 16 (App Router + React 19)**: Built-in file-system routing, Server Components, Turbopack bundling, serverless API handlers, and native hydration.
3. **Remix / Hydrogen**: Good data loading model, but smaller ecosystem for React 19 support and deployment plugins compared to Vercel/Next.js.

---

## Decision
Adopt **Next.js 16 (App Router) with React 19 and TypeScript**.

---

## Consequences
- **Positive**:
  - Fast page navigation and instant component hydration.
  - Built-in serverless API route handlers under `src/app/api/`.
  - Zero-config deployment pipeline on Vercel.
- **Negative / Trade-offs**:
  - Requires adherence to App Router conventions (`"use client"` directive for client-side state).
