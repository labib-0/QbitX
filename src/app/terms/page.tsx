import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="space-y-3 border-b border-border pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-500 font-heading">Legal & Compliance</span>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Last updated: November 2026</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using QbitX, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion, please discontinue platform use immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Academic Integrity & Code Conduct</h2>
            <p>
              QbitX emphasizes authentic, project-based engineering development. Students are expected to complete original coursework. Plagiarism or unauthorized automation of assessments compromises credential verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. Platform Services & Availability</h2>
            <p>
              We strive for continuous platform availability but do not warrant uninterrupted access. Maintenance windows and scheduled updates will be communicated via administrative announcements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Governing Law</h2>
            <p>
              These Terms are governed by applicable regional and international educational technology compliance standards.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
