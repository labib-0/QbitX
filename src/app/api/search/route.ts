// GET /api/search?q=query
// Instant search across courses, assignments, certificates, announcements

import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/dashboardData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const results = searchAll(query);

  return NextResponse.json({ success: true, data: results, query });
}
