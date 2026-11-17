import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { BookOpen, Terminal, Code2, Cpu, ExternalLink } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="space-y-3 border-b border-border pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-500 font-heading">Developer Guide & Curriculum</span>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">Platform Documentation</h1>
          <p className="text-xs text-muted-foreground">Architectural overview, workspace guidelines, and curriculum roadmap documentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 w-fit">
              <Terminal className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-foreground font-heading">Workspace & Coding Environment</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Learn how to navigate video lessons, complete code challenges, run unit test evaluations, and save notes in your dedicated learning workspace.
            </p>
            <Link href="/register/student" className="text-xs font-bold text-sky-500 hover:underline inline-flex items-center gap-1">
              <span>Start Learning</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit">
              <Code2 className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-foreground font-heading">GitHub Project Submissions</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Guidelines for organizing repository structure, writing clean commit messages, setting up live demo deployments, and submitting capstone deliverables for mentor evaluation.
            </p>
            <Link href="/register/student" className="text-xs font-bold text-purple-500 hover:underline inline-flex items-center gap-1">
              <span>Submission Guidelines</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
