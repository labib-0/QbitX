# Database Schema Migrations & Rollback Strategy

Guide for executing database migrations and schema rollbacks in QbitX.

---

## 1. Migration Execution Workflow

QbitX uses SQL migration scripts stored under `supabase/migrations/` or Supabase CLI.

### Running Migrations locally:
```bash
# Apply pending database migrations
npx supabase migration up

# Check migration status
npx supabase db remote changes
```

---

## 2. Schema Rollback Strategy

Every migration script includes a corresponding down migration script:

```sql
-- Migration: 20260801_create_audit_logs.sql
CREATE TABLE audit_logs (...);

-- Down Migration: 20260801_create_audit_logs_down.sql
DROP TABLE IF EXISTS audit_logs;
```

To rollback a migration:
```bash
npx supabase db reset
```
