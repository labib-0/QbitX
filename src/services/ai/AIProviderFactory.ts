/**
 * src/services/ai/AIProviderFactory.ts
 * Factory manager providing the active AI Provider instance
 */

import { IAIProvider } from "./IAIProvider";
import { DemoAIProvider } from "./DemoAIProvider";
import { FutureOpenAIProvider, FutureGeminiProvider, FutureClaudeProvider } from "./FutureLLMProviders";

export type AIProviderType = "demo" | "openai" | "gemini" | "claude";

export class AIProviderFactory {
  private static activeProvider: IAIProvider = new DemoAIProvider();

  /**
   * Get the active provider singleton
   */
  static getProvider(type: AIProviderType = "demo"): IAIProvider {
    switch (type) {
      case "openai":
        return new FutureOpenAIProvider();
      case "gemini":
        return new FutureGeminiProvider();
      case "claude":
        return new FutureClaudeProvider();
      case "demo":
      default:
        return this.activeProvider;
    }
  }

  /**
   * Set global default provider
   */
  static setProvider(provider: IAIProvider) {
    this.activeProvider = provider;
  }
}
