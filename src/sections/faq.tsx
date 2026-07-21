"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is QbitX suitable for absolute beginners?",
    answer: "Yes! Our Fresher Track is designed specifically for those with zero coding experience. The AI mentor will guide you step-by-step through fundamental concepts before moving you onto complex projects.",
  },
  {
    question: "How is this different from traditional online courses?",
    answer: "Traditional courses focus on passive video consumption. QbitX focuses on active, project-based learning. You spend your time writing code, solving real problems, and getting personalized, contextual feedback from our AI mentor.",
  },
  {
    question: "Can I use the projects in my portfolio?",
    answer: "Absolutely. In fact, we encourage it. Every project you build on QbitX is yours. Our platform even helps you automatically generate a stunning portfolio website to showcase your work to employers.",
  },
  {
    question: "How does the AI Mentor work?",
    answer: "The AI Mentor integrates directly into your coding environment. When you get stuck, it analyzes your specific code context and provides hints, explanations, and guidance rather than just giving you the answer. It simulates a real senior engineer pairing with you.",
  },
  {
    question: "Do you offer team or university plans?",
    answer: "Yes! We are currently rolling out custom plans for universities and coding bootcamps. This includes admin dashboards, analytics, and custom learning tracks. Contact us for more details.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
