import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/sections/hero"
import { HowItWorksSection } from "@/sections/how-it-works"
import { FeaturesSection } from "@/sections/features"
import { StatisticsSection } from "@/sections/statistics"
import { FaqSection } from "@/sections/faq"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatisticsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
