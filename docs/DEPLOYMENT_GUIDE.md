# QbitX Production Deployment Guide (RC-1)

Step-by-step instructions for deploying QbitX on **Vercel** and **Supabase**.

---

## 1. Prerequisites & Environment Variables

Create `.env.local` or configure Vercel Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=https://qbitx.vercel.app
```

---

## 2. Vercel Deployment Steps

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "release: RC-1"
   git push origin main
   ```
2. Connect your repository in Vercel Dashboard.
3. Set Build Command: `next build`
4. Set Output Directory: `.next`
5. Deploy! Vercel will automatically trigger production builds on every push to `main`.

---

## 3. Production Deployment Pre-Flight Checklist

- [x] **TypeScript Compilation**: `npm run build` passes with 0 errors across all 64 routes.
- [x] **Role Guards**: Verify RBAC protection on `/mentor/*` and `/admin/*`.
- [x] **SSL & HTTPS**: Domain configured with SSL certificate.
- [x] **Audit Logging**: `AuditLogService` capturing administrative events.
