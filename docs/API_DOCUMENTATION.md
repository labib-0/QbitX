# QbitX API Endpoint Catalog (RC-1)

Complete documentation of all 23 server-side API routes under `src/app/api/`.

---

## 1. Content Architecture APIs (`/api/content/*`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/content/tracks` | GET | All Roles | Fetch learning tracks hierarchy. |
| `/api/content/courses` | GET | All Roles | Retrieve course list or single course by ID/slug. |
| `/api/content/modules` | GET | All Roles | Retrieve modules for a course. |
| `/api/content/lessons` | GET | All Roles | Retrieve lesson activities. |
| `/api/content/activities` | GET | All Roles | Retrieve activity details (video, coding lab, reading). |
| `/api/content/progress` | GET / POST | Student / Mentor | Fetch or update student progress. |
| `/api/content/resources` | GET | All Roles | Fetch downloadable lab resources & code starters. |
| `/api/content/search` | GET | All Roles | Search course content. |
| `/api/content/builder` | POST / PUT | Mentor / Admin | Author, update, or publish course content. |

---

## 2. Workspace & AI APIs (`/api/workspace/*`, `/api/ai/*`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/ai/chat` | POST | Student / Mentor | Stream AI Mentor chat response with simulated multi-stage thinking. |
| `/api/workspace/notes` | GET / POST | Student | Manage student private notes. |
| `/api/workspace/bookmarks` | GET / POST | Student | Manage workspace lesson bookmarks. |
| `/api/workspace/discussions` | GET / POST | Student / Mentor | Post & view class discussion threads. |
| `/api/workspace/events` | GET | Student | Fetch upcoming live coding sessions & office hours. |

---

## 3. Automation Engine APIs (`/api/automation/*`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/automation/events` | POST | System / Admin | Publish platform events to Central EventBus. |
| `/api/automation/jobs` | GET / POST | System / Admin | Fetch scheduled cron job statuses or trigger manual execution. |
| `/api/automation/rules` | GET | Admin | Retrieve active workflow rules and execution audit logs. |
