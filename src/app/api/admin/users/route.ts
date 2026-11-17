import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, ilike, sql, desc } from "drizzle-orm";
import { z } from "zod";

const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["student", "mentor", "admin", "super_admin"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let query = db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        status: schema.users.status,
        image: schema.users.image,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(schema.users.name, `%${search}%`),
          ilike(schema.users.email, `%${search}%`)
        )
      );
    }
    if (role) {
      conditions.push(eq(schema.users.role, role));
    }
    if (status) {
      conditions.push(eq(schema.users.status, status));
    }

    const usersList = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(schema.users.createdAt))
      : await query.orderBy(desc(schema.users.createdAt));

    return NextResponse.json({
      success: true,
      data: usersList,
      total: usersList.length,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminContext = await requireAdmin();
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    // 1. Fetch target user
    const targetUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, validated.userId));

    const targetUser = targetUsers[0];
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 2. Strict Privilege Boundary Checks
    const isCallerSuperAdmin = adminContext.user.role === "super_admin";

    // Non-super-admins cannot alter super_admin accounts
    if (targetUser.role === "super_admin" && !isCallerSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Only Super Administrators can modify a Super Admin account." },
        { status: 403 }
      );
    }

    // Non-super-admins cannot promote anyone to super_admin
    if (validated.role === "super_admin" && !isCallerSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Only Super Administrators can grant the Super Admin role." },
        { status: 403 }
      );
    }

    // 3. Perform update
    const updateFields: any = { updatedAt: new Date() };
    if (validated.role) updateFields.role = validated.role;
    if (validated.status) updateFields.status = validated.status;

    const [updated] = await db
      .update(schema.users)
      .set(updateFields)
      .where(eq(schema.users.id, validated.userId))
      .returning();

    // 4. Record Audit Log
    await db.insert(schema.auditLogs).values({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actorId: adminContext.user.id,
      action: "USER_ROLE_OR_STATUS_UPDATE",
      actionType: "USER_ROLE_OR_STATUS_UPDATE",
      targetId: validated.userId,
      ipAddress: request.headers.get("x-forwarded-for") || "internal",
      details: {
        previousRole: targetUser.role,
        newRole: validated.role || targetUser.role,
        previousStatus: targetUser.status,
        newStatus: validated.status || targetUser.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User privileges and status updated successfully",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
