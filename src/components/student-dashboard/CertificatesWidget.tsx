"use client";

import { useState } from "react";
import { Award, CheckCircle2, Lock, Download, Share2, Eye, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/authContext";

export function CertificatesWidget() {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const certificates = [
    {
      id: "c1",
      title: "Full-Stack AI Web Engineer Certification",
      issuer: "QbitX & Stanford PASS Guild",
      date: "Jul 15, 2026",
      status: "Verified",
      credentialId: "QBIT-2026-AI-8819",
      skills: ["Next.js 16", "TypeScript", "RAG Pipelines", "FastAPI"],
    },
    {
      id: "c2",
      title: "Advanced Data Structures & Algorithms",
      issuer: "QbitX CS Department",
      date: "Jun 20, 2026",
      status: "Completed",
      credentialId: "QBIT-2026-DSA-4402",
      skills: ["Graph Theory", "Dynamic Programming", "Big-O Analysis"],
    },
    {
      id: "c3",
      title: "DevOps & Kubernetes Cloud Specialist",
      issuer: "QbitX Cloud Guild",
      date: "Expected Aug 2026",
      status: "Locked",
      credentialId: "In Progress (45%)",
      skills: ["Docker", "Kubernetes", "Helm", "CI/CD Pipelines"],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <span>Verified Credentials & Certificates</span>
          </h2>
          <p className="text-xs text-muted-foreground">Shareable cryptographically verified credentials for your LinkedIn profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                  cert.status === "Verified"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : cert.status === "Completed"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {cert.status === "Verified" && <ShieldCheck className="h-3 w-3" />}
                  {cert.status}
                </span>

                <span className="text-[10px] font-mono text-muted-foreground">{cert.date}</span>
              </div>

              <h3 className="font-extrabold text-base text-foreground font-heading">{cert.title}</h3>
              <p className="text-xs text-muted-foreground">Issued by: <strong className="text-foreground font-semibold">{cert.issuer}</strong></p>

              <div className="flex flex-wrap gap-1">
                {cert.skills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border/50">
              <button
                disabled={cert.status === "Locked"}
                onClick={() => setSelectedCert(cert)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white border border-sky-500/20 py-2 text-xs font-bold transition-all disabled:opacity-40"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>

              <button
                disabled={cert.status === "Locked"}
                onClick={() => {
                  // Open preview then trigger print
                  setSelectedCert(cert);
                  setTimeout(() => window.print(), 400);
                }}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors disabled:opacity-40"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                disabled={cert.status === "Locked"}
                onClick={() => {
                  const link = `https://qbitx.vercel.app/credentials/${cert.credentialId}`;
                  navigator.clipboard.writeText(link).then(() => {
                    setCopiedId(cert.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  });
                }}
                className={`p-2 rounded-xl transition-colors disabled:opacity-40 ${
                  copiedId === cert.id
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                title={copiedId === cert.id ? "Copied!" : "Share Certificate"}
              >
                {copiedId === cert.id ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-sky-500/30 bg-card p-8 space-y-6 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold"
            >
              ✕
            </button>

            <div className="space-y-3 border-4 border-double border-sky-500/30 p-6 rounded-2xl bg-gradient-to-b from-sky-500/5 to-transparent">
              <ShieldCheck className="h-12 w-12 mx-auto text-sky-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">Official QbitX Certificate of Completion</span>
              <h2 className="text-2xl font-black text-foreground font-heading">{selectedCert.title}</h2>
              <p className="text-xs text-muted-foreground">This is to certify that <strong>{user?.name || "Student"}</strong> has successfully mastered all modules and practical assessments.</p>

              <div className="pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <span>Credential ID: <strong className="font-mono text-foreground">{selectedCert.credentialId}</strong></span>
                <span>Date: <strong className="text-foreground">{selectedCert.date}</strong></span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => setSelectedCert(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-muted text-foreground">Close</button>
              <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-600">Download Official PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
