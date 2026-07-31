"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustrationType?: "login" | "register";
  title?: string;
  subtitle?: string;
  role?: "student" | "mentor";
  showDemoAdminBanner?: boolean;
}

export function AuthLayout({ children, illustrationType = "login" }: AuthLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/login");

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

        {/* Main Grid Container */}
        <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Form Container - PRIORITIZED on top for mobile/small screens, right side near top for desktop */}
          <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 w-full max-w-xl xl:max-w-2xl ml-auto">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 md:p-10 space-y-6 w-full">
              {children}
            </div>
          </div>

          {/* Graphic Banner - Placed BELOW form on mobile/tablet, left side on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5 flex items-center justify-center w-full mt-4 lg:mt-0">
            <div className="relative w-full max-w-xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <Image
                src={
                  illustrationType === "login"
                    ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
                    : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
                }
                alt="QbitX Auth Graphic"
                fill
                className="object-cover rounded-3xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent rounded-3xl flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs font-extrabold uppercase bg-sky-500 text-white px-3.5 py-1 rounded-lg w-fit shadow-md mb-2 font-heading">
                  QbitX EdTech Platform
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading leading-snug">
                  {illustrationType === "login"
                    ? "Empower Your Engineering Career with 24/7 AI Mentorship"
                    : "Start Your Coding Journey & Build Real Software"}
                </h3>
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-muted-foreground font-medium">
          © {new Date().getFullYear()} QbitX. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
