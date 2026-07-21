"use client"

import { motion } from "framer-motion"
import { BookOpen, Wrench, Users, MessageSquareCode, TrendingUp, Trophy } from "lucide-react"

const steps = [
  { id: 1, title: "Learn", icon: BookOpen, description: "Absorb core concepts through concise, high-quality material.", gradient: "from-blue-600/10 to-cyan-400/10 hover:from-blue-600 hover:to-cyan-400", iconColor: "text-blue-500", textHover: "group-hover:text-white" },
  { id: 2, title: "Build", icon: Wrench, description: "Apply concepts immediately by building real applications.", gradient: "from-purple-600/10 to-pink-500/10 hover:from-purple-600 hover:to-pink-500", iconColor: "text-purple-500", textHover: "group-hover:text-white" },
  { id: 3, title: "Collaborate", icon: Users, description: "Work with peers and learn modern Git workflows.", gradient: "from-emerald-500/10 to-teal-400/10 hover:from-emerald-500 hover:to-teal-400", iconColor: "text-emerald-500", textHover: "group-hover:text-white" },
  { id: 4, title: "Receive AI Feedback", icon: MessageSquareCode, description: "Get instant code reviews and mentorship.", gradient: "from-orange-500/10 to-red-500/10 hover:from-orange-500 hover:to-red-500", iconColor: "text-orange-500", textHover: "group-hover:text-white" },
  { id: 5, title: "Improve", icon: TrendingUp, description: "Refactor and optimize based on expert AI suggestions.", gradient: "from-indigo-500/10 to-violet-500/10 hover:from-indigo-500 hover:to-violet-500", iconColor: "text-indigo-500", textHover: "group-hover:text-white" },
  { id: 6, title: "Showcase", icon: Trophy, description: "Publish your project to your automatically generated portfolio.", gradient: "from-rose-500/10 to-orange-400/10 hover:from-rose-500 hover:to-orange-400", iconColor: "text-rose-500", textHover: "group-hover:text-white" },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A proven methodology to take you from a curious beginner to a confident software engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`rounded-2xl border border-border p-8 shadow-sm transition-all duration-500 relative group overflow-hidden bg-gradient-to-br ${step.gradient}`}
            >
              {/* Subtle hover background effect */}
              <motion.div 
                className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${step.textHover}`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <step.icon className={`w-32 h-32 ${step.iconColor} ${step.textHover} transition-colors duration-500`} />
              </motion.div>
              
              <div className="relative z-10 space-y-4">
                <motion.div 
                  className="h-14 w-14 rounded-xl bg-background/50 backdrop-blur-md flex items-center justify-center shadow-lg mb-6 group-hover:bg-white/20 transition-colors duration-500"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                >
                  <step.icon className={`h-7 w-7 ${step.iconColor} ${step.textHover} transition-colors duration-500`} />
                </motion.div>
                
                <h3 className={`text-2xl font-bold text-foreground flex items-center gap-3 transition-colors duration-500 ${step.textHover}`}>
                  <span className={`text-sm font-black px-2 py-1 rounded bg-background/50 backdrop-blur-md ${step.iconColor} ${step.textHover}`}>0{step.id}</span>
                  {step.title}
                </h3>
                <p className={`text-muted-foreground leading-relaxed text-base transition-colors duration-500 group-hover:text-white/90`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
