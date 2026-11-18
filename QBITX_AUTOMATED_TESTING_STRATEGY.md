# QbitX — Comprehensive Automated Testing Strategy

**Document type:** Quality Assurance / Software Test Strategy  
**Project:** QbitX — AI-powered, project-based learning platform  
**Reviewed against:** `labib-0/QbitX`, branch `release-readiness-fix`, commit `b784e34`  
**Pull request:** [#1 — Release-readiness fixes](https://github.com/labib-0/QbitX/pull/1)  
**Review date:** 18 November 2026  
**Status:** Test specification — implementation and execution still required

---

## 1. Purpose

This document defines the automated testing strategy required to establish that QbitX works correctly, protects user data, behaves consistently across supported devices, and can be released safely.

The objective is not merely to make the existing test commands pass. The objective is to verify the complete product lifecycle:

> User action → browser UI → authentication and authorization → API route → validation and business logic → PostgreSQL persistence → response → correct UI state.

A route returning HTTP 200, a page rendering, a successful TypeScript build, or a passing mocked unit test does **not** prove that a feature works end to end.

The test programme must cover the public website, student portal, mentor portal, administrator portal, learning workspace, AI features, database, external integrations, security boundaries, accessibility, responsive behavior, performance, and deployment readiness.

This document is a plan and acceptance specification. It does not claim that every test described below already exists or has passed.

## 2. Current project baseline and known limitations

The repository currently uses:

| Area | Current implementation observed |
|---|---|
| Web framework | Next.js App Router, React 19, TypeScript |
| Styling/UI | Tailwind CSS v4, reusable React components |
| Authentication | Better Auth |
| Database | PostgreSQL / Neon with Drizzle ORM; PGlite used for local automated database tests |
| AI | Google Gemini integration and a demo/fallback AI provider |
| Unit/integration runner | Vitest |
| Browser automation | Playwright |
| Test directories | `src/tests/unit`, `src/tests/integration`, `e2e` |
| Existing commands | `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, `npm run build` |

### 2.1 Existing automated tests reported on the reviewed branch

The latest branch report records:

- 11 Vitest test files and 106 passing unit/integration tests.
- 26 passing Playwright executions across Desktop Chrome and Mobile Responsive projects.
- TypeScript check and Next.js production build passing.
- ESLint exiting successfully, with 488 warnings reported in the latest run.
- `npm ci` succeeding after removing a Linux-only Tailwind Oxide package from root dependencies.

These are reported results from the branch workflow, not an independent reproduction by this document's author. Re-run the complete suite from a clean checkout before release.

### 2.2 Existing test files observed

**Unit tests:**

- `src/tests/unit/ai.test.ts`
- `src/tests/unit/permissions.test.ts`
- `src/tests/unit/progress.test.ts`
- `src/tests/unit/validation.test.ts`

**Integration tests:**

- `src/tests/integration/ai-service.test.ts`
- `src/tests/integration/api-security.test.ts`
- `src/tests/integration/auth-security.test.ts`
- `src/tests/integration/database.test.ts`
- `src/tests/integration/health.test.ts`
- `src/tests/integration/journeys.test.ts`
- `src/tests/integration/migrations.test.ts`

**Playwright suites:**

- `e2e/student.spec.ts`
- `e2e/mentor.spec.ts`
- `e2e/admin.spec.ts`

The existing Playwright suite is a useful starting point, but some tests currently verify only that a page body or URL is visible. Those checks must be expanded to assert real business outcomes and persisted data. For example, navigating to `/admin/users` is not proof that searching, changing a role, or suspending a user works.

The current Playwright configuration uses Desktop Chrome and a Pixel 5 mobile-emulation project. Add Firefox and WebKit coverage, accessibility checks, failure artifacts, and separate visual/performance jobs.

### 2.3 Important issues to address in the test programme

1. **Silent fallback data:** The current branch adds fabricated fallback users, mentor applications and dashboard statistics when certain admin API calls fail or return no data. Production tests must prove that an API error or genuinely empty database never appears as genuine platform data. Prefer an explicit error/empty state. If sample data is retained, it must be enabled only in a deliberate demo environment and clearly labelled.
2. **Demo/test credentials:** End-to-end tests must use dedicated disposable test accounts and a dedicated test database. Never use known demo passwords against production.
3. **Mocked authentication:** Mocking session helpers is useful for unit/API authorization tests, but at least one set of integration and browser tests must exercise real Better Auth cookies, role checks and database-backed sessions.
4. **AI provider configuration:** Tests with no Gemini key must verify an honest “AI not configured” state. They must not accept a fake answer as a successful real AI response.
5. **Clean installation:** `npm ci` must succeed on a clean checkout without `--force` before any test result is considered release evidence.
6. **CI automation:** The repository snapshot reviewed for this document did not show a GitHub Actions workflow. Add a required pull-request quality workflow; local test execution alone is not a durable release gate.
7. **Legacy route checklist:** The existing `docs/TESTING.md` is primarily a route-verification report. Route visibility is not comprehensive functional testing. Replace or update stale route counts and link this strategy from the project documentation.

---

## 3. Testing objectives

The automated programme must establish the following:

1. **Functional correctness:** Every supported user action produces the expected result, validation message, navigation or error state.
2. **Data integrity:** Important records are stored correctly, survive reloads and are visible only to authorized users.
3. **Security:** Authentication, authorization, tenant/user ownership, input validation and secrets are enforced on the server, not merely hidden in the UI.
4. **Reliability:** Database, AI and email failures produce safe, recoverable behavior without corrupting data or inventing success.
5. **Compatibility:** Core workflows work at supported viewport sizes and across supported browser engines.
6. **Accessibility:** Core journeys can be operated with a keyboard and assistive technology and meet the agreed WCAG 2.2 AA target.
7. **Performance:** Key pages and APIs meet agreed response and Core Web Vitals budgets under realistic conditions.
8. **Release safety:** Migrations, clean installation, build, automated checks and post-deployment smoke tests pass before a release is promoted.

## 4. Test environments and data policy

### 4.1 Required environments

| Environment | Purpose | Data rules |
|---|---|---|
| Local | Developer feedback | PGlite or a disposable local PostgreSQL database; synthetic records only |
| CI | Repeatable automated checks | Fresh isolated database per job/run; deterministic fixtures |
| Preview | Review a pull request as a deployed app | Dedicated preview database or isolated Neon branch; never point preview at production data |
| Staging | Production-like release rehearsal | Sanitized synthetic data; production-like auth, database and integrations |
| Production | Real users | Only non-destructive smoke tests using dedicated monitoring accounts and explicit approval |

### 4.2 Environment variables

Use a documented `.env.test.example` containing placeholders only. The actual test environment should define the equivalents of:

- `DATABASE_URL` — isolated test database connection.
- `BETTER_AUTH_SECRET` — test-only secret, never reused in production.
- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — local or preview origin.
- `GOOGLE_GENERATIVE_AI_API_KEY` — optional; only live AI tests need it.
- `RESEND_API_KEY` — normally stubbed in ordinary CI; live email tests use a sandbox/test recipient.
- `ALLOW_PGLITE_TEST=true` — only where the application intentionally selects its PGlite test adapter.

Never expose database, auth, Gemini or Resend secrets through `NEXT_PUBLIC_*`. Never use production credentials in a pull-request workflow, especially for contributions from forks.

### 4.3 Test data rules

- Use deterministic fixtures and unique test IDs/emails; avoid depending on shared demo accounts.
- Create and clean up test records for each test or test suite.
- Keep tests independent: a test must not rely on another test having run first.
- Seed only the minimum data required for the scenario.
- Include at least two students, two mentors and two administrators where role/ownership boundaries need to be checked.
- Record test data ownership explicitly so IDOR and cross-user access tests can be performed.
- Do not run destructive reset, schema-push or seed commands against production.
- Do not silently fall back to sample production data when APIs or the database fail.

---

## 5. Testing layers and required test types

### 5.1 Static analysis and build verification

**Purpose:** Catch errors before running behavioral tests.

Required checks:

- Clean dependency installation with `npm ci`.
- TypeScript strict check with `npm run typecheck`.
- ESLint with `npm run lint`.
- Next.js production compilation with `npm run build`.
- Dependency and secret scanning (see Security Testing).
- Migration journal/snapshot consistency check.

Acceptance:

- No TypeScript errors.
- No ESLint errors. Warnings must be reviewed and reduced; do not silently accept growing warning counts. Define a baseline and fail CI when new warnings are introduced.
- No unresolved build errors or missing runtime environment variables.
- No committed secrets, real user records or local environment files.
- A clean `npm ci` works without `--force`.

### 5.2 Unit testing — Vitest

**Purpose:** Test one function, class, validation rule, hook or isolated component behavior at a time.

Cover:

- Zod/input schemas: valid, missing, malformed, oversized and boundary values.
- Permission helpers: every role/action combination, including denied-by-default cases.
- Progress calculations: zero lessons, partially completed courses, all lessons completed, duplicate completion events and invalid values.
- Service functions: course selection, enrollment logic, project submission, grading, certificates, notification formatting, profile updates and audit metadata.
- AI prompt construction and output normalization, provider selection and configuration checks.
- Markdown renderer parsing: paragraphs, headings, nested lists, links, inline code and fenced code blocks.
- Utility functions: dates, pagination, sorting, currency/number formatting and empty values.

Unit tests must not call live Neon, Gemini, Resend, Google OAuth or other external services. Mock these dependencies at the boundary and test success, timeout, quota, malformed response and failure cases deterministically.

### 5.3 Component testing — React Testing Library

**Purpose:** Verify that UI components render and respond correctly to user interaction without requiring a full browser journey.

Use the installed React Testing Library dependencies. Use a JSDOM environment for component tests (configure a dedicated Vitest project or file-level environment) and realistic user interactions.

Required component targets:

- Student: `AIAssistantWidget`, `AssignmentsWidget`, `CertificatesWidget`, `ProfileWidget`, `SettingsWidget`, `LearningFamilyWidget`, `HelpDeskModal`, `RightSidebar`, `RunningCourseCard`.
- Workspace: `LearningWorkspace`, `NotesPanel`, `BookmarksPanel`, `DiscussionsPanel`, `QuizAssessment`, `CodingPlayground`, `MarkdownRenderer`.
- Mentor: `MentorAIAssistant`, `AssignmentReviewWidget`, `MentorOverviewWidget`, course-builder/authoring assistant components.
- Admin: `PlatformOverviewWidget`, `UserManagementWidget`, `MentorApprovalWidget`, `GlobalNotificationWidget`, `SystemSettingsWidget`.
- Shared: navigation, forms, modal/dialog, alert, loading, error and empty-state components.

For each component test:

1. Initial/loading state.
2. Successful data state.
3. Empty data state.
4. API failure state.
5. Invalid user input.
6. Disabled/loading button behavior.
7. Keyboard operation and accessible name/role.
8. State update after a successful action.
9. No false success message when the API fails.
10. No sample/fallback record presented as real production data.

Use semantic queries (`getByRole`, `getByLabelText`, `getByText`) rather than fragile CSS selectors wherever possible.

### 5.4 API and service integration testing

**Purpose:** Test actual Next.js route handlers, validation, service logic and database operations together.

Use Vitest with `NextRequest`/`NextResponse` and an isolated PostgreSQL-compatible database. Prefer testing route handlers directly with a real test database and controlled authenticated sessions.

Cover each API route and HTTP method, including:

- Correct success response and status code.
- Missing/invalid authentication.
- Wrong role.
- Cross-user resource access.
- Missing resource and duplicate request.
- Invalid JSON, invalid schema and oversized payload.
- Database constraint failure and transaction rollback.
- Provider or network failure.
- Correct response content type and safe error message.
- No stack trace, secret, token or internal SQL details in public responses.

At least one integration path per role must use real Better Auth session creation/cookies rather than a mocked `requireUser`/`requireAdmin` function. Mocks may be used for focused negative unit tests but must not be the only evidence for access control.

### 5.5 Database and migration testing

**Purpose:** Prove that the application schema is correct and upgrades do not lose user data.

Run tests against PGlite for fast feedback and a disposable real PostgreSQL/Neon staging branch before release.

Required scenarios:

1. Create a fresh empty database and apply migrations in order.
2. Upgrade a database at migration 0002 to the latest migration.
3. Verify `src/server/db/migrations/meta/_journal.json` and snapshot metadata include the correct migration sequence.
4. Verify all schema tables, columns, types, indexes, unique constraints and foreign keys.
5. Verify all four workspace tables:
   - `workspace_notes`
   - `workspace_bookmarks`
   - `workspace_discussions`
   - `workspace_discussion_replies`
6. Verify foreign-key rejection for invalid user, course, lesson and discussion IDs.
7. Verify cascade behavior is intentional and does not delete unrelated data.
8. Verify unique enrollment/progress constraints and duplicate submission handling.
9. Verify transactions roll back on partial failure.
10. Verify migration re-run is a no-op and data remains unchanged.
11. Verify the migration command fails safely when the database is unreachable or configuration is missing.
12. Verify application startup and health endpoint behavior when the database is unavailable.

Important: the production build script runs migrations in production. Preview, CI and staging environments must use their own isolated database URL. Test the build script's environment-selection logic; do not allow a preview build to accidentally migrate production.

### 5.6 End-to-end (E2E) browser testing — Playwright

**Purpose:** Verify critical journeys through the actual browser, deployed Next.js app, API, auth and test database.

The browser suite must assert business outcomes, not merely that the page loaded. Use role-based fixtures, stable accessible selectors and API/database assertions for persisted state.

#### A. Public visitor journeys

- Landing page renders without uncaught browser errors.
- Header, footer, CTA, navigation and in-page links point to valid destinations.
- Public documentation, community, terms and privacy pages open.
- Student and mentor registration/login links navigate correctly.
- Public portfolio loads a known public profile and handles unknown usernames.
- Certificate verification accepts a valid credential and rejects an invalid/revoked credential.
- Responsive navigation works on mobile and does not create horizontal overflow.

#### B. Student journeys

- Register with a unique email; accept terms; verify successful account creation.
- Reject duplicate email, invalid email, weak password and missing required fields.
- Login with correct credentials; reject incorrect credentials; verify session cookie properties.
- Logout invalidates the session and protected endpoints reject the old session.
- Complete onboarding and confirm preferences persist after reload/login.
- Browse published courses; drafts must not be visible to students.
- Enroll in a course and verify enrollment is stored once.
- Open the enrolled course and a valid lesson; reject access to an unentitled/private course where applicable.
- Complete lesson, refresh, and verify progress remains correct.
- Create, edit and delete a note; reload and verify persistence.
- Create/remove a bookmark; reload and verify persistence.
- Create a discussion, reply and vote; verify counts and ownership rules.
- Start and submit a quiz; verify score, pass/fail status and attempt history.
- Start a project, submit valid GitHub/demo URLs and verify mentor review status.
- Submit assignment work; reject unsupported/oversized input and duplicate submissions where prohibited.
- Ask the AI assistant a question; verify response handling, Markdown rendering and conversation persistence.
- When Gemini is unconfigured, show a clear configuration state rather than simulated success.
- Update profile/settings and verify saved data after a new session.
- View certificates and verify only genuinely issued credentials are presented.
- Test notifications, help desk and learning-family actions where those features are enabled.

#### C. Mentor journeys

- Register/apply as a mentor and verify pending approval status.
- Ensure an unapproved mentor cannot access protected mentor capabilities.
- Admin approves a mentor; mentor can then access the authorized portal.
- View only assigned/authorized students and submissions.
- Create/edit a course, module and lesson; save draft; publish; verify student visibility rules.
- Add video, reading, quiz and coding lesson content and verify rendering.
- Review a real test student submission; save score, rubric and feedback.
- Verify the student can see the submitted feedback but cannot change mentor-only grading data.
- Manage mentorship/office-hour sessions and test invalid/overlapping scheduling.
- Use the mentor AI assistant and curriculum authoring assistant, including missing-key and provider-failure behavior.

#### D. Administrator journeys

- Student and mentor roles cannot access admin pages or admin APIs.
- Admin can access only permitted admin functions; super-admin-only actions remain restricted.
- Search, filter and paginate users; handle zero results.
- Change role/suspend/reactivate user; verify audit log and persistence.
- Approve/reject mentor applications and verify the mentor's access changes.
- View accurate platform metrics from the API/database.
- Send a notification/broadcast and verify intended recipients only.
- Update settings and verify persistence after reload.
- Inspect audit logs and verify actor, action, target and timestamp.
- Test system health for database reachable/unreachable conditions.
- Verify empty database and API errors show an explicit empty/error state. **Do not show fabricated fallback users, mentor applications or statistics as if they are production records.**

#### E. Cross-role journey

Run one integrated workflow with separate users:

1. Student registers and enrolls in a published course.
2. Student completes a lesson and submits a project/assignment.
3. Mentor views only the assigned submission and grades it.
4. Student sees the saved grade and feedback.
5. Admin sees the correct updated aggregate and audit event.
6. A second student and unrelated mentor cannot read or modify the first student's private records.

This cross-role journey is a release-critical test.

### 5.7 Authentication, authorization and security testing

**Purpose:** Prove that access control is enforced on the server and user data cannot be read or modified by another account.

Required automated security cases:

- Anonymous request to every protected API returns 401 (or the documented safe equivalent).
- Authenticated user with the wrong role receives 403.
- Student cannot call admin or mentor APIs by changing the URL, HTTP method, body or query parameters.
- Mentor cannot access another mentor's private roster/submissions unless explicitly assigned.
- Student A cannot read/update/delete Student B's notes, bookmarks, discussions, profile, AI conversations, submissions or certificates.
- User registration cannot set `role`, `status`, `isAdmin` or equivalent privileged fields.
- A client-supplied user ID cannot override the user ID from the authenticated session.
- Expired, malformed, revoked and logged-out sessions are rejected.
- Session cookies use secure production attributes (HttpOnly, Secure, appropriate SameSite and path/expiry settings).
- Trusted-origin/CSRF checks reject untrusted origins where applicable.
- Authentication, registration, password reset, resend verification and AI endpoints have suitable rate limits.
- SQL injection payloads are handled as data; ORM queries remain parameterized.
- Stored and reflected XSS payloads do not execute in profiles, discussions, notes, AI messages, course content or Markdown output.
- Markdown code blocks and links cannot inject executable HTML or `javascript:` URLs.
- Open redirect, path traversal, insecure direct object reference and mass-assignment attempts are rejected.
- Server responses and logs do not leak secrets, session tokens, reset tokens, verification tokens, stack traces or raw DB errors.
- Production startup/build fails if the Better Auth secret is missing or a known development fallback is configured.
- Demo seed/bootstrap scripts refuse unsafe default credentials in production.

Automated security tooling to add to CI:

- `npm audit` (review production and development dependency vulnerabilities separately).
- GitHub CodeQL for TypeScript/JavaScript.
- Secret scanning (GitHub secret scanning or Gitleaks).
- Optional Semgrep rules for common web security patterns.
- Dependency update alerts/Dependabot.

Do not expose production credentials to untrusted pull-request jobs.

### 5.8 Accessibility testing

**Target:** WCAG 2.2 AA for primary public and authenticated workflows.

Add `@axe-core/playwright` and run automated axe scans on:

- Landing page.
- Student/mentor login and registration.
- Student dashboard and workspace.
- Mentor dashboard, assignment review and course builder.
- Admin dashboard and user management.
- Important modals, dialogs, menus and forms.

Also test:

- Entire workflow operable by keyboard only.
- Visible focus indicator and logical focus order.
- Dialog focus moves into dialog, remains trapped where appropriate, and returns to trigger on close.
- Form labels, required fields, instructions and errors are programmatically associated.
- Images have appropriate alt text; decorative images are ignored by assistive technology.
- Buttons/links have meaningful accessible names.
- Color contrast meets AA requirements.
- Status is not communicated by color alone.
- Heading hierarchy and landmarks are sensible.
- Reduced-motion preference is respected where animations are non-essential.

Automated axe scans do not replace manual keyboard and screen-reader review. Record any accepted exception with owner, reason and expiry date.

### 5.9 Responsive and cross-browser testing

Run critical journeys at minimum on:

| Profile | Viewport / engine |
|---|---|
| Desktop Chrome | 1440 × 900 |
| Desktop Firefox | 1440 × 900 |
| Desktop WebKit | 1440 × 900 |
| Tablet | 768 × 1024 |
| Mobile Chrome emulation | 390 × 844 or current supported Android profile |
| Mobile WebKit emulation | 390 × 844 or current supported iPhone profile |

Verify:

- No unintended horizontal overflow.
- Navigation, sidebars, dialogs and tables remain usable.
- Forms and buttons fit and remain tappable.
- Workspace video/player and editor panels adapt correctly.
- Sticky headers and scroll containers do not hide content.
- Browser back/forward navigation works.
- No hydration errors, uncaught exceptions or failed critical network requests.

### 5.10 Visual regression testing

Add Playwright screenshot baselines for stable, high-value screens:

- Landing page.
- Student login and registration.
- Student dashboard.
- Learning workspace (video lesson, notes and quiz states).
- Mentor dashboard and assignment review.
- Mentor course builder.
- Admin dashboard and user management.

Capture desktop and mobile snapshots. Use deterministic test data, fixed dates, disabled animations and stable fonts/images. Review screenshot diffs; do not blindly update baselines to make a failing build pass.

Visual tests complement functional assertions. A visually identical page can still be functionally broken.

### 5.11 Performance and load testing

Add Lighthouse CI for key pages and k6 (or an equivalent HTTP load-testing tool) for API traffic.

**Lighthouse pages:** landing, login, public portfolio, student dashboard, learning workspace, mentor dashboard and admin dashboard.

Suggested initial targets (measure on a stable staging deployment and tune based on real traffic):

- Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- No severe bundle-size regression without an explained exception.
- Avoid blocking third-party AI/email services during page rendering.

**k6 scenarios:**

1. Smoke: 1 virtual user for 1 minute.
2. Baseline load: 10–25 virtual users for 5 minutes.
3. Expected launch load: 25–50 concurrent users for 10 minutes (adjust to the planned beta size).
4. Stress: increase load gradually until the system degrades; document the bottleneck.
5. Spike: sudden short burst to validate connection pooling and rate limiting.

Exercise public pages, authentication, course catalog reads, student dashboard reads, workspace read/write and admin read endpoints. Do not load-test real email delivery or paid Gemini calls at scale; stub them or apply strict test quotas.

Suggested initial API target: non-AI read/write endpoints should maintain p95 below 800 ms at the agreed beta load, with an error rate below 1%. Establish a baseline before enforcing this as a hard gate. AI response latency must be measured separately because it depends on an external model provider.

### 5.12 Reliability and failure-mode testing

Simulate:

- Neon/database unavailable, connection timeout and pool exhaustion.
- Gemini missing key, 429 quota response, 5xx, timeout, malformed result and interrupted stream.
- Resend outage, invalid sender and rejected recipient.
- Slow network, offline state, request cancellation and repeated submit clicks.
- Expired session during form submission.
- Duplicate request/retry after a timeout.
- Partial transaction failure.

Expected behavior:

- Show a clear, recoverable error state.
- Never show a success notification when the operation failed.
- Avoid duplicate submissions, duplicate notifications or duplicate grading actions.
- Preserve unsent user input where safe.
- Do not expose provider credentials or internal exception messages.
- Retry only safe/idempotent operations or use idempotency keys.
- Never replace failed production data with fabricated fallback data.

### 5.13 AI feature and prompt-quality testing

AI functionality needs both deterministic automated tests and a small, controlled live-provider evaluation.

**Deterministic tests (every PR):**

- No API key: report that AI is not configured; do not return a fake answer as a real model response.
- Configured provider: provider adapter receives the correct model, system instructions and user prompt.
- Provider timeout, quota exceeded, rate limiting and 5xx: safe error behavior.
- Streaming: chunks render in order; cancellation stops the stream; partial output is not incorrectly marked complete.
- Conversation history is scoped to its owner and persists correctly.
- Code review output follows the agreed response schema and handles invalid model output safely.
- Prompt injection attempts cannot reveal system instructions, secrets or another user's data.
- Sensitive user input is not written to logs unnecessarily.

**QbitX AI quality evaluation set:** maintain versioned, anonymized prompts covering:

- Beginner programming and logic questions.
- C/C++/Java/Python fundamentals.
- Data structures, algorithms and Big-O explanations.
- Debugging and code review.
- SQL/database design.
- Next.js/React/TypeScript questions.
- Project planning and Git workflows.
- Beginner-friendly explanations and follow-up hints.
- Bangla and English queries if both are supported by product requirements.
- Unsafe or irrelevant prompts, prompt-injection attempts and requests for private data.

Evaluate correctness, relevance, clarity, pedagogical quality, code validity, response length, safe refusal and citation/link validity where links are generated. Use a rubric and human review for model-quality changes; do not rely on exact string snapshots for nondeterministic AI text.

**Live AI tests:** run manually or on a scheduled protected workflow with a dedicated Gemini key and strict quota. Never run paid live-model tests on every untrusted PR.

### 5.14 Markdown renderer testing

The latest branch introduces a custom Markdown renderer for student, mentor and authoring AI messages. Test it independently:

- Headings, paragraphs, bold/italic, lists, inline code and fenced code.
- Language label and code formatting.
- Copy button copies exactly the code block and reports success/failure accurately.
- Long code blocks, empty blocks and malformed/unclosed fences.
- Streaming content that ends midway through Markdown syntax.
- Unicode and Bangla text.
- HTML/script payloads are rendered inert, never executed.
- `javascript:` and unsafe links are blocked or rendered as plain text.
- Very large input is bounded to avoid UI freezes.

### 5.15 SEO, routing and public-page smoke tests

- Important public routes return the correct status and page metadata.
- Canonical URLs, title and description are present where required.
- Sitemap/robots behavior is correct if configured.
- Unknown route returns a real 404 page, not a misleading successful content page.
- Protected routes redirect or return an authorization response as designed.
- Internal links do not point to `#` unless the control is intentionally non-navigational.
- No broken images, missing fonts or critical console errors.

---

## 6. Test coverage matrix by product area

| Product area | Unit | Component | API/DB integration | E2E | Security | A11y/visual |
|---|---:|---:|---:|---:|---:|---:|
| Public site and navigation | Yes | Yes | — | Yes | Basic | Yes |
| Registration, login, logout and verification | Yes | Yes | Yes | Yes | Critical | Yes |
| Student profile and onboarding | Yes | Yes | Yes | Yes | Critical | Yes |
| Course catalog and enrollment | Yes | Yes | Yes | Yes | Critical | Yes |
| Learning workspace and progress | Yes | Yes | Yes | Yes | Critical | Yes |
| Notes, bookmarks and discussions | Yes | Yes | Yes | Yes | Critical | Yes |
| Quizzes and assessments | Yes | Yes | Yes | Yes | High | Yes |
| Project and assignment submissions | Yes | Yes | Yes | Yes | Critical | Yes |
| AI chat and code review | Yes | Yes | Yes | Yes | Critical | Yes |
| Mentor portal and grading | Yes | Yes | Yes | Yes | Critical | Yes |
| Admin portal and user management | Yes | Yes | Yes | Yes | Critical | Yes |
| Certificates and verification | Yes | Yes | Yes | Yes | High | Yes |
| Notifications/help desk/community | Yes | Yes | Yes | Yes | High | Yes |
| Database migrations and health | Yes | — | Critical | Smoke | Critical | — |
| External services | Yes (mock) | Yes | Contract | Selected | High | — |

A dash means a test type is usually not the primary verification mechanism for that area; it does not mean the area is exempt from quality review.

---

## 7. Recommended test code organization

Keep the existing test structure and add clear separation as coverage expands:

```text
src/tests/
  unit/
    ai.test.ts
    permissions.test.ts
    progress.test.ts
    validation.test.ts
    services/
  components/
    student/
    mentor/
    admin/
    workspace/
    shared/
  integration/
    ai-service.test.ts
    api-security.test.ts
    auth-security.test.ts
    database.test.ts
    health.test.ts
    journeys.test.ts
    migrations.test.ts
    routes/
  fixtures/
    users.ts
    courses.ts
    projects.ts
    submissions.ts
    sessions.ts
  helpers/
    database.ts
    auth.ts
    factories.ts
    cleanup.ts

e2e/
  public.spec.ts
  auth.spec.ts
  student.spec.ts
  workspace.spec.ts
  mentor.spec.ts
  admin.spec.ts
  cross-role.spec.ts
  accessibility.spec.ts
  visual.spec.ts
  fixtures/
    test.ts
    accounts.ts
    data.ts

performance/
  k6-smoke.js
  k6-load.js
  k6-stress.js

.github/
  workflows/
    quality-gate.yml
```

Do not create duplicate test files if an equivalent reliable suite already exists. Refactor existing files where appropriate and preserve existing coverage.

---

## 8. Coverage goals and quality gates

Coverage is a diagnostic measure, not a substitute for meaningful assertions. Add the matching Vitest coverage provider (for example, `@vitest/coverage-v8` compatible with the installed Vitest major) before enabling coverage reporting.

Suggested targets:

| Scope | Initial target |
|---|---:|
| Overall statements/lines | ≥ 80% |
| Overall functions | ≥ 80% |
| Overall branches | ≥ 75% |
| Authorization, validation and core business services | ≥ 90% |
| Critical API route behavior | 100% of documented success/denial/error cases |

Exclude only generated files, declarations, migrations and other justified non-executable artifacts. Do not exclude difficult business logic simply to raise the percentage.

### 8.1 Pull request blocking gates

A pull request must not merge unless all applicable gates pass:

- [ ] `npm ci` succeeds on a clean runner.
- [ ] TypeScript check passes.
- [ ] ESLint passes; no new warnings are introduced without justification.
- [ ] Unit and integration tests pass.
- [ ] Database migration tests pass from empty and previous-version schemas.
- [ ] Critical API authentication/authorization and ownership tests pass.
- [ ] Critical Playwright student, mentor, admin and cross-role journeys pass.
- [ ] Accessibility scan has no unresolved critical/serious violations on critical flows.
- [ ] No high/critical dependency or secret-scanning findings remain unresolved.
- [ ] Production build passes.
- [ ] Visual diffs are reviewed when visual baselines change.

### 8.2 Pre-release gates

Before production promotion:

- [ ] Full cross-browser and responsive suite passes.
- [ ] Neon staging migration upgrade passes and data preservation is verified.
- [ ] Staging smoke suite passes using production-like environment configuration.
- [ ] Lighthouse/Core Web Vitals checks meet agreed budgets or have approved exceptions.
- [ ] Load test meets the agreed beta traffic profile.
- [ ] AI live smoke evaluation passes with the configured provider, where AI is enabled.
- [ ] Production secrets and environment variables are reviewed.
- [ ] Backup/restore and migration rollback/recovery procedure is documented and rehearsed.
- [ ] Post-deployment smoke tests pass.

Any unresolved P0 issue blocks release. P0 includes privilege escalation, cross-user data exposure, missing production tables, data loss, unsafe secret handling and broken sign-in for legitimate users.

---

## 9. CI pipeline design

Create a GitHub Actions workflow such as `.github/workflows/quality-gate.yml` triggered on pull requests to `main` and pushes to `main`.

Recommended jobs:

1. **Install and static checks:** `npm ci`, typecheck, lint.
2. **Unit/component tests:** Vitest, coverage report and artifact upload.
3. **Database integration:** isolated PGlite/PostgreSQL, migration and API integration tests.
4. **Build:** production build using safe test-only variables; never production database secrets.
5. **Browser E2E:** build app, install Playwright browsers, run critical suites; upload HTML report, traces and screenshots on failure.
6. **Security:** dependency audit, CodeQL and secret scanning.
7. **Accessibility:** axe scans on critical routes.
8. **Visual regression:** compare approved Playwright screenshots.
9. **Scheduled/nightly:** extended browser matrix, Lighthouse and k6 load tests; live Gemini tests only in a protected, quota-controlled workflow.

Use job dependencies so the pull request receives one clear quality result. Cache dependencies safely, pin actions to reviewed versions, apply least-privilege token permissions, and do not expose secrets to forked pull requests.

No workflow should deploy to production as a side effect of running tests. Production deployment must remain a separate controlled stage.

---

## 10. Local execution guide

Run from the repository root on a clean checkout:

```bash
# 1. Install exactly from the lockfile
npm ci

# 2. Static checks
npm run typecheck
npm run lint

# 3. Unit and integration tests
npm test

# 4. Build the production application
npm run build

# 5. Install the Playwright browser needed by the current configuration
npx playwright install chromium

# 6. Browser tests (the current Playwright config starts `next start` on port 3007)
npm run test:e2e
```

The current Playwright web server runs `next start`, so build the app before running E2E tests. The existing config uses port `3007` and sets `ALLOW_PGLITE_TEST=true` for the test web server.

When Firefox/WebKit projects are added:

```bash
npx playwright install chromium firefox webkit
```

When a compatible Vitest coverage provider is installed and a `test:coverage` script is added:

```bash
npm run test:coverage
```

When axe and accessibility tests are added:

```bash
npm run test:e2e -- --grep @accessibility
```

When visual projects are added:

```bash
npm run test:e2e -- --grep @visual
```

Do not run performance tests against production without explicit authorization. Use staging and controlled test traffic.

---

## 11. Test reporting requirements

Every test run used as release evidence must record:

- Commit SHA and branch.
- Date/time and environment.
- Node and npm versions.
- Exact command and exit code.
- Passed/failed/skipped test counts.
- Coverage percentages and uncovered critical files.
- Browser/device project results.
- Failed test names and linked traces/screenshots.
- Database migration starting version and ending version.
- Any external service that was mocked versus tested live.
- Open defects, severity, owner and release decision.

Required artifacts where applicable:

- Vitest coverage HTML/LCOV.
- Playwright HTML report, trace and failure screenshots.
- Lighthouse JSON/HTML report.
- k6 summary output.
- Dependency/security scan reports.
- Migration verification output.

Never report a test as passed because the route returned 200, the page body existed, a mock returned success, or a test was skipped. Report skipped tests explicitly.

---

## 12. Priority execution roadmap

### Phase 1 — Trustworthy baseline (must complete first)

- Verify clean `npm ci` on the latest PR commit.
- Re-run current unit/integration/E2E suites.
- Review and improve weak E2E assertions that only check body visibility or URL.
- Verify real Better Auth sessions and role ownership in at least one integration/browser workflow per role.
- Verify production-like migration behavior on isolated PostgreSQL/Neon staging.
- Add tests preventing fabricated fallback data from masquerading as live records.
- Add GitHub Actions required checks.

### Phase 2 — Functional depth

- Add component tests for high-use student, mentor, admin and workspace widgets.
- Expand API route tests for every protected route and HTTP method.
- Complete student, mentor, admin and cross-role E2E journeys.
- Add Markdown renderer and AI failure-mode tests.
- Add test coverage thresholds for critical business logic.

### Phase 3 — Non-functional quality

- Add accessibility scans and keyboard navigation tests.
- Add visual regression baselines.
- Add Firefox/WebKit and additional viewport coverage.
- Add Lighthouse CI and k6 staging tests.
- Add dependency, secret and CodeQL scans.

### Phase 4 — Release certification

- Execute full staging regression.
- Review migration and recovery procedure.
- Verify environment secrets and production data sources.
- Run safe post-deployment smoke tests.
- Publish a release test report with the exact commit SHA.

---

## 13. Definition of done

QbitX is considered adequately tested for a controlled release only when:

1. The automated tests cover core business logic, major UI components, protected API routes, database migrations and critical browser journeys.
2. Student, mentor and admin workflows prove actual persistence and role isolation.
3. Critical tests use a real test database and real application authentication at least at integration/E2E level.
4. AI, email and database failures are handled honestly and safely.
5. Sample/demo fallback data cannot be mistaken for real production data.
6. Accessibility, browser compatibility, performance and security checks have recorded results.
7. CI runs the required test gates on every pull request.
8. `npm ci`, typecheck, lint, tests and production build pass on the exact candidate commit.
9. Staging migration and smoke tests pass before production promotion.
10. The release report identifies what was mocked, what was tested live, what was skipped and all remaining risks.

**Final principle:** Test the behavior users depend on, the data they trust, and the security boundaries that protect them. A green build is only the beginning of release confidence.
