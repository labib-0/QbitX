/**
 * AIService.ts
 * Real API client bridging to /api/ai/chat & /api/ai/code-review
 */

import { AIMessagePayload, AIContext } from "./ai/IAIProvider";

export interface AIMessage extends AIMessagePayload {}

export class AIService {
  static getSuggestedPrompts(): string[] {
    return [
      "Explain Binary Search algorithm and its Big-O complexity",
      "Teach me React Hooks (useState, useEffect, useCallback)",
      "Help debug my TypeScript type narrowing error",
      "Explain 3rd Normal Form (3NF) and database indexing",
      "How do Git feature branches and merge conflicts work in a team?",
      "Review my capstone project architecture design",
      "What are the differences between REST, GraphQL, and gRPC?",
      "How does PostgreSQL query planning and EXPLAIN ANALYZE work?",
    ];
  }

  static async sendMessage(
    userPrompt: string,
    context?: AIContext,
    onThinkingStage?: (stage: string) => void,
    onChunk?: (chunkText: string) => void,
    conversationId?: string
  ): Promise<AIMessagePayload> {
    if (onThinkingStage) {
      onThinkingStage("Synthesizing pedagogical explanation...");
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          context,
          conversationId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `AI Request failed with status ${res.status}`);
      }

      const data = await res.json();
      const content = data.data?.content || "No response received from AI mentor.";

      return {
        id: `ai-${Date.now()}`,
        conversationId: data.conversationId,
        sender: "ai",
        text: content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    } catch (error: any) {
      console.error("AIService.sendMessage error:", error);
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `⚠️ **Unable to complete AI request:**\n\n${error.message || "Please check your network connection and server logs."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
  }

  /**
   * Request automated AST / Gemini Code Review
   */
  static async reviewCode(code: string, language = "typescript") {
    const res = await fetch("/api/ai/code-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, language }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Code review request failed");
    }

    return await res.json();
  }
}
