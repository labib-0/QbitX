// GET /api/content/search -> Multi-entity AI-ready search by query, tag, category, difficulty, AI skill, Bloom's taxonomy

import { NextRequest, NextResponse } from "next/server";
import { ContentSearchService } from "@/services/content/ContentSearchService";
import { Difficulty, UserRole } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const difficulty = (searchParams.get("difficulty") as Difficulty) || undefined;
    const tag = searchParams.get("tag") || undefined;
    const aiSkill = searchParams.get("aiSkill") || undefined;
    const role = (searchParams.get("role") as UserRole) || "student";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const results = ContentSearchService.search({
      query,
      category,
      difficulty,
      tag,
      aiSkill,
      userRole: role,
      limit,
    });

    return NextResponse.json({
      success: true,
      query: query || "",
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Content search failed" }, { status: 500 });
  }
}
