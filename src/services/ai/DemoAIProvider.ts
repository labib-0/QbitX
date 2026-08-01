/**
 * src/services/ai/DemoAIProvider.ts
 * Implementation of IAIProvider using DemoKnowledgeBase, simulated multi-stage thinking, and token streaming
 */

import { IAIProvider, AIContext, AIMessagePayload } from "./IAIProvider";
import { DEMO_KNOWLEDGE_ITEMS } from "./DemoKnowledgeBase";

export class DemoAIProvider implements IAIProvider {
  getProviderName(): string {
    return "QbitX AI Mentor Engine (Interactive Demo)";
  }

  getSuggestedPrompts(): string[] {
    return [
      "Explain Binary Search algorithm step-by-step",
      "Teach me React Hooks (useState & useEffect)",
      "Help debug my Python code mutability error",
      "Create a SQL query with INNER JOIN",
      "Explain 3rd Normal Form (3NF) in database design",
      "How do Git feature branches work in a team?",
      "Review my capstone project architecture idea",
      "Prepare me for a junior software engineer interview",
    ];
  }

  async sendMessage(
    prompt: string,
    context?: AIContext,
    onThinkingStage?: (stage: string) => void,
    onChunk?: (chunkText: string) => void
  ): Promise<AIMessagePayload> {
    // 1. Simulated multi-stage thinking pipeline
    const thinkingStages = [
      "Analyzing user question & intent...",
      "Searching QbitX curriculum & technical knowledge base...",
      "Structuring code explanation & complexity analysis...",
    ];

    for (const stage of thinkingStages) {
      if (onThinkingStage) onThinkingStage(stage);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    // 2. Intent matching against Demo Knowledge Base
    const lowerPrompt = prompt.toLowerCase().trim();
    let matchedItem = DEMO_KNOWLEDGE_ITEMS.find((item) =>
      item.keywords.some((kw) => lowerPrompt.includes(kw))
    );

    // Fallback response with personalization if no specific keyword matched
    let responseText = "";
    let codeSnippet: string | undefined = undefined;
    let followUps: string[] = [];

    const userName = context?.userName || "Student";
    const courseTitle = context?.courseTitle || "CS Fundamentals";

    if (matchedItem) {
      responseText = `Hello ${userName}! Here is a detailed breakdown for your query regarding your **${courseTitle}** learning path:\n\n` + matchedItem.response;
      codeSnippet = matchedItem.codeSnippet;
      followUps = matchedItem.suggestedFollowUps || [];
    } else {
      responseText = `Hello ${userName}! As your 24/7 QbitX AI Mentor, I analyzed your prompt regarding **${courseTitle}**.\n\nGreat technical question! Software engineering requires balancing clean code architecture, data structures, and production scalability. Let me know if you would like code examples, system design breakdowns, or project milestone recommendations!`;
      followUps = [
        "Explain Binary Search algorithm step-by-step",
        "Teach me React Hooks (useState & useEffect)",
        "Suggest capstone project ideas",
      ];
    }

    // 3. Simulated token-by-token streaming effect
    if (onChunk) {
      const words = responseText.split(" ");
      let currentAcc = "";
      for (let i = 0; i < words.length; i++) {
        currentAcc += (i === 0 ? "" : " ") + words[i];
        onChunk(currentAcc);
        // Small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
    }

    return {
      id: `ai-msg-${Date.now()}`,
      sender: "ai",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      codeSnippet,
      thinkingSteps: thinkingStages,
      suggestedFollowUps: followUps,
    };
  }
}
