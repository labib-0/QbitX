"use client"

import { motion } from "framer-motion"
import { Bot, Terminal, Code2, Sparkles } from "lucide-react"

export function AiMentorSection() {
  return (
    <section id="mentor" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Available 24/7
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Never get stuck again with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Personal AI Mentor</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Unlike traditional courses where you wait days for a forum reply, QbitX gives you instant, contextual help. Our AI doesn't just write the code for you—it guides you to the solution so you actually learn.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Context-aware code reviews",
                "Hints instead of direct answers",
                "Explanation of complex concepts",
                "Real-time bug squashing"
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Code2 className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Interactive Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-cyan-400/30 blur-3xl -z-10 rounded-[3rem] opacity-50" />
            
            <div className="rounded-2xl border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Fake Window Header */}
              <div className="h-12 border-b bg-muted/50 flex items-center px-4 justify-between">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-muted-foreground flex items-center">
                  <Terminal className="h-3 w-3 mr-2" />
                  App.tsx
                </div>
              </div>

              {/* Layout Split */}
              <div className="flex flex-1 overflow-hidden">
                {/* Code Panel */}
                <div className="w-1/2 border-r bg-[#09090b] p-4 text-xs font-mono overflow-y-auto">
                  <pre className="text-zinc-300">
<span className="text-purple-400">import</span> {"{"} useState, useEffect {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">'react'</span>;

<span className="text-purple-400">export default function</span> <span className="text-blue-300">WeatherApp</span>() {"{"}
  <span className="text-purple-400">const</span> [data, setData] = <span className="text-blue-300">useState</span>(<span className="text-cyan-300">null</span>);

  <span className="text-gray-500">// I keep getting an infinite loop here!</span>
  <span className="text-blue-300">useEffect</span>(() {"=>"} {"{"}
    <span className="text-blue-300">fetchData</span>();
  {"}"});

  <span className="text-purple-400">return</span> (
    <span className="text-gray-400">{"<"}</span><span className="text-red-400">div</span><span className="text-gray-400">{">"}</span>
      ...
    <span className="text-gray-400">{"</"}</span><span className="text-red-400">div</span><span className="text-gray-400">{">"}</span>
  )
{"}"}
                  </pre>
                </div>

                {/* Chat Panel */}
                <div className="w-1/2 flex flex-col bg-card">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground mb-1 mr-1">You</span>
                      <div className="bg-muted text-sm p-3 rounded-2xl rounded-tr-sm max-w-[90%]">
                        Why is my API calling infinitely? My browser is crashing!
                      </div>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-muted-foreground mb-1 ml-1 flex items-center">
                        <Bot className="h-3 w-3 mr-1" /> Mentor
                      </span>
                      <div className="bg-primary/10 border border-primary/20 text-sm p-3 rounded-2xl rounded-tl-sm max-w-[95%]">
                        I see the issue! Look at your <code>useEffect</code> on line 7. <br/><br/>
                        Notice how it's missing a dependency array? Without it, the effect runs on <strong>every</strong> render, causing an infinite loop.
                        <br/><br/>
                        Try adding an empty array <code>[]</code> as the second argument.
                      </div>
                    </div>

                  </div>
                  <div className="p-3 border-t bg-muted/30">
                    <div className="h-8 bg-background rounded-full border px-3 flex items-center text-xs text-muted-foreground">
                      Reply to Mentor...
                    </div>
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
