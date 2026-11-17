import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="space-y-3 border-b border-border pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-500 font-heading">Legal & Compliance</span>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: November 2026</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
            <p>
              QbitX collects minimal information necessary to deliver our educational platform, including your name, email address, academic institution, track preferences, and learning progress.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Code & Project Submissions</h2>
            <p>
              When submitting GitHub repositories or code snippets for AI mentor review or mentor grading, your code is processed securely for pedagogical feedback. We do not sell or monetize student proprietary code.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. Data Retention & Account Deletion</h2>
            <p>
              You maintain full ownership of your student data. You may request permanent deletion of your account and learning records at any time from your Account Settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Contact & Inquiries</h2>
            <p>
              For privacy requests or questions regarding data protection, please contact the QbitX engineering team at privacy@qbitx.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
