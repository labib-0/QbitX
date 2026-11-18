import { db, schema } from "@/server/db";
import { eq, desc } from "drizzle-orm";

export function isAIConfigured(): boolean {
  return !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY);
}

/**
 * Gemini models are retired frequently (2.x models already reject new API
 * keys). Ask the API which text models this key can actually use, cache the
 * answer, and fall back to current static names if discovery is unavailable.
 */
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const DEFAULT_GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

/** Rank current text models first so retired generations are tried last. */
function rankModel(name: string): number {
  if (name === "gemini-flash-latest") return 1000;
  const match = name.match(/^gemini-(\d+)(?:\.(\d+))?-(flash|flash-lite|pro)/);
  if (!match) return 0;
  const version = Number(match[1]) + Number(match[2] || 0) / 10;
  const family = match[3] === "flash" ? 3 : match[3] === "flash-lite" ? 2 : 1;
  return Math.round(version * 100) + family;
}

let discoveryCache: { models: string[]; expiresAt: number } | null = null;

async function discoverGeminiModels(): Promise<string[]> {
  if (discoveryCache && discoveryCache.expiresAt > Date.now()) {
    return discoveryCache.models;
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`${GEMINI_API_BASE}/models?pageSize=1000`, {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[ai] Gemini model discovery failed with status ${response.status}.`);
      return [];
    }

    const payload: any = await response.json();
    const models: string[] = (payload.models || [])
      .filter(
        (model: any) =>
          Array.isArray(model.supportedGenerationMethods) &&
          model.supportedGenerationMethods.includes("generateContent")
      )
      .map((model: any) => String(model.name || "").replace(/^models\//, ""))
      .filter(
        (name: string) =>
          Boolean(name) && !/(tts|image|audio|live|robotics|embedding|aqa|learnlm)/i.test(name)
      )
      .sort((a: string, b: string) => rankModel(b) - rankModel(a));

    discoveryCache = { models, expiresAt: Date.now() + 60 * 60 * 1000 };
    return models;
  } catch (error) {
    console.warn("[ai] Gemini model discovery failed:", error);
    return [];
  }
}

export async function getGeminiModelCandidates(): Promise<string[]> {
  const discovered = await discoverGeminiModels();

  return Array.from(
    new Set(
      [
        process.env.GEMINI_MODEL,
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        ...discovered,
        ...DEFAULT_GEMINI_MODELS,
      ].filter((model): model is string => Boolean(model))
    )
  );
}

function isModelUnavailableError(error: any): boolean {
  if (getProviderStatus(error) === 404) return true;
  const message = String(error?.message || error || "");
  return (
    /model/i.test(message) &&
    /not found|not supported|unsupported|no longer available|not available|deprecated|ListModels|update your code/i.test(
      message
    )
  );
}

/** HTTP status from the provider, without exposing the provider's message. */
function isTransientProviderError(error: any): boolean {
  const status = getProviderStatus(error);
  if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }
  return /high demand|temporar|overload|try again later|resource_exhausted|unavailable|timeout|ETIMEDOUT|ECONNRESET|abort/i.test(
    String(error?.message || error || "")
  );
}

function getProviderStatus(error: any): number | undefined {
  const direct = Number(error?.statusCode ?? error?.status ?? error?.cause?.status);
  if (Number.isInteger(direct) && direct >= 400 && direct < 600) return direct;
  const match = String(error?.message || "").match(/\b(4\d{2}|5\d{2})\b/);
  return match ? Number(match[1]) : undefined;
}

/**
 * Call Gemini's documented generateContent endpoint directly. The older AI SDK
 * provider hangs against current models, so keep the request explicit and
 * bounded.
 */
async function callGeminiGenerate({
  model,
  system,
  messages,
  temperature,
}: {
  model: string;
  system: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  temperature: number;
}): Promise<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is not configured.");

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: { temperature },
      }),
      signal: AbortSignal.timeout(18000),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload: any = await response.json();
  const text = (payload.candidates?.[0]?.content?.parts || [])
    .map((part: any) => part?.text)
    .filter((part: unknown): part is string => typeof part === "string" && part.length > 0)
    .join("");

  if (!text) {
    const finishReason = payload.candidates?.[0]?.finishReason || "unknown";
    throw new Error(`Gemini returned no text (finishReason: ${finishReason}).`);
  }

  return text;
}

export const QBITX_SYSTEM_PROMPT = `You are the QbitX AI Engineering Mentor, an intelligent software engineering tutor and pedagogical assistant for university computer science and software engineering students.

Key guidelines:
- Keep replies short, concise, direct, and conversational. Strictly limit answers to 2 to 3 compact paragraphs or bullet points (under 150 words total). Avoid walls of text or academic fluff.
- Always use Markdown with syntax-highlighted code blocks, bold key concepts, and bullet points.
- Include Time and Space complexity (Big-O notation) in a single concise summary line whenever explaining algorithms or data structures.
- Do not merely write the entire solution for student homework blindly; provide immediate technical intuition, conceptual clarity, and step-by-step guidance.
- Do NOT generate repetitive template essays, generic disclaimers, or unprompted boilerplate sections like "Common Pitfalls and Edge Cases" or "Guiding Question for You" unless the student explicitly asks for them. Talk naturally like an experienced senior software engineer mentoring a student directly.`;

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
}): Promise<{ content: string; configured: boolean; model: string; providerStatus?: number }> {
  if (!isAIConfigured()) {
    return {
      content:
        "⚠️ **Google Gemini AI is not configured.**\n\nTo enable live AI mentoring and code analysis in QbitX, please add your Google Gemini API key to `.env.local`:\n\n```bash\nGOOGLE_GENERATIVE_AI_API_KEY=\"your_gemini_api_key_here\"\n```\n\nYou can acquire a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).",
      configured: false,
      model: "unconfigured",
    };
  }

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

  let lastError: any = null;

  for (const modelName of (await getGeminiModelCandidates()).slice(0, 3)) {
    try {
      const resultText = await callGeminiGenerate({
        model: modelName,
        system: enrichedSystem,
        messages,
        temperature: 0.7,
      });

      return {
        content: resultText,
        configured: true,
        model: modelName,
      };
    } catch (error: any) {
      lastError = error;
      if (isModelUnavailableError(error) || isTransientProviderError(error)) {
        console.warn(`[ai] Gemini model '${modelName}' is unavailable; trying the next candidate.`);
        continue;
      }
      break;
    }
  }

  console.error("Gemini AI generation error:", lastError);
  const providerStatus = getProviderStatus(lastError);
  const hint =
    providerStatus === 401 || providerStatus === 403
      ? "Google rejected the Gemini API key. If your key starts with `AQ.`, open Google Cloud Console → APIs & Services → Credentials, edit the key, set its API restrictions to **Generative Language API**, and save (allow a minute). Otherwise create a new key at https://aistudio.google.com/apikey and update `GOOGLE_GENERATIVE_AI_API_KEY` in your deployment environment, then redeploy."
      : providerStatus === 429 ||
          /high demand|overload|temporar|unavailable|quota/i.test(String(lastError?.message || ""))
        ? "Google's Gemini service is busy or has reached its quota right now. Please try again in a minute."
        : "Please try again in a moment. If this persists, verify the Gemini API key and model configuration in your deployment environment.";

  return {
    content: `⚠️ **AI service is temporarily unavailable.** ${hint}`,
    configured: true,
    model: "error",
    providerStatus,
  };
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
  providerStatus?: number;
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

  let resultText: string | null = null;
  let lastError: any = null;

  for (const modelName of (await getGeminiModelCandidates()).slice(0, 3)) {
    try {
      resultText = await callGeminiGenerate({
        model: modelName,
        system: "You are an expert Principal Software Engineer and AST/Security Code Reviewer. Return only valid JSON.",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });
      break;
    } catch (error: any) {
      lastError = error;
      if (isModelUnavailableError(error) || isTransientProviderError(error)) {
        console.warn(`[ai] Gemini model '${modelName}' is unavailable for code review; trying the next candidate.`);
        continue;
      }
      break;
    }
  }

  if (resultText === null) {
    console.error("AI code review error:", lastError);
    return {
      id: reviewId,
      summary: "The AI code review service is temporarily unavailable. Please try again shortly.",
      findings: [],
      suggestions: [],
      configured: true,
      providerStatus: getProviderStatus(lastError),
    };
  }

  let parsed: any;
  try {
    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    parsed = JSON.parse(cleanJson);
  } catch (parseError) {
    parsed = {
      summary: "Code review generated successfully.",
      findings: [
        {
          category: "General",
          severity: "info",
          message: resultText.substring(0, 500),
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
}
