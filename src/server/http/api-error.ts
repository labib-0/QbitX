import { NextResponse } from "next/server";

const GENERIC_SERVER_ERROR = "An unexpected server error occurred. Please try again.";
const GENERIC_CLIENT_ERROR = "Invalid request.";

/**
 * Log the real failure server-side and return a generic 5xx body.
 *
 * API routes must never echo driver/connection/auth internals to clients:
 * error messages can contain connection strings, SQL, or stack details.
 */
export function internalErrorResponse(error: unknown, context: string) {
  console.error(`[api:${context}] unhandled error:`, error);

  return NextResponse.json(
    { success: false, error: GENERIC_SERVER_ERROR },
    { status: 500, headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Same contract for malformed/unexpected 400 paths where the caught error
 * message would otherwise be reflected back to the caller.
 */
export function badRequestResponse(error: unknown, context: string) {
  console.error(`[api:${context}] bad request:`, error);

  return NextResponse.json(
    { success: false, error: GENERIC_CLIENT_ERROR },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  );
}
