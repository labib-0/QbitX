# QbitX Contribution & Development Guide (RC-1)

Guidelines for contributing to QbitX codebase.

---

## 1. Branch & Commit Conventions

- **Main Branch**: `main` (Production deployment branch).
- **Feature Branches**: `feat/feature-name` or `fix/bug-description`.
- **Commit Message Format**:
  - `feat(scope): add new feature`
  - `fix(scope): resolve issue`
  - `docs(scope): update documentation`

---

## 2. Code Quality & Linting

1. Run local build check before committing:
   ```bash
   npm run build
   ```
2. Ensure no unused imports or broken types.
3. Preserve existing glassmorphism design system tokens in Tailwind CSS v4.
