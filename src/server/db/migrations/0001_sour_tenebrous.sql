ALTER TABLE "audit_logs" ALTER COLUMN "actor_name" SET DEFAULT 'System';--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "actor_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "actor_role" SET DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "actor_role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "details" SET DATA TYPE jsonb USING CASE WHEN details IS NULL OR details = '' THEN '{}'::jsonb ELSE to_jsonb(details) END;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "details" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "action" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "headline" text;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "hourly_rate" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "rating" text DEFAULT '5.0';--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "link" text;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb;