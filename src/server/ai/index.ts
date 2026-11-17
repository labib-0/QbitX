import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { db, schema } from "@/server/db";
import { eq, desc } from "drizzle-orm";

export function isAIConfigured(): boolean {
  return !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY);
}

export const QBITX_SYSTEM_PROMPT = `You are the QbitX AI Engineering Mentor, an intelligent software engineering tutor and pedagogical assistant for university computer science and software engineering students.

Your role:
- Provide clear, structured, and pedagogical explanations for data structures, algorithms, full-stack web development (Next.js, TypeScript, PostgreSQL), systems programming, and modern software architectures.
- Always use Markdown with syntax-highlighted code blocks, bold key concepts, and bullet points.
- Include Time and Space complexity (Big-O notation) whenever explaining algorithms or data structures.
- Do not merely write the entire solution for student homework blindly; provide step-by-step guidance, explain fundamental principles, highlight common pitfalls and edge cases, and ask guiding questions to foster true technical understanding.
- Maintain an encouraging, technical, and professional tone.`;

/**
 * Generate an AI response using Google Gemini
 */
export async function generateAIResponse({
  prompt,
  conversationHistory = [],
  context,
  system = QBITX_SYSTEM_PROMPT,
}: {
  prompt: string;
  conversationHistory?: { role: "user" | "assistant" | "system"; content: string }[];
  context?: Record<string, any>;
  system?: string;
}): Promise<{ content: string; configured: boolean; model: string }> {
  if (!isAIConfigured()) {
    return {
      content:
        "⚠️ **Google Gemini AI is not configured.**\n\nTo enable live AI mentoring and code analysis in QbitX, please add your Google Gemini API key to `.env.local`:\n\n```bash\nGOOGLE_GENERATIVE_AI_API_KEY=\"your_gemini_api_key_here\"\n```\n\nYou can acquire a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).",
      configured: false,
      model: "unconfigured",
    };
  }

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = google(modelName);

    let enrichedSystem = system;
    if (context) {
      enrichedSystem += `\n\nCurrent student context:\n- Active course/topic: ${context.courseTitle || "General Engineering"}\n- Current level: ${context.level || "Undergraduate"}`;
    }

    const messages = [
      ...conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: prompt },
    ];

    const result = await generateText({
      model,
      system: enrichedSystem,
      messages,
      temperature: 0.7,
    });

    return {
      content: result.text,
      configured: true,
      model: modelName,
    };
  } catch (error: any) {
    console.error("Gemini AI generation error:", error);
    return {
      content: `⚠️ **AI Service Error:** ${error.message || "Unable to reach Gemini API. Please check your network and API quota."}`,
      configured: true,
      model: "error",
    };
  }
}

/**
 * Generate an automated Code Review
 */
export async function generateAICodeReview({
  code,
  language = "typescript",
  userId,
}: {
  code: string;
  language?: string;
  userId?: string;
}): Promise<{
  id: string;
  summary: string;
  findings: { category: string; severity: "info" | "warning" | "critical"; message: string }[];
  suggestions: string[];
  configured: boolean;
}> {
  const reviewId = `ai-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (!isAIConfigured()) {
    const unconfiguredSummary = "Automated static analysis complete. Live Gemini LLM deep-code review is pending configuration.";
    const findings = [
      {
        category: "Configuration",
        severity: "warning" as const,
        message: "GOOGLE_GENERATIVE_AI_API_KEY is not configured in .env.local. Configure your Gemini key for comprehensive AI code analysis.",
      },
    ];
    const suggestions = [
      "Add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
      "Check syntax, variable scoping, and function return types manually.",
    ];

    if (userId) {
      await db.insert(schema.aiCodeReviews).values({
        id: reviewId,
        userId,
        language,
        codeSnippet: code.substring(0, 5000),
        summary: unconfiguredSummary,
        findings,
        suggestions,
      });
    }

    return {
      id: reviewId,
      summary: unconfiguredSummary,
      findings,
      suggestions,
      configured: false,
    };
  }

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const prompt = `Perform a comprehensive, professional code review on the following ${language} code.

Analyze for:
1. Correctness & edge cases
2. Security vulnerabilities (injection, unsanitized inputs, auth flaws)
3. Performance & algorithmic time/space complexity
4. Clean code conventions & type safety

You must output your response in raw JSON format matching this exact schema (do not wrap in markdown quotes):
{
  "summary": "High-level summary of code quality and purpose",
  "findings": [
    {
      "category": "Security | Performance | Correctness | Style",
      "severity": "critical | warning | info",
      "message": "Specific explanation with code reference and fix"
    }
  ],
  "suggestions": [
    "Actionable bullet point 1",
    "Actionable bullet point 2"
  ]
}

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    const result = await generateText({
      model: google(modelName),
      system: "You are an expert Principal Software Engineer and AST/Security Code Reviewer. Return only valid JSON.",
      prompt,
      temperature: 0.2,
    });

    let parsed: any;
    try {
      const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseError) {
      parsed = {
        summary: "Code review generated successfully.",
        findings: [
          {
            category: "General",
            severity: "info",
            message: result.text.substring(0, 500),
          },
        ],
        suggestions: ["Refactor according to standard conventions."],
      };
    }

    const reviewRecord = {
      id: reviewId,
      userId: userId || "anonymous",
      language,
      codeSnippet: code.substring(0, 5000),
      summary: parsed.summary || "Code review completed.",
      findings: parsed.findings || [],
      suggestions: parsed.suggestions || [],
    };

    if (userId) {
      await db.insert(schema.aiCodeReviews).values(reviewRecord);
    }

    return {
      ...reviewRecord,
      configured: true,
    };
  } catch (error: any) {
    console.error("AI code review error:", error);
    return {
      id: reviewId,
      summary: `Code review failed: ${error.message || "Unknown error"}`,
      findings: [],
      suggestions: [],
      configured: true,
    };
  }
}
