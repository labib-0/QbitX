import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { DEMO_ACCOUNTS, ensureDemoAccounts } from "@/server/auth/demo-accounts";

export async function POST(request: NextRequest) {
  try {
    let role = "student";
    let email = "";
    let password = "password123";

    try {
      const body = await request.json();
      if (body.role && DEMO_ACCOUNTS[body.role]) {
        role = body.role;
      }
      if (body.email) {
        email = body.email;
        if (body.email.includes("admin")) role = "admin";
        else if (body.email.includes("mentor")) role = "mentor";
        else role = "student";
      }
      if (body.password) {
        password = body.password;
      }
    } catch {
      // Use defaults
    }

    // 1. Ensure all demo accounts exist in database
    await ensureDemoAccounts();

    const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.student;
    const targetEmail = email || account.email;
    const targetPassword = password || account.password;

    // 2. Authenticate through Better Auth engine
    const origin = request.nextUrl.origin || "http://localhost:3000";
    const signInReq = new Request(`${origin}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: targetEmail,
        password: targetPassword,
      }),
    });

    const authRes = await auth.handler(signInReq);
    const authData = await authRes.json();

    if (!authRes.ok || authData.error) {
      return NextResponse.json(
        {
          success: false,
          error: authData.error?.message || "Failed to authenticate demo account",
        },
        { status: 400 }
      );
    }

    const setCookie = authRes.headers.get("set-cookie");
    const response = NextResponse.json({
      success: true,
      user: authData.user,
      redirectUrl: account.redirectUrl,
    });

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error: any) {
    console.error("[Demo Login Route Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error during demo authentication",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role") || "student";
  const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.student;

  try {
    await ensureDemoAccounts();

    const origin = request.nextUrl.origin || "http://localhost:3000";
    const signInReq = new Request(`${origin}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: account.email,
        password: account.password,
      }),
    });

    const authRes = await auth.handler(signInReq);
    const setCookie = authRes.headers.get("set-cookie");

    const targetUrl = new URL(account.redirectUrl, request.url);
    const response = NextResponse.redirect(targetUrl);

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("[Demo Login GET Error]", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
