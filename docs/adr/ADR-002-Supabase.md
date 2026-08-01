# ADR-002: Supabase & Relational PostgreSQL Data Layer

- **Status**: Accepted
- **Date**: 2026-08-01
- **Deciders**: QbitX Architecture Team

---

## Problem
QbitX needs a reliable authentication engine, database schema, and Row-Level Security (RLS) policies for user accounts and learning metrics.

---

## Options Considered
1. **Custom Express + Auth JWT + MongoDB**: Requires building custom auth token refresh logic and manual database management.
2. **Firebase Auth + Firestore**: NoSQL document store makes relational data queries (Track -> Course -> Module -> Lesson -> Submission) difficult.
3. **Supabase (Auth + PostgreSQL / TiDB)**: Provides built-in Auth, JWT session handling, SQL relational data queries, and typed client SDKs.

---

## Decision
Adopt **Supabase Auth and Relational Database Layer**.

---

## Consequences
- **Positive**:
  - Out-of-the-box user authentication and session management.
  - Relational SQL queries for complex course hierarchies and audit streams.
- **Negative / Trade-offs**:
  - Requires fallback in-memory adapters for offline demo environments.
