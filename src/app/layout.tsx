import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/authContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://qbitx.vercel.app"),
  title: {
    default: "QbitX | AI-Powered Project-Based EdTech Platform",
    template: "%s | QbitX",
  },
  description: "An AI-powered project-based learning platform that transforms curious students into confident software engineers through guided projects, mentorship, and industry-ready roadmaps.",
  keywords: [
    "QbitX",
    "EdTech",
    "Software Engineering",
    "AI Code Tutor",
    "Project-Based Learning",
    "Mentorship",
    "Coding Roadmaps"
  ],
  authors: [{ name: "QbitX Team" }],
  openGraph: {
    title: "QbitX | AI-Powered Project-Based EdTech Platform",
    description: "An AI-powered project-based learning platform that transforms curious students into confident software engineers through guided projects, mentorship, and industry-ready roadmaps.",
    url: "https://qbitx.vercel.app",
    siteName: "QbitX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QbitX | AI-Powered Project-Based EdTech Platform",
    description: "An AI-powered project-based learning platform that transforms curious students into confident software engineers through guided projects, mentorship, and industry-ready roadmaps.",
    creator: "@qbitx",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
