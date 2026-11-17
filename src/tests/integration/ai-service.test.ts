import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/server/db/schema";
import {
  isAIConfigured,
  generateAIResponse,
  generateAICodeReview,
  QBITX_SYSTEM_PROMPT,
} from "@/server/ai";
import { eq, asc } from "drizzle-orm";
import fs from "fs";
import path from "path";

describe("AI Integration & Honest Diagnostics Verification Test Suite", () => {
  let client: PGlite;
  let testDb: any;
  const originalGeminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const originalLegacyKey = process.env.GEMINI_API_KEY;

  beforeAll(async () => {
    client = new PGlite();
    testDb = drizzle(client, { schema });

    // Execute migrations
    const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      const statements = sqlContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await client.exec(statement);
        } catch {
          // Idempotent
        }
      }
    }
  });

  afterAll(async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalGeminiKey;
    process.env.GEMINI_API_KEY = originalLegacyKey;
    await client.close();
  });

  describe("Honest Diagnostics & Zero Fake Mocking Verification", () => {
    it("reports isAIConfigured() === false when Gemini keys are missing", () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      expect(isAIConfigured()).toBe(false);
    });

    it("returns honest diagnostic setup guide instead of fake canned chat responses", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const response = await generateAIResponse({
        prompt: "Can you explain B-Tree index traversal in PostgreSQL?",
      });

      expect(response.configured).toBe(false);
      expect(response.model).toBe("unconfigured");
      expect(response.content).toContain("Google Gemini AI is not configured");
      expect(response.content).toContain("GOOGLE_GENERATIVE_AI_API_KEY");
      expect(response.content).toContain("https://aistudio.google.com/");

      // STRICT CHECK: Ensure NO fake canned LLM output simulating actual responses
      expect(response.content).not.toMatch(/Sure, here is your B-Tree explanation/i);
      expect(response.content).not.toMatch(/As an AI language model, I think/i);
    });

    it("returns diagnostic configuration warning for AI Code Review when unconfigured", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const code = `
        function calculateTotal(items: { price: number; quantity: number }[]) {
          return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
      `;

      const review = await generateAICodeReview({
        code,
        language: "typescript",
      });

      expect(review.configured).toBe(false);
      expect(review.findings).toHaveLength(1);
      expect(review.findings[0].category).toBe("Configuration");
      expect(review.findings[0].severity).toBe("warning");
      expect(review.findings[0].message).toContain("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
      expect(review.suggestions).toContain("Add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.");
    });
  });

  describe("AI Database Persistence Architecture", () => {
    const testUserId = "usr-ai-test-1";

    beforeAll(async () => {
      await testDb.insert(schema.users).values({
        id: testUserId,
        name: "AI Test Student",
        email: "ai.student@qbitx.dev",
        role: "student",
        status: "active",
      });
    });

    it("persists multi-turn conversation history in relational database", async () => {
      const convId = "conv-relational-test-1";

      // 1. Create Conversation
      await testDb.insert(schema.aiConversations).values({
        id: convId,
        userId: testUserId,
        title: "Database Indexing & B-Trees",
      });

      // 2. Insert User Prompt
      await testDb.insert(schema.aiMessages).values({
        id: "msg-p1",
        conversationId: convId,
        role: "user",
        content: "What is the difference between a B-Tree and a Hash index in PostgreSQL?",
      });

      // 3. Insert Assistant Response
      await testDb.insert(schema.aiMessages).values({
        id: "msg-a1",
        conversationId: convId,
        role: "assistant",
        content: "B-Trees support range queries (BETWEEN, <, >), whereas Hash indexes only support point equality (=).",
      });

      // 4. Query conversation messages ordered by creation
      const messages = await testDb
        .select()
        .from(schema.aiMessages)
        .where(eq(schema.aiMessages.conversationId, convId))
        .orderBy(asc(schema.aiMessages.createdAt));

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("user");
      expect(messages[0].content).toContain("What is the difference");
      expect(messages[1].role).toBe("assistant");
      expect(messages[1].content).toContain("B-Trees support range queries");
    });

    it("persists code review results into ai_code_reviews table", async () => {
      const reviewId = "ai-rev-persisted-1";
      const snippet = "const query = `SELECT * FROM users WHERE id = '${id}'`;";

      await testDb.insert(schema.aiCodeReviews).values({
        id: reviewId,
        userId: testUserId,
        language: "typescript",
        codeSnippet: snippet,
        summary: "Static analysis detected potential SQL injection vulnerability.",
        findings: [
          {
            category: "Security",
            severity: "critical",
            message: "Unsanitized parameter concatenation in SQL query. Use parameterized queries or Drizzle ORM.",
          },
        ],
        suggestions: [
          "Replace string concatenation with eq(schema.users.id, id) in Drizzle ORM.",
        ],
      });

      const records = await testDb
        .select()
        .from(schema.aiCodeReviews)
        .where(eq(schema.aiCodeReviews.id, reviewId));

      expect(records).toHaveLength(1);
      expect(records[0].language).toBe("typescript");
      expect(records[0].findings[0].category).toBe("Security");
      expect(records[0].findings[0].severity).toBe("critical");
      expect(records[0].suggestions).toContain(
        "Replace string concatenation with eq(schema.users.id, id) in Drizzle ORM."
      );
    });
  });

  describe("System Prompt Pedagogical Boundaries", () => {
    it("enforces Big-O notation, pedagogical guidance, and university tone", () => {
      expect(QBITX_SYSTEM_PROMPT).toContain("Big-O notation");
      expect(QBITX_SYSTEM_PROMPT).toContain("Do not merely write the entire solution for student homework blindly");
      expect(QBITX_SYSTEM_PROMPT).toContain("pedagogical assistant");
      expect(QBITX_SYSTEM_PROMPT).toContain("software engineering students");
    });
  });
});
