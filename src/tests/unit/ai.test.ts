import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAIConfigured, QBITX_SYSTEM_PROMPT } from "@/server/ai";

describe("AI Service Architecture & Fallbacks", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("identifies unconfigured state when environment variable is absent", () => {
    expect(isAIConfigured()).toBe(false);
  });

  it("identifies configured state when GOOGLE_GENERATIVE_AI_API_KEY is present", () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test_key_gemini";
    expect(isAIConfigured()).toBe(true);
  });

  it("identifies configured state when GEMINI_API_KEY is present", () => {
    process.env.GEMINI_API_KEY = "test_key_gemini_alt";
    expect(isAIConfigured()).toBe(true);
  });

  it("system prompt enforces pedagogical tutoring and complexity analysis", () => {
    expect(QBITX_SYSTEM_PROMPT).toContain("QbitX AI Engineering Mentor");
    expect(QBITX_SYSTEM_PROMPT).toContain("Time and Space complexity");
    expect(QBITX_SYSTEM_PROMPT).toContain("Do not merely write the entire solution");
  });

  describe("Code Review JSON Extraction", () => {
    function parseCodeReviewJson(rawText: string) {
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    }

    it("cleans markdown fences and parses structured code review", () => {
      const rawResponse = `\`\`\`json
{
  "summary": "Clean recursive implementation of binary search",
  "findings": [
    {
      "category": "Edge Cases",
      "severity": "warning",
      "message": "Potential integer overflow on (low + high) / 2 in C/C++/Java"
    }
  ],
  "suggestions": [
    "Use low + (high - low) / 2 to avoid overflow"
  ]
}
\`\`\``;

      const parsed = parseCodeReviewJson(rawResponse);
      expect(parsed.summary).toBe("Clean recursive implementation of binary search");
      expect(parsed.findings).toHaveLength(1);
      expect(parsed.findings[0].severity).toBe("warning");
      expect(parsed.suggestions[0]).toContain("low + (high - low) / 2");
    });
  });
});
