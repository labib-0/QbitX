import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { ensureDemoAccounts, syncDemoCredentialsOnAttempt } from "@/server/auth/demo-accounts";
import { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith("/sign-in/email")) {
    try {
      const cloned = request.clone();
      const body = await cloned.json().catch(() => null);
      if (body?.email && body?.password) {
        await syncDemoCredentialsOnAttempt(body.email, body.password);
      } else {
        await ensureDemoAccounts();
      }
    } catch {
      // Non-blocking for external accounts
    }
  }
  return handlers.POST(request);
}
