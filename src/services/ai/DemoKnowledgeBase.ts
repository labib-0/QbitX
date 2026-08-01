/**
 * src/services/ai/DemoKnowledgeBase.ts
 * Rich offline technical response repository for QbitX AI Mentor demo
 */

export interface KnowledgeItem {
  keywords: string[];
  response: string;
  codeSnippet?: string;
  suggestedFollowUps?: string[];
}

export const DEMO_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  // 1. Programming & Algorithms
  {
    keywords: ["binary search", "dsa", "search algorithm"],
    response: `Binary Search is an efficient algorithm for finding an element in a **sorted array** with a time complexity of **O(log N)**.

### How It Works:
1. Compare the target value to the middle element of the array.
2. If the target matches the middle element, return its index.
3. If the target is smaller, repeat search on the left half.
4. If the target is larger, repeat search on the right half.

### Complexity Analysis:
- **Time Complexity**: Best O(1), Average/Worst O(log N)
- **Space Complexity**: O(1) for iterative approach, O(log N) for recursive call stack`,
    codeSnippet: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid  # Found
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1  # Not found`,
    suggestedFollowUps: [
      "Explain Binary Search Tree (BST) traversals",
      "What is the difference between Binary Search and Linear Search?",
      "How to solve 2D Matrix Binary Search?",
    ],
  },

  // 2. Web Development / React
  {
    keywords: ["react hooks", "usestate", "useeffect", "react"],
    response: `React Hooks allow functional components to manage local state and lifecycle side effects without writing class components.

### Core Hooks Summary:
- **\`useState\`**: Declares state variables that trigger component re-renders when updated.
- **\`useEffect\`**: Handles side effects (data fetching, subscriptions, DOM mutations) after render.
- **\`useCallback\` / \`useMemo\`**: Memoizes functions and calculated values to optimize child component re-renders.`,
    codeSnippet: `import { useState, useEffect } from "react";

export function CounterComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]); // Re-runs effect whenever count changes

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Increment: {count}
    </button>
  );
}`,
    suggestedFollowUps: [
      "How to avoid React useEffect infinite loops?",
      "Explain Next.js 16 Server Components vs Client Components",
      "What is custom React Hook design pattern?",
    ],
  },

  // 3. Python
  {
    keywords: ["python", "mutability", "decorator", "list comprehension"],
    response: `Python is a dynamically-typed, high-level language with clean syntax and rich ecosystem.

### Key Python Concept: Mutability vs Immutability
- **Immutable Types**: \`int\`, \`float\`, \`str\`, \`tuple\`, \`frozenset\` (cannot be modified after creation).
- **Mutable Types**: \`list\`, \`dict\`, \`set\` (can be modified in-place).`,
    codeSnippet: `# List Comprehension Example
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in numbers if x % 2 == 0]
print("Even Squares:", even_squares) # [4, 16, 36, 64, 100]

# Python Decorator Example
def log_execution(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] Executing {func.__name__}...")
        return func(*args, **kwargs)
    return wrapper`,
    suggestedFollowUps: [
      "Explain Python Global Interpreter Lock (GIL)",
      "How does Python memory management work?",
      "How to build REST APIs with FastAPI?",
    ],
  },

  // 4. Databases & SQL
  {
    keywords: ["sql", "normalization", "database", "join", "query"],
    response: `Database Normalization is the process of structuring a relational database to minimize data redundancy and improve data integrity (1NF, 2NF, 3NF, BCNF).

### Normal Forms Breakdown:
- **1NF**: Eliminate duplicate columns and ensure atomic values in every cell.
- **2NF**: Meet 1NF + remove partial dependencies (all non-key attributes depend on whole primary key).
- **3NF**: Meet 2NF + remove transitive dependencies (non-key attributes depend ONLY on primary key).`,
    codeSnippet: `-- Join Example: Fetching Student Course Enrollments
SELECT 
    s.student_id,
    s.full_name,
    c.course_title,
    e.enrollment_date,
    e.grade
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE e.status = 'active'
ORDER BY e.enrollment_date DESC;`,
    suggestedFollowUps: [
      "Explain ACID properties in SQL transactions",
      "What is the difference between SQL and NoSQL?",
      "How does B-Tree indexing speed up SQL queries?",
    ],
  },

  // 5. Java
  {
    keywords: ["java", "oop", "interface", "multithreading", "spring"],
    response: `Java is a robust, object-oriented, strongly-typed language that runs on the Java Virtual Machine (JVM) via "Write Once, Run Anywhere" (WORA).

### Key Java Features:
- **Encapsulation**: Hiding internal data members via private fields and public getters/setters.
- **Inheritance**: Extending class capabilities using \`extends\`.
- **Polymorphism**: Overloading and overriding methods.
- **Abstraction**: Defining contracts with Interfaces and Abstract Classes.`,
    codeSnippet: `public class StudentAccount {
    private String id;
    private String name;

    public StudentAccount(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }
}`,
    suggestedFollowUps: [
      "Explain Java Streams API with filter & map",
      "What is the difference between JDK, JRE, and JVM?",
      "How does Spring Boot Dependency Injection work?",
    ],
  },

  // 6. Software Engineering & Git
  {
    keywords: ["git", "sdlc", "agile", "uml", "branch", "testing"],
    response: `Git is a distributed version control system that tracks changes in source code during software development.

### Recommended Git Branching Workflow (Gitflow):
1. **\`main\` / \`master\`**: Always production-ready code.
2. **\`develop\`**: Integration branch for upcoming features.
3. **\`feature/feature-name\`**: Isolated feature development branched off \`develop\`.
4. **\`hotfix/fix-name\`**: Emergency bug fixes branched off \`main\`.`,
    codeSnippet: `# Standard Git Workflow Commands
git checkout -b feature/user-auth
git add .
git commit -m "feat(auth): implement Google OAuth sign-in flow"
git push origin feature/user-auth`,
    suggestedFollowUps: [
      "Explain Agile Scrum Sprints vs Kanban",
      "What is Test-Driven Development (TDD)?",
      "How to write effective Git commit messages?",
    ],
  },

  // 7. Career, Interviews & CV
  {
    keywords: ["career", "interview", "cv", "resume", "roadmap"],
    response: `Preparing for a Software Engineering role requires balancing technical coding skills with behavioral preparation.

### Actionable Preparation Checklist:
1. **Resume & Portfolio**: Highlight 2-3 production projects with measurable metrics (e.g., *"Built Next.js 16 RAG SaaS serving 1.2k active students"*).
2. **Coding Interviews (STAR Method)**: Practice Situation, Task, Action, Result responses for behavioral questions.
3. **System Design Basics**: Learn Load Balancing, Caching (Redis), Database Sharding, and REST/gRPC API design.`,
    suggestedFollowUps: [
      "Review my software engineer resume bullets",
      "How to answer 'Tell me about a technical challenge you solved'?",
      "Suggest full-stack portfolio project ideas",
    ],
  },

  // 8. Capstone & Project Mentor
  {
    keywords: ["project", "idea", "tech stack", "capstone", "architecture"],
    response: `Here is a production-grade Capstone Project idea for your portfolio:

### Project Idea: **AI-Powered Code Reviewer & Automated Grading Engine**
- **Frontend**: Next.js 16 (App Router, Tailwind CSS, Lucide icons, Dark Mode).
- **Backend API**: Python FastAPI + Pydantic + Supabase Vector.
- **Core Features**:
  1. Student GitHub repo submission integration.
  2. Automatic static code analysis & linting.
  3. AI-generated rubric feedback & score breakdown.
  4. Interactive dashboard with progress analytics.`,
    suggestedFollowUps: [
      "Break this project into a 4-week sprint milestone schedule",
      "How to configure docker-compose for Next.js + FastAPI + Postgres?",
      "What database schema should I use for user submissions?",
    ],
  },
];
