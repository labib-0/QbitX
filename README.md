# QbitX — Next-Generation Interactive Learning & Engineering Platform (Release Candidate RC-1)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

QbitX is an investor-grade, production-ready educational platform designed to empower students, mentors, and administrators through unified content architecture, AI mentorship, notion-style course builder studios, automated workflow engines, and career portfolio hubs.

---

## 🌟 Key Platform Ecosystem Portals

- 🎓 **Student Portal & Workspace** (`/student/dashboard`, `/student/workspace`): Distraction-free course player, 7 multi-format renderers, 24/7 AI Code Tutor, team project workspaces, and achievement gamification.
- 👨‍🏫 **Mentor Portal & Content Studio** (`/mentor/dashboard`, `/mentor/builder`): Notion-style Markdown authoring studio, rubric assignment review workspace, early intervention risk detector, and office hours calendar.
- 🛠️ **Admin Platform Control** (`/admin/dashboard`, `/admin/users`): Executive health dashboard (99.98% uptime), unified user roster management, mentor application approvals, course quality governance, multi-tenant university manager, global broadcasts, system feature flags, and real-time audit log stream.
- 💼 **Career Development & Portfolio Hub** (`/student/career`, `/portfolio/[username]`): Digital student portfolio, automatic capstone project showcase, ATS resume builder with PDF export (`window.print()`), skill matrix (88/100 readiness score), career roadmaps, internship application tracker, and shareable public profile.
- ⚙️ **Central Automation Engine** (`/api/automation/*`): EventBus (18 platform events), Trigger-Condition-Action WorkflowEngine, scheduled job framework, queue-ready task manager, and AI extension hooks.

---

## 📚 Technical Documentation Hub (`/docs/`)

Complete technical documentation is located under the [`/docs`](./docs) directory:

- 🏗️ **[System Architecture & Flow Diagrams](./docs/SYSTEM_ARCHITECTURE.md)**
- 🗄️ **[Database Schemas & ER Diagram](./docs/DATABASE_SCHEMA.md)**
- 🔌 **[API Endpoint Catalog](./docs/API_DOCUMENTATION.md)**
- 🧩 **[UI Component Guide](./docs/COMPONENT_GUIDE.md)**
- 🛡️ **[Role-Based Access Control (RBAC)](./docs/RBAC.md)**
- 🚀 **[Production Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)**
- 🤝 **[Contribution & Git Guidelines](./docs/CONTRIBUTING.md)**
- 📁 **[Project Directory Structure](./docs/PROJECT_STRUCTURE.md)**
- 📜 **[Phase Changelog](./docs/CHANGELOG.md)**
- 🧪 **[Testing & 64/64 Route Verification](./docs/TESTING.md)**
- 🗺️ **[Product Roadmap](./docs/ROADMAP.md)**

---

## 🛠️ Quick Local Setup

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/labib-0/QbitX.git
   cd QbitX
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Type Check Verification**:
   ```bash
   npm run build
   ```

---

## 👤 Verified Demo Accounts

- **Student Role**: `student@qbitx.com` / Password: `demo-password`
- **Mentor Role**: `mentor@qbitx.com` / Password: `demo-password`
- **Super Admin Role**: `admin@qbitx.com` / Password: `demo-password`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
