"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Clock, Gauge } from "lucide-react"

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack marketplace with Stripe payments, cart management, and an admin dashboard.",
    difficulty: "Advanced",
    duration: "4 Weeks",
    tech: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "AI Chatbot",
    description: "An intelligent conversational agent using OpenAI APIs, streaming responses, and conversation history.",
    difficulty: "Intermediate",
    duration: "2 Weeks",
    tech: ["React", "Node.js", "OpenAI", "Tailwind"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "IoT Flood Monitoring",
    description: "A real-time dashboard displaying sensor data from IoT devices with predictive alerts.",
    difficulty: "Advanced",
    duration: "3 Weeks",
    tech: ["Vue.js", "Python", "MQTT", "PostgreSQL"],
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Hospital Management",
    description: "A robust system for patient records, appointment scheduling, and doctor availability tracking.",
    difficulty: "Advanced",
    duration: "5 Weeks",
    tech: ["Java Spring", "React", "MySQL", "Docker"],
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    title: "Weather App",
    description: "A beautiful weather forecast application utilizing geolocation and third-party weather APIs.",
    difficulty: "Beginner",
    duration: "1 Week",
    tech: ["HTML/CSS", "JavaScript", "REST APIs"],
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Library Management",
    description: "A core CRUD application to manage book inventory, borrowing logs, and user memberships.",
    difficulty: "Beginner",
    duration: "2 Weeks",
    tech: ["Node.js", "Express", "MongoDB", "EJS"],
    color: "from-amber-500/20 to-yellow-500/20",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Project Showcase</h2>
            <p className="text-muted-foreground text-lg">
              Stop watching tutorials. Start building the applications that employers actually want to see on your resume.
            </p>
          </div>
          <Button variant="outline" className="rounded-full">
            View All Projects <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Fake Project Thumbnail / Gradient */}
              <div className={`h-40 w-full bg-gradient-to-br ${project.color} flex items-center justify-center p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.2] mix-blend-overlay"></div>
                <h3 className="text-2xl font-bold text-foreground/80 tracking-tight z-10 text-center mix-blend-color-burn dark:mix-blend-color-dodge">
                  {project.title}
                </h3>
              </div>
              
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <Gauge className="mr-1 h-3.5 w-3.5" />
                    {project.difficulty}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {project.duration}
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold mb-2 line-clamp-1">{project.title}</h4>
                <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {project.tech.map(t => (
                    <Badge key={t} variant="secondary" className="bg-muted hover:bg-muted font-normal text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
