"use client"

import { motion } from "framer-motion"
import { Bot, Code, Map, Users, FileText, Briefcase } from "lucide-react"

const features = [
  {
    title: "1:1 Mentorship",
    description: "A team of skilled mentors will be by your side. If necessary, they will sit with you separately on Google Meet to plan, solve problems, and guide you towards your goal.",
    icon: Users,
  },
  {
    title: "Live Support Sessions",
    description: "Ask questions directly in live classes on our system every day, share your screen and show problems. Get solutions. If you don't understand something, have it explained a thousand times.",
    icon: Bot,
  },
  {
    title: "Problem Solvers Club",
    description: "For those who want to excel in competitive programming and top tier contests. Intensive guidelines will increase efficiency.",
    icon: Code,
  },
  {
    title: "Guided Environment",
    description: "Learn with us through structured modules, videos, conceptual sessions, and assignments in the best environment in the country.",
    icon: Map,
  },
  {
    title: "24/7 Community Support",
    description: "24 hours a day, 7 days a week, wherever you have a problem, you will easily find a solution. In our dedicated community group and custom helpdesk platform.",
    icon: Briefcase,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Core Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlimited help and guidelines. Join this platform to solve problems together.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-lg border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
