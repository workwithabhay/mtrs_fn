import { Navbar } from '@/components/marketing/navbar';
import { Hero } from '@/components/marketing/hero';
import { ValueProposition } from '@/components/marketing/value-proposition';
import { BusinessShowcase } from '@/components/marketing/business-showcase';
import { Features } from '@/components/marketing/features';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Testimonials } from '@/components/marketing/testimonials';
import { Pricing } from '@/components/marketing/pricing';
import { FAQ } from '@/components/marketing/faq';
import { CtaBanner } from '@/components/marketing/cta-banner';
import { Footer } from '@/components/marketing/footer';
import { SplashScreen } from '@/components/ui/splash-screen';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text-primary selection:bg-indigo-100 selection:text-indigo-900">
      {/* 2000ms Fluid WarpText Splash Screen */}
      <SplashScreen duration={2000} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg shadow-elevated focus-ring"
      >
        Skip to main content
      </a>

      <Navbar />
    
      <main id="main-content" className="flex-1">
        <Hero />
        <ValueProposition />
        <BusinessShowcase />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
