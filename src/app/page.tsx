import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { NicheMarquee } from '@/components/sections/NicheMarquee'
import { Showcase } from '@/components/sections/Showcase'
import { Comparison } from '@/components/sections/Comparison'
import { Bento } from '@/components/sections/Bento'
import { StickyFeatures } from '@/components/sections/StickyFeatures'
import { Pricing } from '@/components/sections/Pricing'
import { Process } from '@/components/sections/Process'
import { About } from '@/components/sections/About'
import { Faq } from '@/components/sections/Faq'
import { Geo } from '@/components/sections/Geo'
import { LeadForm } from '@/components/sections/LeadForm'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { JsonLd } from '@/components/JsonLd'
import { Spotlight } from '@/components/ui/Spotlight'

export default function Home() {
  return (
    <div className="relative isolate">
      <JsonLd />
      {/* Свечение первое из двух на всю страницу. Второе — под формой заявки.
          Стоит выше шапки, чтобы дотягиваться до самой кромки документа. */}
      <Spotlight />
      <Header />
      <main className="relative">
        <Hero />
        <NicheMarquee />
        <Showcase />
        <Comparison />
        <Bento />
        <StickyFeatures />
        <Pricing />
        {/* Сразу после цифры: следующий вопрос человека — «а что если
            не понравится», и ответ на него стоит рядом с ценой, а не в конце. */}
        <Process />
        <About />
        <Faq />
        <Geo />
        <LeadForm />
      </main>
      <Footer />
      <MobileBar />
    </div>
  )
}
