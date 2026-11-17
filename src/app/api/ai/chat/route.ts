import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { generateAIResponse } from "@/server/ai";
import { db, schema } from "@/server/db";
import { and, eq, desc, asc } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

export const maxDuration = 60;

const chatRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(4000, "Prompt is too long"),
  conversationId: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
});

function authorizationErrorResponse(error: any) {
  if (error?.name === "UnauthorizedError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
  if (error?.name === "ForbiddenError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // AI calls cost money: require a verified, non-suspended session and bind
    // all conversation writes to that user.
    const { user } = await requireUser();

    const body = await request.json();
    const validated = chatRequestSchema.parse(body);

    let conversationId = validated.conversationId;
    let conversationHistory: { role: "user" | "assistant" | "system"; content: string }[] = [];

    if (conversationId) {
      // Verify the conversation exists AND belongs to the caller before
      // reading history or appending to it (IDOR prevention).
      const owned = await db
        .select({ id: schema.aiConversations.id })
        .from(schema.aiConversations)
        .where(
          and(
            eq(schema.aiConversations.id, conversationId),
            eq(schema.aiConversations.userId, user.id)
          )
        );

      if (owned.length === 0) {
        return NextResponse.json(
          { success: false, error: "Conversation not found" },
          { status: 404 }
        );
      }

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
      conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const title =
        validated.prompt.length > 35
          ? validated.prompt.substring(0, 35) + "..."
          : validated.prompt;

      await db.insert(schema.aiConversations).values({
        id: conversationId,
        userId: user.id,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await db.insert(schema.aiMessages).values({
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      role: "user",
      content: validated.prompt,
      createdAt: new Date(),
    });

    const response = await generateAIResponse({
      prompt: validated.prompt,
      conversationHistory,
      context: validated.context,
    });

    await db.insert(schema.aiMessages).values({
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      role: "assistant",
      content: response.content,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      conversationId,
      data: {
        role: "assistant",
        content: response.content,
        model: response.model,
        configured: response.configured,
        providerStatus: response.providerStatus,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return internalErrorResponse(error, "/api/ai/chat");
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const owned = await db
        .select({ id: schema.aiConversations.id })
        .from(schema.aiConversations)
        .where(
          and(
            eq(schema.aiConversations.id, conversationId),
            eq(schema.aiConversations.userId, user.id)
          )
        );

      if (owned.length === 0) {
        // Return 404 rather than 403 so conversation IDs cannot be probed.
        return NextResponse.json(
          { success: false, error: "Conversation not found" },
          { status: 404 }
        );
      }

      const messages = await db
        .select()
        .from(schema.aiMessages)
        .where(eq(schema.aiMessages.conversationId, conversationId))
        .orderBy(asc(schema.aiMessages.createdAt));

      return NextResponse.json({ success: true, data: messages });
    }

    const conversations = await db
      .select()
      .from(schema.aiConversations)
      .where(eq(schema.aiConversations.userId, user.id))
      .orderBy(desc(schema.aiConversations.updatedAt))
      .limit(20);

    return NextResponse.json({ success: true, data: conversations });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return internalErrorResponse(error, "/api/ai/chat");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "conversationId is required" },
        { status: 400 }
      );
    }

    await db
      .delete(schema.aiConversations)
      .where(
        and(
          eq(schema.aiConversations.id, conversationId),
          eq(schema.aiConversations.userId, user.id)
        )
      );

    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return internalErrorResponse(error, "/api/ai/chat");
  }
}
