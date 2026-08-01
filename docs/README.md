# QbitX Technical Documentation Hub (Release Candidate RC-1)

Welcome to the official technical documentation for **QbitX** — Next-Generation Interactive Learning & Engineering Ecosystem.

---

## 📚 Technical Documentation Index

| Document | Description |
| :--- | :--- |
| 🏗️ [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Technical system architecture, Student/Mentor/Admin flows, Auth, Services, Automation Engine & AI architecture with Mermaid diagrams. |
| 🗄️ [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Complete database schemas, field definitions, data relationships, and Mermaid ER Diagram. |
| 🔌 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Comprehensive API catalog across Content, Workspace, AI, Automation, and Student API routes. |
| 🧩 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | Reusable UI component library documentation and layout specifications. |
| 🛡️ [RBAC.md](./RBAC.md) | Role-Based Access Control matrix for Super Admin, Platform Admin, Academic Admin, Mentor, and Student roles. |
| 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Vercel & Supabase production deployment guide, SSL configuration, and environment setup. |
| 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) | Coding guidelines, Git branch strategy, commit conventions, and PR workflows. |
| 📁 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Directory tree mapping and responsibility definitions. |
| 📜 [CHANGELOG.md](./CHANGELOG.md) | Complete release log summarizing all 12 implemented platform development phases. |
| 🧪 [TESTING.md](./TESTING.md) | Verification results, manual test suites, and 64/64 route verification report. |
| 🗺️ [ROADMAP.md](./ROADMAP.md) | Completed deliverables vs. Future production engineering roadmap. |

---

## 💻 Tech Stack Quick Reference

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Frontend Core**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS + Glassmorphism aesthetic
- **Authentication**: Supabase Auth + Typed Role Context
- **Database**: TiDB / Supabase PostgreSQL
- **AI Integration**: Event-driven AI Provider Layer (Interactive Demo Mode + LLM Extension Hooks)
