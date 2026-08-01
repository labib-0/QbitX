# QbitX Project Structure & Directory Mapping (RC-1)

```
QbitX/
├── docs/                        # Complete technical documentation suite
│   ├── README.md                # Documentation Hub Index
│   ├── SYSTEM_ARCHITECTURE.md   # Architecture & Mermaid flows
│   ├── DATABASE_SCHEMA.md       # Schemas & ER Diagram
│   ├── API_DOCUMENTATION.md     # API Endpoint Catalog
│   ├── COMPONENT_GUIDE.md       # UI Components Guide
│   ├── RBAC.md                  # Role Matrix & Guards
│   ├── DEPLOYMENT_GUIDE.md      # Vercel Deployment Guide
│   ├── CONTRIBUTING.md          # Coding & Git Standards
│   ├── PROJECT_STRUCTURE.md     # Directory Tree Mapping
│   ├── CHANGELOG.md             # Complete Release Log
│   ├── TESTING.md               # Test Suite & Verification Report
│   └── ROADMAP.md               # Completed vs. Future Roadmap
├── public/                      # Static assets & transparent logos
├── src/
│   ├── app/                     # Next.js 16 App Router pages & API handlers
│   │   ├── admin/               # Admin Portal routes (/admin/*)
│   │   ├── api/                 # Serverless API routes (/api/*)
│   │   ├── mentor/              # Mentor Portal routes (/mentor/*)
│   │   ├── portfolio/           # Shareable public portfolio routes (/portfolio/[username])
│   │   └── student/             # Student Portal routes (/student/*)
│   ├── components/              # Modular UI components
│   │   ├── admin-dashboard/     # Admin Management Widgets
│   │   ├── career/              # Career Development & Portfolio Components
│   │   ├── mentor-dashboard/    # Mentor Operations & Builder Components
│   │   ├── onboarding/          # Guided Onboarding Tour
│   │   ├── search/              # Global Ctrl+K Omnibox Search
│   │   ├── student-dashboard/   # Student Workspace Components
│   │   ├── ui/                  # Skeleton Loaders & Core Controls
│   │   └── workspace/           # Learning Workspace Renderers & Panels
│   ├── context/                 # Auth & Theme Context Providers
│   ├── lib/                     # Supabase & Data Helpers
│   ├── services/                # Decoupled Core Services
│   │   ├── admin/               # Admin & Permission Services
│   │   ├── ai/                  # AI Provider Layer (Demo & Extension Hooks)
│   │   ├── automation/          # EventBus, WorkflowEngine, JobScheduler, QueueManager
│   │   ├── career/              # Career & Resume Services
│   │   ├── content/             # Content Hierarchy & Builder Services
│   │   └── mentor/              # Mentor Success & Audit Services
│   └── types/                   # TypeScript interfaces & domain models
└── package.json                 # Project dependencies & npm scripts
```
