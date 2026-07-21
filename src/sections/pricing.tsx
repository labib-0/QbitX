"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    description: "Everything you need to kickstart your software engineering journey.",
    price: "$0",
    period: "/month",
    features: [
      "Access to basic projects",
      "Community forum access",
      "Standard AI Mentorship (100 msgs/mo)",
      "Basic Portfolio Generation",
    ],
    cta: "Get Started Free",
    comingSoon: false,
  },
  {
    name: "Pro",
    description: "Advanced features for serious learners aiming for top-tier companies.",
    price: "$29",
    period: "/month",
    features: [
      "All Free features",
      "Unlimited AI Mentorship",
      "Advanced System Design projects",
      "1-on-1 Code Reviews",
      "Premium Resume Builder",
    ],
    cta: "Coming Soon",
    comingSoon: true,
  },
  {
    name: "University",
    description: "Custom plans for institutions and coding bootcamps.",
    price: "Custom",
    period: "",
    features: [
      "All Pro features",
      "Custom learning tracks",
      "Admin dashboard & analytics",
      "White-labeled portfolio",
      "Dedicated account manager",
    ],
    cta: "Coming Soon",
    comingSoon: true,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Invest in your future. Start for free and upgrade when you're ready to accelerate your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col p-8 rounded-3xl border bg-card ${
                !plan.comingSoon ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : ''
              }`}
            >
              {plan.comingSoon && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">Coming Soon</Badge>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-muted-foreground font-medium">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className={`h-4 w-4 mr-3 shrink-0 ${plan.comingSoon ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span className={plan.comingSoon ? 'text-muted-foreground' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.comingSoon ? 'outline' : 'default'}
                disabled={plan.comingSoon}
                className={`w-full rounded-full h-12 text-base ${!plan.comingSoon ? 'shadow-lg hover:shadow-primary/25' : ''}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
