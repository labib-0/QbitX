/**
 * AIService.ts
 * Facade bridging to AIProviderFactory (DemoAIProvider / Future LLM Providers)
 */

import { AIProviderFactory } from "./ai/AIProviderFactory";
import { AIMessagePayload, AIContext } from "./ai/IAIProvider";

export interface AIMessage extends AIMessagePayload {}

export class AIService {
  static getSuggestedPrompts(): string[] {
    return AIProviderFactory.getProvider().getSuggestedPrompts();
  }

  static async sendMessage(
    userPrompt: string,
    context?: AIContext,
    onThinkingStage?: (stage: string) => void,
    onChunk?: (chunkText: string) => void
  ): Promise<AIMessagePayload> {
    const provider = AIProviderFactory.getProvider("demo");
    return provider.sendMessage(userPrompt, context, onThinkingStage, onChunk);
  }
}
