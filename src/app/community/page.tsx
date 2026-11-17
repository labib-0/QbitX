import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Users, MessageSquare, Award, Sparkles, ExternalLink } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="space-y-3 border-b border-border pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 font-heading">Near-Peer Network & Discussion</span>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">QbitX Engineering Community</h1>
          <p className="text-xs text-muted-foreground">Collaborate with peers, participate in coding study guilds, and exchange feedback with senior mentors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 w-fit">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-foreground font-heading">Learning Families & Study Guilds</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every enrolled student is paired with a near-peer cohort group guided by an experienced senior mentor. Weekly synchronous office hours help tackle tough algorithmic concepts.
            </p>
            <Link href="/register/student" className="text-xs font-bold text-indigo-500 hover:underline inline-flex items-center gap-1">
              <span>Join a Guild</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-foreground font-heading">Lesson Q&A & Discussions</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engage directly in lesson discussion boards. Post queries, share insights, upvote high-quality explanations, and collaborate on code reviews with fellow students.
            </p>
            <Link href="/login/student" className="text-xs font-bold text-emerald-500 hover:underline inline-flex items-center gap-1">
              <span>Access Discussions</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
