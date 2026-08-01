# QbitX UI Component Specifications & Library Guide (RC-1)

Overview of reusable UI components across Student, Mentor, and Admin portals.

---

## 1. Layout & Navigation Components

### `TopNavbar` (`src/components/student-dashboard/TopNavbar.tsx`)
- **Purpose**: Master header for Student Portal.
- **Features**: Brand logo, Omnibox `Ctrl+K` search trigger, notification popover with live badges, profile avatar menu, theme toggle, and `GuidedOnboardingTour` trigger.

### `MentorTopNavbar` (`src/components/mentor-dashboard/MentorTopNavbar.tsx`)
- **Purpose**: Master header for Mentor Portal.
- **Features**: Verified mentor badge, search omnibox, notification popover, profile pill, and mentor onboarding launcher.

### `AdminTopNavbar` (`src/components/admin-dashboard/AdminTopNavbar.tsx`)
- **Purpose**: Executive header for Admin Portal.
- **Features**: System status operational pill (99.98%), search omnibox, security alerts, and admin onboarding launcher.

---

## 2. Reusable UI Controls & Skeletons

### `GlobalOmniboxSearch` (`src/components/search/GlobalOmniboxSearch.tsx`)
- **Purpose**: Global `Ctrl+K` omnibox search modal.
- **Features**: Searches Courses, Lessons, Assignments, Teams, Students, Mentors, Resources, and Certificates with instant keyboard navigation.

### `GuidedOnboardingTour` (`src/components/onboarding/GuidedOnboardingTour.tsx`)
- **Purpose**: Role-specific first-time interactive walkthrough modal.
- **Props**: `role: "student" | "mentor" | "admin"`.

### `SkeletonLoaders` (`src/components/ui/SkeletonLoaders.tsx`)
- **Purpose**: Glassmorphism fallback shimmer loaders (`CardSkeleton`, `TableRowSkeleton`, `ProfileDrawerSkeleton`).
