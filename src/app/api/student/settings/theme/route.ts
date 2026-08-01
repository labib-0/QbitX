// POST /api/student/settings/theme
// Persist theme preference for the authenticated student

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body as { theme: "light" | "dark" | "system" };

    if (!theme || !["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ success: false, error: "Invalid theme value" }, { status: 400 });
    }

    // In production: persist to Supabase student_settings table
    // await supabase.from("student_settings").upsert({ user_id, theme });

    return NextResponse.json({ success: true, theme });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
