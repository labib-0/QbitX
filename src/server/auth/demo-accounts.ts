import { db, schema } from "../db";
import { ensureDbSchema } from "../db/init";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

export interface DemoAccountConfig {
  email: string;
  password: string;
  name: string;
  role: "student" | "mentor" | "super_admin";
  redirectUrl: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccountConfig> = {
  student: {
    email: "student@qbitx.com",
    password: "password123",
    name: "Jeifer Gomes",
    role: "student",
    redirectUrl: "/student/dashboard",
  },
  mentor: {
    email: "mentor@qbitx.com",
    password: "password123",
    name: "Dr. Kamal Hossain",
    role: "mentor",
    redirectUrl: "/mentor/dashboard",
  },
  admin: {
    email: "admin@qbitx.com",
    password: "password123",
    name: "Platform Administrator",
    role: "super_admin",
    redirectUrl: "/admin/dashboard",
  },
};

const DEMO_EMAILS = new Set([
  "admin@qbitx.com",
  "mentor@qbitx.com",
  "student@qbitx.com",
  "sarah.chen@qbitx.com",
  "jeifer.gomes@qbitx.com",
]);

const ACCEPTED_DEMO_PASSWORDS = new Set([
  "password123",
  "AdminPassword123!",
  "MentorPassword123!",
  "StudentPassword123!",
  "StudentSecurePass123!",
]);

export async function syncDemoCredentialsOnAttempt(email: string, password: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!DEMO_EMAILS.has(normalizedEmail)) return;
  if (!ACCEPTED_DEMO_PASSWORDS.has(password) && password !== "password123") return;

  await ensureDemoAccounts();

  // If this email is sarah.chen@qbitx.com, ensure she exists as approved mentor
  if (normalizedEmail === "sarah.chen@qbitx.com") {
    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "sarah.chen@qbitx.com"))
      .limit(1);

    const hash = await hashPassword(password);
    let uid = "usr-mentor-sarah";

    if (existing.length === 0) {
      await db.insert(schema.users).values({
        id: uid,
        name: "Sarah Chen",
        email: "sarah.chen@qbitx.com",
        emailVerified: true,
        role: "mentor",
        status: "active",
      });
      await db.insert(schema.accounts).values({
        id: `acc-sarah-${Date.now()}`,
        userId: uid,
        accountId: uid,
        providerId: "credential",
        password: hash,
      });
      await db.insert(schema.mentorProfiles).values({
        id: `mp-sarah-${Date.now()}`,
        userId: uid,
        fullName: "Sarah Chen",
        isApproved: true,
      });
    } else {
      uid = existing[0].id;
      await db
        .update(schema.accounts)
        .set({ password: hash })
        .where(eq(schema.accounts.userId, uid));
    }
    return;
  }

  // Update password in schema.accounts to match the attempted valid demo password
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizedEmail))
    .limit(1);

  if (user) {
    const hash = await hashPassword(password);
    await db
      .update(schema.accounts)
      .set({ password: hash })
      .where(eq(schema.accounts.userId, user.id));
  }
}

/**
 * Ensures all three demo accounts exist in the database with password123,
 * verified email, correct roles, and associated profiles.
 */
export async function ensureDemoAccounts(): Promise<void> {
  await ensureDbSchema();
  const commonPassword = "password123";
  const hashedPassword = await hashPassword(commonPassword);

  for (const [key, config] of Object.entries(DEMO_ACCOUNTS)) {
    try {
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, config.email))
        .limit(1);

      let userId: string;

      if (existingUser.length === 0) {
        userId = `usr-demo-${key}-${Date.now()}`;
        await db.insert(schema.users).values({
          id: userId,
          name: config.name,
          email: config.email,
          emailVerified: true,
          role: config.role,
          status: "active",
          image:
            config.role === "mentor"
              ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              : config.role === "super_admin"
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
        });

        // Insert credential account
        await db.insert(schema.accounts).values({
          id: `acc-demo-${key}-${Date.now()}`,
          userId: userId,
          accountId: userId,
          providerId: "credential",
          password: hashedPassword,
        });
      } else {
        userId = existingUser[0].id;
        // Update user name, role, emailVerified
        await db
          .update(schema.users)
          .set({
            name: config.name,
            role: config.role,
            emailVerified: true,
            status: "active",
          })
          .where(eq(schema.users.id, userId));

        // Update or insert password in accounts
        const existingAccount = await db
          .select()
          .from(schema.accounts)
          .where(eq(schema.accounts.userId, userId))
          .limit(1);

        if (existingAccount.length === 0) {
          await db.insert(schema.accounts).values({
            id: `acc-demo-${key}-${Date.now()}`,
            userId: userId,
            accountId: userId,
            providerId: "credential",
            password: hashedPassword,
          });
        } else {
          await db
            .update(schema.accounts)
            .set({ password: hashedPassword })
            .where(eq(schema.accounts.id, existingAccount[0].id));
        }
      }

      // Configure Mentor Profile if mentor
      if (config.role === "mentor") {
        const existingMentorProfile = await db
          .select()
          .from(schema.mentorProfiles)
          .where(eq(schema.mentorProfiles.userId, userId))
          .limit(1);

        if (existingMentorProfile.length === 0) {
          await db.insert(schema.mentorProfiles).values({
            id: `mp-demo-${userId}`,
            userId: userId,
            fullName: config.name,
            headline: "Principal AI Architect & Senior Faculty Mentor (ex-BUET CSE)",
            company: "QbitX Engineering Academy",
            companyOrUniversity: "Bangladesh University of Engineering and Technology (BUET)",
            yearsOfExperience: 12,
            isApproved: true,
            rating: "4.95",
            reviewCount: 38,
            availabilityStatus: "available",
            expertise: [
              "Next.js App Architecture",
              "Bengali NLP & LLM Systems",
              "Distributed Cloud Backends",
              "System Design",
            ],
            skills: ["TypeScript", "Python", "PyTorch", "PostgreSQL", "Docker", "Kubernetes"],
            bio: "Guiding high-impact student engineers in building production systems, AI pipelines, and distributed architecture.",
          });
        } else {
          await db
            .update(schema.mentorProfiles)
            .set({
              fullName: config.name,
              isApproved: true,
              availabilityStatus: "available",
            })
            .where(eq(schema.mentorProfiles.userId, userId));
        }
      }

      // Configure Student Profile if student
      if (config.role === "student") {
        const existingStudentProfile = await db
          .select()
          .from(schema.studentProfiles)
          .where(eq(schema.studentProfiles.userId, userId))
          .limit(1);

        if (existingStudentProfile.length === 0) {
          await db.insert(schema.studentProfiles).values({
            id: `sp-demo-${userId}`,
            userId: userId,
            university: "Notre Dame University Bangladesh (NDUB)",
            department: "Computer Science & Engineering (CSE)",
            studentId: "CSE-2022-089",
            academicYear: "3rd Year (6th Semester)",
            track: "Full-Stack Web & AI Engineering",
            experienceLevel: "Intermediate Full-Stack",
            city: "Dhaka",
            country: "Bangladesh",
            phone: "+880 1712-345678",
          });
        }
      }
    } catch (err) {
      console.error(`[QbitX Demo Provisioner] Error configuring account ${config.email}:`, err);
    }
  }

  // Also provision jeifer.gomes@qbitx.com as alias for student
  try {
    const existingJeifer = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "jeifer.gomes@qbitx.com"))
      .limit(1);

    if (existingJeifer.length === 0) {
      const jId = `usr-demo-jeifer-${Date.now()}`;
      await db.insert(schema.users).values({
        id: jId,
        name: "Jeifer Gomes",
        email: "jeifer.gomes@qbitx.com",
        emailVerified: true,
        role: "student",
        status: "active",
      });
      await db.insert(schema.accounts).values({
        id: `acc-demo-jeifer-${Date.now()}`,
        userId: jId,
        accountId: jId,
        providerId: "credential",
        password: hashedPassword,
      });
    }
  } catch {
    // Non-blocking
  }
}
