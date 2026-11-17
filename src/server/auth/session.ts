import { headers } from "next/headers";
import { auth, User, Session } from "./index";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required. Please log in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Access denied. Insufficient permissions.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export type PlatformRole = "student" | "mentor" | "admin" | "super_admin";

export interface AuthenticatedContext {
  session: Session["session"];
  user: User & { role: PlatformRole; status: string };
}

/**
 * Retrieve current authenticated session from server request headers
 */
export async function getServerSession(): Promise<AuthenticatedContext | null> {
  try {
    const reqHeaders = await headers();
    const result = await auth.api.getSession({ headers: reqHeaders });
    if (!result || !result.user) return null;
    return result as AuthenticatedContext;
  } catch (error) {
    return null;
  }
}

/**
 * Enforce authentication: throws UnauthorizedError (401) if not logged in or suspended
 */
export async function requireUser(): Promise<AuthenticatedContext> {
  const context = await getServerSession();
  if (!context) {
    throw new UnauthorizedError();
  }
  if (context.user.status === "suspended") {
    throw new ForbiddenError("Your account has been suspended. Please contact platform administration.");
  }
  return context;
}

/**
 * Enforce role authorization: throws ForbiddenError (403) if role not in allowedRoles
 */
export async function requireRole(allowedRoles: PlatformRole[]): Promise<AuthenticatedContext> {
  const context = await requireUser();
  if (!allowedRoles.includes(context.user.role)) {
    throw new ForbiddenError(`Role '${context.user.role}' is not authorized for this resource.`);
  }
  return context;
}

/**
 * Enforce administrator access (admin or super_admin)
 */
export async function requireAdmin(): Promise<AuthenticatedContext> {
  return requireRole(["admin", "super_admin"]);
}

/**
 * Enforce mentor access (mentor, admin, or super_admin)
 */
export async function requireMentor(): Promise<AuthenticatedContext> {
  return requireRole(["mentor", "admin", "super_admin"]);
}

/**
 * Enforce resource ownership: prevents IDOR.
 * Allows resource owner, or administrative roles.
 */
export async function requireOwnership(resourceOwnerId: string): Promise<AuthenticatedContext> {
  const context = await requireUser();
  if (context.user.role === "admin" || context.user.role === "super_admin") {
    return context; // Admin override
  }
  if (context.user.id !== resourceOwnerId) {
    throw new ForbiddenError("You do not own this resource.");
  }
  return context;
}
