/**
 * src/services/ai/IAIProvider.ts
 * Clean abstraction interface for AI Providers (Demo, OpenAI, Gemini, Claude)
 */

export interface AIContext {
  userId?: string;
  userName?: string;
  courseTitle?: string;
  lessonTitle?: string;
  codeContext?: string;
}

export interface AIMessagePayload {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  codeSnippet?: string;
  thinkingSteps?: string[];
  suggestedFollowUps?: string[];
  feedback?: "liked" | "disliked";
}

export interface ConversationThread {
  id: string;
  title: string;
  messages: AIMessagePayload[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAIProvider {
  /**
   * Send user prompt and stream/return simulated or real LLM response
   */
  sendMessage(
    prompt: string,
    context?: AIContext,
    onThinkingStage?: (stage: string) => void,
    onChunk?: (chunkText: string) => void
  ): Promise<AIMessagePayload>;

  /**
   * Get suggested quick prompts
   */
  getSuggestedPrompts(): string[];

  /**
   * Get provider identity metadata
   */
  getProviderName(): string;
}
