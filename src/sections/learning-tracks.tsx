"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const tracks = [
  {
    title: "Fresher Track",
    description: "For absolute beginners looking to build a strong foundation in programming and web development.",
    duration: "3 Months",
    skills: ["HTML/CSS", "JavaScript Basics", "Git & GitHub", "Responsive Design"],
    projects: "3 Portfolio Projects",
    popular: false,
  },
  {
    title: "Sophomore Track",
    description: "For students with basic knowledge ready to tackle full-stack development and modern frameworks.",
    duration: "6 Months",
    skills: ["React & Next.js", "Node.js & Express", "Databases (SQL/NoSQL)", "API Integration"],
    projects: "5 Full-Stack Projects",
    popular: true,
  },
  {
    title: "Industry Ready Track",
    description: "The ultimate preparation for software engineering interviews and day-one job readiness.",
    duration: "4 Months",
    skills: ["System Design", "CI/CD & Docker", "Advanced Algorithms", "Agile Collaboration"],
    projects: "2 Enterprise Projects",
    popular: false,
  },
]

export function LearningTracksSection() {
  return (
    <section id="roadmaps" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Structured Learning Tracks</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the path that fits your current skill level and let our AI mentor guide you through.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tracks.map((track, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border bg-card shadow-sm ${
                track.popular ? 'border-primary ring-1 ring-primary shadow-primary/10 scale-105 z-10' : 'hover:border-primary/50'
              } transition-all duration-300`}
            >
              {track.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
                <p className="text-muted-foreground text-sm h-10">{track.description}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-border/50">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">{track.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Estimated completion time</p>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Skills Learned</h4>
                  <ul className="space-y-2">
                    {track.skills.map((skill, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-3">Included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2" />
                      {track.projects}
                    </li>
                  </ul>
                </div>
              </div>

              <Button 
                variant={track.popular ? 'default' : 'outline'} 
                className={`w-full rounded-full ${track.popular ? 'shadow-lg hover:shadow-primary/25' : ''}`}
              >
                Explore Track
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
