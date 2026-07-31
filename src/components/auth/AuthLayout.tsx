"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronDown, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustrationType?: "login" | "register";
  title?: string;
  subtitle?: string;
  role?: "student" | "mentor";
  showDemoAdminBanner?: boolean;
}

const MOTIVATIONAL_QUOTES = [
  { text: "Empower Your Engineering Career with 24/7 AI Mentorship", author: "QbitX Platform" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Build real software, transform curious students into confident engineers.", author: "QbitX Team" },
  { text: "Great software is built by relentless practice and curious minds.", author: "AI Code Tutor" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Turn code errors into breakthroughs through guided mentorship.", author: "QbitX Engineering" },
  { text: "Every expert was once a beginner who refused to give up.", author: "CS Roadmap" },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/login");

  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Pick a random motivational quote on every page load/refresh
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col justify-between relative font-sans antialiased">
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo_transparent_low_res.png" 
                alt="QbitX Logo" 
                width={140} 
                height={45} 
                className="object-contain"
                priority
              />
            </Link>

            {/* Center Header Links */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-extrabold text-slate-600 dark:text-slate-300 font-heading">
              <Link href="/" className="hover:text-sky-500 transition-colors">Course Details</Link>
              <Link href="/" className="hover:text-sky-500 transition-colors">Success Stories</Link>
              <Link href="/" className="hover:text-sky-500 transition-colors">Problem Solvers Club</Link>
              <Link href="/" className="hover:text-sky-500 transition-colors">Bootcamps / Events</Link>
              <div className="flex items-center gap-1 cursor-pointer hover:text-sky-500 transition-colors">
                <span>More</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 text-xs font-extrabold font-heading">
              <ThemeToggle />
              
              <Link
                href="/login/student"
                className={`px-4.5 py-2.5 rounded-xl border transition-all ${
                  isLoginPage
                    ? "border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-950/40"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register/student"
                className="px-4.5 py-2.5 rounded-xl text-white transition-all shadow-md bg-sky-500 hover:bg-sky-600 shadow-sky-500/20"
              >
                Registration
              </Link>
            </div>

          </div>
        </header>

        {/* Main Content Area - Form centered in middle */}
        <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-xl xl:max-w-2xl mx-auto flex justify-center my-auto">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 md:p-10 space-y-6 w-full">
              {children}
            </div>
          </div>
        </main>

        {/* Thinner, Wider Footer-Style Motivation Banner (Separate from real footer) */}
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 my-6">
          <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-slate-950 text-white p-6 sm:p-8 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Background Image Overlay */}
            <Image
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600"
              alt="QbitX Inspiration"
              fill
              className="object-cover opacity-20"
            />

            <div className="relative z-10 space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase bg-sky-500 text-white px-3 py-1 rounded-lg shadow-md font-heading">
                <Sparkles className="h-3.5 w-3.5" />
                <span>QbitX Daily Inspiration</span>
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading leading-snug">
                &ldquo;{currentQuote.text}&rdquo;
              </h3>
            </div>

            <div className="relative z-10 shrink-0 text-left md:text-right w-full md:w-auto">
              <span className="text-xs font-bold text-sky-400 font-heading block">— {currentQuote.author}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Refreshes every session ⚡</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-muted-foreground font-medium">
          © {new Date().getFullYear()} QbitX. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
