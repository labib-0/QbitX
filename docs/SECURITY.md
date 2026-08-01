# QbitX Security Policy & Architecture Specification (RC-1)

Overview of security controls, authentication flows, RBAC enforcement, session management, and audit logging.

---

## 1. Authentication & Session Management
- **Supabase Auth**: Secure JWT bearer tokens issued upon authentication.
- **Role Scoping**: JWT payloads contain signed user roles (`student`, `mentor`, `super_admin`).
- **Session Expiration**: Automatic token refresh with 1-hour session expiration.

---

## 2. Authorization & RBAC Route Protection
- Protected layout guards (`AdminLayout.tsx`, `MentorLayout.tsx`) enforce permissions on `/admin/*` and `/mentor/*` route trees.
- API endpoints validate authorization headers before processing requests.

---

## 3. Web Vulnerability Mitigations
- **XSS Prevention**: React 19 JSX auto-escapes dynamic string content. Code editor output is sanitized via DOMPurify.
- **CSRF Protection**: SameSite cookie policies enforced on session cookies.
- **File Upload Validation**: Strict mime-type checking (`image/png`, `image/jpeg`, `application/pdf`) and 10MB size limits on uploads.
- **Rate Limiting**: API routes enforce rate limiting to prevent brute-force attacks.

---

## 4. Audit Stream & Compliance
- `AuditLogService` captures all sensitive actions (`USER_SUSPENDED`, `MENTOR_APPROVED`, `ASSIGNMENT_GRADED`, `COURSE_PUBLISHED`).
- Audit logs include actor ID, actor role, timestamp, target entity, and action details.
