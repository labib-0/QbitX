/**
 * AIService.ts
 * Manages demo AI Assistant suggestions, prompts, and simulated AI responses.
 * 
 * TODO: Replace with real Gemini API / Firebase AI Logic endpoint in production.
 */

export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export class AIService {
  static getSuggestedPrompts(): string[] {
    return [
      "Explain Dijkstra's Algorithm step-by-step",
      "Review my React hook code for memory leaks",
      "Help me debug Next.js Hydration Mismatch error",
      "Generate a 4-week Web Development learning roadmap",
      "Summarize lecture on Operating System Deadlocks",
    ];
  }

  /**
   * Simulate AI Response generation
   * TODO: API integration -> POST /api/ai/chat
   */
  static async sendMessage(userPrompt: string): Promise<AIMessage> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = userPrompt.toLowerCase();
    let text = "I'm your QbitX AI Mentor! I can help you analyze code, explain concepts, or optimize performance.";
    let codeSnippet: string | undefined = undefined;

    if (lower.includes("explain") || lower.includes("dijkstra")) {
      text = "Dijkstra's Algorithm finds the shortest path between nodes in a graph with non-negative edge weights using a Min-Priority Queue:";
      codeSnippet = `function dijkstra(graph, start) {
  const distances = {};
  const priorityQueue = new PriorityQueue();
  
  distances[start] = 0;
  priorityQueue.enqueue(start, 0);
  
  while (!priorityQueue.isEmpty()) {
    const { node } = priorityQueue.dequeue();
    for (let neighbor of graph[node]) {
      let alt = distances[node] + neighbor.weight;
      if (alt < (distances[neighbor.node] || Infinity)) {
        distances[neighbor.node] = alt;
        priorityQueue.enqueue(neighbor.node, alt);
      }
    }
  }
  return distances;
}`;
    } else if (lower.includes("debug") || lower.includes("hydration") || lower.includes("error")) {
      text = "Hydration mismatch errors occur when the server-rendered HTML differs from the client-rendered React component tree. Quick fix:";
      codeSnippet = `// Wrap non-deterministic code (e.g. window, localStorage, Date.now) inside useEffect
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return null; // Prevents SSR mismatch`;
    } else if (lower.includes("review") || lower.includes("code")) {
      text = "Your code structure looks clean! Here is an optimization tip: Use `useCallback` for event handlers passed into memoized child components to avoid unnecessary re-renders.";
    } else if (lower.includes("roadmap")) {
      text = "Here is a 4-week roadmap customized for your current progress:\nWeek 1: Advanced TypeScript & Generics\nWeek 2: Next.js Server Components & Actions\nWeek 3: PostgreSQL & Prisma ORM\nWeek 4: Building & Deploying Full-Stack SaaS";
    }

    return {
      id: "msg-" + Date.now(),
      sender: "ai",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet,
    };
  }
}
