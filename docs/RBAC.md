# QbitX Role-Based Access Control (RBAC) Specification (RC-1)

QbitX enforces Role-Based Access Control via `PermissionService.ts` and layout guards (`MentorLayout.tsx`, `AdminLayout.tsx`).

---

## 1. Role Permission Matrix

| Permission Action | `super_admin` | `platform_admin` | `academic_admin` | `mentor` | `student` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Access Student Portal (`/student/*`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access Mentor Portal (`/mentor/*`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Access Admin Portal (`/admin/*`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Author & Edit Courses | ✅ | ✅ | ✅ | ✅ | ❌ |
| Publish Courses to Students | ✅ | ✅ | ✅ | ✅ | ❌ |
| Grade Assignments & Rubrics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve Mentor Applications | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Platform Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configure System Feature Flags | ✅ | ❌ | ❌ | ❌ | ❌ |
| View System Audit Stream | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 2. Guard Implementation Examples

- **Mentor Guard (`MentorLayout.tsx`)**: Rejects users unless `role === "mentor"` or `role === "admin"`.
- **Admin Guard (`AdminLayout.tsx`)**: Rejects users unless `role === "admin"` or `role === "super_admin"` or `role === "platform_admin"`.
