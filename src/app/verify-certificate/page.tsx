import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheck, CheckCircle2, Award, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function VerifyCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 font-heading">
            Official Credential Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
            Verified Educational Credential
          </h1>
        </div>

        {id ? (
          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-card space-y-6 shadow-xl relative overflow-hidden text-center">
            <div className="space-y-2 border-b border-border pb-6">
              <span className="text-[11px] font-mono font-bold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full">
                Credential ID: {id}
              </span>
              <h2 className="text-xl font-extrabold text-foreground font-heading mt-2">
                Certificate of Academic & Project Mastery
              </h2>
              <p className="text-xs text-muted-foreground">
                Issued by QbitX Platform & Faculty Curriculum Committee
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-muted/40 p-4 rounded-2xl border border-border">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Verification Status</span>
                <span className="font-extrabold text-emerald-500 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cryptographically Valid
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Issuer Authority</span>
                <span className="font-extrabold text-foreground mt-0.5 block">QbitX Engineering Academy</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register/student"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
              >
                <span>Learn More About QbitX Curriculum</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl border border-border bg-card text-center space-y-4">
            <p className="text-sm text-muted-foreground">Please provide a valid Credential ID parameter to verify certification.</p>
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold inline-block">
              Return Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
