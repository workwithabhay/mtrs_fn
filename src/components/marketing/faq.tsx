'use client';

import * as React from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const faqs = [
    {
      q: 'How do customers access the feedback form?',
      a: 'Customers simply point their smartphone camera at your printed QR code (on a table tent, receipt, or door sticker). The camera opens your branded, mobile-optimized feedback page instantly in their browser.',
    },
    {
      q: 'Do customers need to download an app or sign in?',
      a: 'No app download or account creation is required for customers. The entire feedback flow runs in modern mobile web browsers with zero friction, allowing customers to complete feedback in under 30 seconds.',
    },
    {
      q: 'Can customers leave private feedback for management?',
      a: 'Yes. Customers can submit constructive criticism, private comments, and contact details directly to your owner dashboard. Negative feedback routes privately to your inbox so you can resolve issues before they escalate.',
    },
    {
      q: 'Does ReviewFlow publish reviews to Google automatically on behalf of customers?',
      a: 'No. In strict adherence to Google’s terms of service, only the customer can publish a review under their personal Google account. ReviewFlow guides satisfied customers to your official Google review link with a single tap, making the review process as seamless as possible.',
    },
    {
      q: 'Can I customize my QR campaigns with our business branding?',
      a: 'Yes. You can customize the campaign title, upload your business logo, choose custom brand colors, and export in crisp high-resolution PNG, SVG, or vector PDF formats ready for professional commercial printers.',
    },
    {
      q: 'Are online subscription payments active right now?',
      a: 'The subscription models and plan foundation are fully established in the platform architecture. Self-serve online payment processing with live gateways will be activated in an upcoming release.',
    },
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-24 bg-brand-background border-b border-brand-border relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with smooth scroll reveal */}
        <div
          className={cn(
            'text-center space-y-3 transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-brand-text-secondary border border-slate-200 shadow-2xs hover:scale-105 hover:bg-slate-200/60 transition-transform duration-200 cursor-default">
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text-primary">
            Clear Answers to Common Questions
          </h2>
          <p className="text-sm text-brand-text-secondary leading-relaxed max-w-xl mx-auto">
            Everything you need to know about QR campaigns, review policies, and customer privacy.
          </p>
        </div>

        {/* FAQ Items with staggered scroll reveal and micro-animations */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div
                key={faq.q}
                style={{
                  transitionDelay: `${idx * 60}ms`,
                }}
                className={cn(
                  'transform-gpu transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                <Card
                  className={cn(
                    'border overflow-hidden transition-all duration-300 ease-out rounded-2xl group',
                    isOpen
                      ? 'border-indigo-200 shadow-subtle ring-2 ring-indigo-500/10'
                      : 'border-brand-border hover:border-slate-300 hover:shadow-card hover:-translate-y-0.5'
                  )}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleItem(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus-ring rounded-2xl bg-brand-surface hover:bg-slate-50/60 transition-colors duration-200 cursor-pointer"
                  >
                    <span
                      className={cn(
                        'font-bold text-sm sm:text-base transition-colors duration-200',
                        isOpen ? 'text-indigo-950 font-extrabold' : 'text-brand-text-primary group-hover:text-indigo-900'
                      )}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={cn(
                        'p-1.5 rounded-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        isOpen
                          ? 'bg-indigo-100 text-indigo-700 rotate-180 scale-110'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                      )}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" aria-hidden="true" />
                    </div>
                  </button>

                  {/* Smooth height expansion micro-animation using CSS grid-template-rows */}
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1.5 text-xs sm:text-sm text-brand-text-secondary leading-relaxed border-t border-brand-border/60 bg-brand-surface/90 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>{faq.a}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
