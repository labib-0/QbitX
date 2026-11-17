import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { generateAIResponse } from "@/server/ai";
import { db, schema } from "@/server/db";
import { eq, desc, asc } from "drizzle-orm";
import { z } from "zod";

const chatRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(4000, "Prompt is too long"),
  conversationId: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const validated = chatRequestSchema.parse(body);

    let conversationId = validated.conversationId;
    let conversationHistory: { role: "user" | "assistant" | "system"; content: string }[] = [];

    // 1. If user is authenticated, manage database conversation & history
    if (session?.user?.id) {
      if (conversationId) {
        // Verify conversation belongs to user
        const existingConv = await db
          .select()
          .from(schema.aiConversations)
          .where(eq(schema.aiConversations.id, conversationId));

        if (existingConv.length > 0 && existingConv[0].userId === session.user.id) {
          // Fetch past messages
          const pastMessages = await db
            .select()
            .from(schema.aiMessages)
            .where(eq(schema.aiMessages.conversationId, conversationId))
            .orderBy(asc(schema.aiMessages.createdAt))
            .limit(20);

          conversationHistory = pastMessages.map((m: any) => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
          }));
        } else {
          conversationId = undefined; // Reset if invalid
        }
      }

      if (!conversationId) {
        // Create new conversation
        conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const title = validated.prompt.length > 35
          ? validated.prompt.substring(0, 35) + "..."
          : validated.prompt;

        await db.insert(schema.aiConversations).values({
          id: conversationId,
          userId: session.user.id,
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Persist student's user message
      await db.insert(schema.aiMessages).values({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId,
        role: "user",
        content: validated.prompt,
        createdAt: new Date(),
      });
    }

    // 2. Generate Real AI Response (via Gemini or honest diagnostic message)
    const response = await generateAIResponse({
      prompt: validated.prompt,
      conversationHistory,
      context: validated.context,
    });

    // 3. Persist assistant response if authenticated
    if (session?.user?.id && conversationId) {
      await db.insert(schema.aiMessages).values({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId,
        role: "assistant",
        content: response.content,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversationId || null,
      data: {
        role: "assistant",
        content: response.content,
        model: response.model,
        configured: response.configured,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI chat message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view conversations" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await db
        .select()
        .from(schema.aiMessages)
        .where(eq(schema.aiMessages.conversationId, conversationId))
        .orderBy(asc(schema.aiMessages.createdAt));

      return NextResponse.json({ success: true, data: messages });
    }

    // List recent conversations
    const conversations = await db
      .select()
      .from(schema.aiConversations)
      .where(eq(schema.aiConversations.userId, session.user.id))
      .orderBy(desc(schema.aiConversations.updatedAt))
      .limit(20);

    return NextResponse.json({ success: true, data: conversations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
