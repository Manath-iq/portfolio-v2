import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { NicheMarquee } from '@/components/sections/NicheMarquee'
import { Showcase } from '@/components/sections/Showcase'
import { Comparison } from '@/components/sections/Comparison'
import { Bento } from '@/components/sections/Bento'
import { StickyFeatures } from '@/components/sections/StickyFeatures'
import { Pricing } from '@/components/sections/Pricing'
import { About } from '@/components/sections/About'
import { Faq } from '@/components/sections/Faq'
import { LeadForm } from '@/components/sections/LeadForm'
import { Footer } from '@/components/sections/Footer'
import { JsonLd } from '@/components/JsonLd'

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <NicheMarquee />
        <Showcase />
        <Comparison />
        <Bento />
        <StickyFeatures />
        <Pricing />
        <About />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
    </>
  )
}
