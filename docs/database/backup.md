# Database Backup, Disaster Recovery & Restore Strategy

Guide for automated database backups and disaster recovery.

---

## 1. Automated Backup Schedule

- **Daily Backups**: Automated daily snapshot at 02:00 UTC with 30-day retention.
- **Point-in-Time Recovery (PITR)**: Supabase Pro tier enables 7-day continuous WAL logging for point-in-time recovery.

---

## 2. Manual Backup & Restore Procedures

### Export Database Dump:
```bash
pg_dump -h db.supabase.co -U postgres -d postgres -F c -b -v -f qbitx_backup.dump
```

### Restore Database Dump:
```bash
pg_restore -h db.supabase.co -U postgres -d postgres -v qbitx_backup.dump
```
