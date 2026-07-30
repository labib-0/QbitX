"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Bot, Code2, LineChart, Terminal, Calendar, Code, Database, Globe, Cpu } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 bg-background">
      {/* Highly Animated Live Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -left-[15%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
        />

        {/* Floating Tech Particles */}
        {[Code, Database, Globe, Cpu, Code2].map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: "100vh", x: Math.random() * 400 - 200 }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              y: ["100vh", "-20vh"], 
              x: Math.random() * 400 - 200,
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2.5
            }}
            className="absolute text-primary/30"
            style={{
              left: `${15 + i * 15}%`,
            }}
          >
            <Icon size={40 + Math.random() * 30} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Headlines (Left Aligned) */}
          <div className="flex-1 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-primary leading-tight">
                From Potential<br />
                <span className="text-cyan-500">
                  To Progress.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                An AI-powered project-based learning platform that transforms curious students into confident software engineers through guided projects, mentorship, and industry-ready roadmaps.
              </p>
            </motion.div>

            {/* Next Batch Schedule Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 mb-8 inline-flex flex-col sm:flex-row items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border shadow-sm w-fit"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Next Batch Schedule</p>
                  <p className="text-muted-foreground">Enrollment starts & ends</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border"></div>
              <div className="text-sm font-medium text-primary">
                August 1 - August 10, 2026
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button size="lg" className="h-12 px-8 text-base rounded shadow-md hover:shadow-lg transition-all bg-sky-500 hover:bg-sky-600 text-white" render={<Link href="/register/student" />}>
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded" render={<Link href="#roadmaps" />}>
                Explore Roadmaps
              </Button>
            </motion.div>
          </div>

          {/* Dashboard Preview UI (Right Aligned) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-1 w-full relative mt-8 lg:mt-0"
          >
            <div className="relative rounded-lg border bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden border-t-4 border-t-cyan-500">
              {/* Fake Window Header */}
              <div className="h-10 border-b flex items-center px-4 space-x-2 bg-muted/30">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* AI Mentor Chat Snippet */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="rounded-lg border bg-background p-4 shadow-sm h-full space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">AI Mentor</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">You</span>
                        </div>
                        <div className="bg-muted p-3 rounded-xl rounded-tl-none text-sm w-[85%]">
                          I&apos;m stuck on how to implement the custom hook for the weather API.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-primary/5 p-3 rounded-xl rounded-tl-none text-sm w-[85%] border border-primary/10">
                          Let&apos;s solve it together! A good approach is to use <code>useEffect</code> to fetch data and store it in state. Here is a starting template...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Stats / Progress */}
                <div className="space-y-4">
                  <div className="rounded-lg border bg-background p-4 shadow-sm flex flex-col items-center justify-center space-y-2 py-6">
                    <LineChart className="h-8 w-8 text-cyan-500" />
                    <span className="font-semibold">Skill Graph</span>
                    <span className="text-xs text-muted-foreground">React Proficiency: 78%</span>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background p-4 shadow-sm flex flex-col items-center justify-center space-y-2 py-6">
                    <Terminal className="h-8 w-8 text-primary" />
                    <span className="font-semibold">Current Project</span>
                    <span className="text-xs text-muted-foreground">Weather Dashboard</span>
                    <Button size="sm" className="w-full mt-2 h-8 text-xs" render={<Link href="/student/dashboard" />}>
                      Resume Coding
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
