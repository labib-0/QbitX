// POST /api/ai/chat -> Send user prompt & generate context-aware AI response

import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/services/AIService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context } = body as { prompt: string; context?: any };

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ success: false, error: "prompt is required" }, { status: 400 });
    }

    const aiMessage = await AIService.sendMessage(prompt, context);
    return NextResponse.json({ success: true, data: aiMessage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "AI request failed" }, { status: 500 });
  }
}
