"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

function AnimatedCounter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const stepTime = duration / steps
      const stepValue = value / steps
      
      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepTime)
      
      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

const stats = [
  {
    id: 1,
    value: 600,
    suffix: "+",
    label: "Competitive Programmers",
  },
  {
    id: 2,
    value: 6500,
    suffix: "+",
    label: "Academic Successes",
  },
  {
    id: 3,
    value: 200,
    suffix: "+",
    label: "Job Placements",
  },
]

export function StatisticsSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-2"
            >
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
