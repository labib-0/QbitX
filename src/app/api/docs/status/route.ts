import { NextRequest, NextResponse } from "next/server";
import { DocsSettingsService } from "@/services/docs/DocsSettingsService";
import { getServerSession } from "@/server/auth/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const userRole = session?.user?.role || null;

    const accessStatus = DocsSettingsService.evaluateAccess(userRole);

    return NextResponse.json({
      success: true,
      ...accessStatus,
      userRole,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to evaluate documentation status",
      },
      { status: 500 }
    );
  }
}
