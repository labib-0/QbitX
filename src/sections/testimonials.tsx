"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer @ TechCorp",
    content: "QbitX completely changed how I learn. Building real projects with AI guidance helped me land my first job faster than any bootcamp could have.",
  },
  {
    name: "Sarah Williams",
    role: "Computer Science Student",
    content: "The AI Mentor is incredible. It doesn't just give you the answer, it teaches you how to think like a software engineer. Highly recommended!",
  },
  {
    name: "Michael Chen",
    role: "Full Stack Engineer",
    content: "The industry readiness track is no joke. I learned Docker, CI/CD, and system design—stuff they never taught us in university.",
  },
  {
    name: "Emily Davis",
    role: "Software Engineer Intern",
    content: "The collaborative team projects prepared me perfectly for my internship. I already knew how to work with Jira, Git, and code reviews.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Don't Just Take Our Word For It</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how QbitX is transforming students into industry-ready engineers.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-8 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((t, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1 h-full">
                    <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm h-full justify-between">
                      <div>
                        <Quote className="h-8 w-8 text-primary/20 mb-4" />
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                          "{t.content}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{t.name}</h4>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-8" />
            <CarouselNext className="-right-4 md:-right-8" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
