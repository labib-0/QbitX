import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "../db";

// Vercel exposes the stable production hostname and the per-deployment hostname.
// Without these, a deployment without BETTER_AUTH_URL would sign sessions for
// localhost and reject the real origin, breaking registration and login.
const vercelOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
]
  .filter((host): host is string => Boolean(host))
  .map((host) => (host.startsWith("http") ? host : `https://${host}`));

const configuredAppUrl =
  process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

const appBaseURL =
  configuredAppUrl ||
  vercelOrigins[0] ||
  "http://localhost:3000";

const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3007",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3007",
      configuredAppUrl,
      process.env.NEXT_PUBLIC_APP_URL,
      ...vercelOrigins,
    ].filter((origin): origin is string => Boolean(origin))
  )
);

if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
  console.warn(
    "[QbitX Auth] BETTER_AUTH_SECRET is not set. Sessions are signed with the development fallback; set a strong secret in your deployment environment."
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }) => {
      if (process.env.RESEND_API_KEY) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "QbitX <no-reply@qbitx.com>",
              to: user.email,
              subject: "Reset your QbitX password",
              html: `<p>Click here to reset your password: <a href="${url}">${url}</a></p>`,
            }),
          });
        } catch (err) {
          console.error("Failed to send reset password email via Resend:", err);
        }
      } else {
        console.log(`[QbitX Auth] Password reset link generated for ${user.email}: ${url} (Token: ${token})`);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      if (process.env.RESEND_API_KEY) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "QbitX <no-reply@qbitx.com>",
              to: user.email,
              subject: "Verify your QbitX email",
              html: `<p>Click here to verify your email address: <a href="${url}">${url}</a></p>`,
            }),
          });
        } catch (err) {
          console.error("Failed to send email verification via Resend:", err);
        }
      } else {
        console.log(`[QbitX Auth] Email verification link generated for ${user.email}: ${url} (Token: ${token})`);
      }
    },
    sendOnSignUp: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
        input: false, // Prevents client from escalating role via registration payload
      },
      status: {
        type: "string",
        defaultValue: "active",
        input: false,
      },
    },
  },
  rateLimit: {
    enabled: process.env.NODE_ENV === "production" && process.env.ALLOW_PGLITE_TEST !== "true",
  },
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-32-chars-minimum-qbitx-edtech-platform",
  baseURL: appBaseURL,
  trustedOrigins,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
