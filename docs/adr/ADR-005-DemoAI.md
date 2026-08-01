# ADR-005: Interactive Demo AI Engine & Extension Hooks

- **Status**: Accepted
- **Date**: 2026-08-01
- **Deciders**: QbitX Architecture Team

---

## Problem
Demonstrating the AI Mentor experience during faculty reviews or investor pitches requires realistic, instant streaming responses without requiring external LLM API keys or incurring API quota costs.

---

## Options Considered
1. **Live OpenAI / Gemini API Integration Only**: Fails if API keys are missing or rate limits occur during live presentations.
2. **Abstracted `IAIProvider` Interface with `DemoAIProvider` & Extension Hooks**: Complete demo chat experience with simulated multi-stage thinking, word-by-word streaming, and realistic technical answers across 10 categories. Production LLM adapters (`OpenAIProvider`, `GeminiProvider`) plug into the same interface.

---

## Decision
Adopt **`IAIProvider` Factory Pattern with `DemoAIProvider` & Extension Hooks**.

---

## Consequences
- **Positive**:
  - Zero API key dependency for presentations and local testing.
  - Production LLM providers can be swapped in with zero UI changes.
- **Negative / Trade-offs**:
  - Demo answers are generated from a rich curated knowledge base rather than live dynamic model inference.
