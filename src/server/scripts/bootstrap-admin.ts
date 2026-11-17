import { db, schema } from "../db";
import { ensureDbSchema } from "../db/init";
import { auth } from "../auth";
import { eq } from "drizzle-orm";

export async function bootstrapAdmin() {
  console.log("🔐 Starting QbitX Super Admin Bootstrap...");
  await ensureDbSchema();

  const email = process.env.INITIAL_ADMIN_EMAIL || "admin@qbitx.com";
  const password = process.env.INITIAL_ADMIN_PASSWORD || "AdminPassword123!";
  const name = process.env.INITIAL_ADMIN_NAME || "System Super Admin";

  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));

  if (existing.length > 0) {
    // Elevate role to super_admin
    await db
      .update(schema.users)
      .set({
        role: "super_admin",
        status: "active",
        emailVerified: true,
      })
      .where(eq(schema.users.email, email));

    console.log(`✅ Existing user '${email}' promoted to 'super_admin'.`);
    return;
  }

  // Create via Better Auth API
  try {
    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (newUser?.user?.id) {
      await db
        .update(schema.users)
        .set({
          role: "super_admin",
          emailVerified: true,
        })
        .where(eq(schema.users.id, newUser.user.id));

      console.log(`✅ Initial Super Admin '${email}' successfully created and promoted!`);
    }
  } catch (err: any) {
    console.error("Error creating super admin:", err.message || err);
  }
}

if (process.argv[1]?.endsWith("bootstrap-admin.ts")) {
  bootstrapAdmin().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
