# ADR-003: Centralized Role-Based Access Control (RBAC) Architecture

- **Status**: Accepted
- **Date**: 2026-08-01
- **Deciders**: QbitX Architecture Team

---

## Problem
QbitX serves 5 distinct platform roles (`super_admin`, `platform_admin`, `academic_admin`, `mentor`, `student`). Access rules must be enforced centrally to prevent unauthorized access to administrative controls or mentor grading portals.

---

## Options Considered
1. **Ad-Hoc Page Guards**: Checking `user.role` inline inside every page component. Fragile and error-prone.
2. **Centralized PermissionService + Layout Guards (`AdminLayout.tsx`, `MentorLayout.tsx`)**: Define a single permission matrix and wrap protected route trees in layout guards.

---

## Decision
Adopt **Centralized PermissionService & Layout Guard Architecture**.

---

## Consequences
- **Positive**:
  - Clear permission matrix in `PermissionService.ts`.
  - Non-admin or non-mentor users are automatically redirected before rendering protected routes.
- **Negative / Trade-offs**:
  - Layout components must handle loading authentication states cleanly.
