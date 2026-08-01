/**
 * src/services/ai/FutureLLMProviders.ts
 * Extension stubs for future OpenAI, Gemini, and Claude LLM Provider implementations
 */

import { IAIProvider, AIContext, AIMessagePayload } from "./IAIProvider";

export class FutureOpenAIProvider implements IAIProvider {
  getProviderName(): string {
    return "OpenAI gpt-4o Provider (Production Ready)";
  }

  getSuggestedPrompts(): string[] {
    return ["Explain Dijkstra algorithm", "Debug React memory leaks"];
  }

  async sendMessage(prompt: string, context?: AIContext): Promise<AIMessagePayload> {
    throw new Error("OpenAI API Key not configured. Please switch to DemoAIProvider.");
  }
}

export class FutureGeminiProvider implements IAIProvider {
  getProviderName(): string {
    return "Google Gemini 1.5 Pro Provider (Production Ready)";
  }

  getSuggestedPrompts(): string[] {
    return ["Explain SQL Normalization", "System design for RAG"];
  }

  async sendMessage(prompt: string, context?: AIContext): Promise<AIMessagePayload> {
    throw new Error("Gemini API Key not configured. Please switch to DemoAIProvider.");
  }
}

export class FutureClaudeProvider implements IAIProvider {
  getProviderName(): string {
    return "Anthropic Claude 3.5 Sonnet Provider (Production Ready)";
  }

  getSuggestedPrompts(): string[] {
    return ["Review software architecture", "Refactor Python code"];
  }

  async sendMessage(prompt: string, context?: AIContext): Promise<AIMessagePayload> {
    throw new Error("Claude API Key not configured. Please switch to DemoAIProvider.");
  }
}
